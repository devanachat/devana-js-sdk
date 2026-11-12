import {ChatStateTracker} from "./ChatStateTracker";
import {
    ChatLocation,
    PermissionOverwrites, PermissionOverwritesTarget,
    PermissionOverwritesUpdated,
    PermissionOverwritesValue,
    RoleDeleted,
    RoomDeleted,
    RoomLeft, RoomMember, RoomMemberUpdated, Session,
    SpaceDeleted,
    SpaceLeft, SpaceMember,
    SpaceMemberUpdated,
    TopicDeleted,
} from "../protocol";
import {ChangeEventMap, EventTarget} from "../EventTarget";
import {IndexedCollection} from "../IndexedObjectCollection";
import {Permissions} from "../Permissions";
import {PromiseRegistry} from "./AsyncUtils";

const getOvId = (
    location: ChatLocation,
    target?: PermissionOverwritesTarget,
) => [location.spaceId, location.roomId, location.topicId, target?.type, target?.userId, target?.roleId].filter(Boolean).join('/');

const getOvIdByObject
    = (overwrites: PermissionOverwrites | PermissionOverwritesUpdated): string => getOvId(overwrites.location, overwrites.target);

interface CheckPermissionsResult {
    /**
     * @deprecated Use `hasAll` instead.
     */
    ok: boolean;
    hasAll: boolean;
    hasAny: boolean;
    missing: string[];
}

type PermissionsManagerEventMap = ChangeEventMap<void>;

export class PermissionsManager extends EventTarget<PermissionsManagerEventMap> {
    private readonly overwrites = new IndexedCollection<string, PermissionOverwrites>();
    private readonly overwritesPromises = new PromiseRegistry();

    public constructor(private tracker: ChatStateTracker) {
        super();
        this.tracker.client.on('PermissionOverwrites', ev => this.handlePermissionOverwrites(ev));
        this.tracker.client.on('PermissionOverwritesUpdated', ev => this.handlePermissionOverwrites(ev));
        this.tracker.client.on('SpaceDeleted', ev => this.handleSpaceDeleted(ev));
        this.tracker.client.on('SpaceLeft', ev => this.handleSpaceDeleted(ev));
        this.tracker.client.on('RoomDeleted', ev => this.handleRoomDeleted(ev));
        this.tracker.client.on('RoomLeft', ev => this.handleRoomDeleted(ev));
        this.tracker.client.on('TopicDeleted', ev => this.handleTopicDeleted(ev));
        this.tracker.client.on('RoleDeleted', ev => this.handleRoleDeleted(ev));
        this.tracker.client.on('SpaceMemberUpdated', ev => this.handleSpaceMemberUpdated(ev));
        this.tracker.client.on('RoomMemberUpdated', ev => this.handleRoomMemberUpdated(ev));
        this.tracker.client.on('Session', ev => this.handleSession(ev));
    }

    public async getOverwrites(
        location: ChatLocation,
        target: PermissionOverwritesTarget,
    ): Promise<PermissionOverwrites | undefined> {
        this.validateLocation(location);

        const id = getOvId(location, target);

        if (this.overwritesPromises.notExist(id)) {
            this.overwritesPromises.registerByFunction(async () => {
                const result = await this.tracker.client.send(
                    'GetPermissionOverwrites',
                    {location, target},
                );
                if (result.error) {
                    throw result.error;
                }
                this.handlePermissionOverwrites(result.data);
            }, id);
        }

        await this.overwritesPromises.get(id);
        return this.overwrites.get(id);
    }

    public async check(
        permissionNames: (keyof typeof Permissions.list)[],
        location: ChatLocation,
    ): Promise<CheckPermissionsResult> {
        if (! permissionNames.length) {
            throw new Error('Permission names array cannot be empty');
        }

        const ownedPermissions = await this.calculatePermissions(location);
        const missing: string[] = [];

        permissionNames.forEach(name => {
            if (~ ownedPermissions & Permissions.getByName(name).value) {
                missing.push(name as string);
            }
        });

        return {
            ok: missing.length === 0,
            hasAll: missing.length === 0,
            hasAny: missing.length < permissionNames.length,
            missing,
        };
    }

    /**
     * For a room or a space you have not joined the permissions are fetched from the server, on every call.
     */
    public async calculatePermissions(location: ChatLocation): Promise<number> {
        const room = location.roomId ? (await this.tracker.rooms.get()).get(location.roomId) : null;
        location = {
            spaceId: location.spaceId ?? room?.spaceId,
            roomId: location.roomId,
            topicId: location.topicId,
        };

        this.validateLocation(location);

        if ((location.roomId && ! room) || (location.spaceId && ! (await this.tracker.spaces.get())?.has(location.spaceId))) {
            return this.fetchComputedPermissions(location);
        }

        const userId = (await this.tracker.getMe()).id;
        const [spaceMember, roomMember] = await this.fetchMembersOrFail(location);
        const userRoles: string[] = [...(spaceMember?.roles ?? []), ...(roomMember?.roles ?? [])];
        const promises: Promise<PermissionOverwritesValue | PermissionOverwritesValue[]>[] = [
            // Global user overwrites
            this.getOverwrites({}, { type: 'User', userId }).then(v => v.overwrites),
        ];

        if (location.spaceId && (await this.tracker.spaces.get())?.has(location.spaceId)) {
            const filterLocation: ChatLocation = {spaceId: location.spaceId};
            promises.push(this.collectRoleOverwrites(filterLocation, userRoles));
            promises.push(this.getOverwrites(filterLocation, { type: 'User', userId }).then(v => v.overwrites));
        }

        if (room) {
            const filterLocation: ChatLocation = {spaceId: location.spaceId, roomId: location.roomId};
            if (userRoles.length) {
                promises.push(this.collectRoleOverwrites(filterLocation, userRoles));
            }
            promises.push(this.getOverwrites(filterLocation, { type: 'User', userId }).then(v => v.overwrites));
        }

        if (location.topicId && (await this.tracker.rooms.getTopics(location.roomId))?.has(location.topicId)) {
            if (userRoles.length) {
                promises.push(this.collectRoleOverwrites(location, userRoles));
            }
            promises.push(this.getOverwrites(location, { type: 'User', userId }).then(v => v.overwrites));
        }

        return this.resolveOverwritesHierarchy(([] as PermissionOverwritesValue[]).concat(...await Promise.all(promises)));
    }

    /**
     * Arriving overwrites change the permissions only when they replace different ones. The first ones fetched for a
     * key have not been part of any result yet - every calculation needing them awaits their fetch - and a fetch
     * response arrives twice, as the command result and as an event.
     */
    private handlePermissionOverwrites(ev: PermissionOverwritesUpdated | PermissionOverwrites): void {
        const id = getOvIdByObject(ev);
        const previous = this.overwrites.get(id);

        this.overwrites.set([id, ev]);

        if (previous && (previous.overwrites.allow !== ev.overwrites.allow || previous.overwrites.deny !== ev.overwrites.deny)) {
            this.emit('change');
        }
    }

    private handleSpaceDeleted(ev: SpaceDeleted | SpaceLeft): void {
        const ids = this.deleteOverwritesByIdPrefix(getOvId({spaceId: ev.id}));
        this.overwritesPromises.forget(...ids);
    }

    private async handleRoomDeleted(ev: RoomDeleted | RoomLeft): Promise<void> {
        const room = (await this.tracker.rooms.get()).get(ev.id);
        if (room) {
            const ids = this.deleteOverwritesByIdPrefix(getOvId({spaceId: room.spaceId, roomId: room.id}));
            this.overwritesPromises.forget(...ids);
        }
    }

    private handleTopicDeleted(ev: TopicDeleted): void {
        const ids = this.deleteOverwritesByIdPrefix(getOvId(ev.location));
        this.overwritesPromises.forget(...ids);
    }

    private handleRoleDeleted(ev: RoleDeleted): void {
        const ids = this.deleteOverwritesByIdPrefix(getOvId({spaceId: ev.spaceId}, { type: 'Role', roleId: ev.id }));
        this.overwritesPromises.forget(...ids);
    }

    private handleSpaceMemberUpdated(ev: SpaceMemberUpdated): void {
        if (ev.userId === this.tracker.me?.id) {
            // User roles in space could potentially have changed
            this.emit('change');
        }
    }

    private handleRoomMemberUpdated(ev: RoomMemberUpdated): void {
        if (ev.userId === this.tracker.me?.id) {
            // User roles in room could potentially have changed
            this.emit('change');
        }
    }

    /**
     * @return Matched and deleted ids
     */
    private deleteOverwritesByIdPrefix(prefix: string): string[] {
        const ids: string[] = [];
        this.overwrites.items.forEach((overwrites) => {
            const id = getOvIdByObject(overwrites);
            if (id.startsWith(prefix)) {
                ids.push(id);
                this.overwrites.delete(id);
            }
        });
        return ids;
    }

    private async collectRoleOverwrites(
        location: ChatLocation,
        userRoles: string[],
    ): Promise<PermissionOverwritesValue[]> {
        const roleOverwrites = await Promise.all(userRoles.map(
            roleId => this.getOverwrites(location, { type: 'Role', roleId }),
        ));
        // The space default role (everyone) has the space id; it is applied before the other roles, as on the server.
        const isDefaultRole = (overwrites: PermissionOverwrites) => overwrites.target.roleId === location.spaceId;

        return [
            this.mergeRolesOverwrites(roleOverwrites.filter(isDefaultRole)),
            this.mergeRolesOverwrites(roleOverwrites.filter(overwrites => ! isDefaultRole(overwrites))),
        ];
    }

    private mergeRolesOverwrites(rolesOverwrites: PermissionOverwrites[]): PermissionOverwritesValue {
        let allow = 0, deny = 0;

        for (const {overwrites} of rolesOverwrites) {
            allow |= overwrites.allow ?? 0;
            deny |= overwrites.deny ?? 0;
        }

        return {allow, deny};
    }

    private resolveOverwritesHierarchy(permissionOverwritesValues: PermissionOverwritesValue[]): number {
        let result = 0;

        for (const value of permissionOverwritesValues) {
            if (value.allow & Permissions.getByName('Root').value) {
                return this.getRootAccessValue();
            }

            result = (result & ~value.deny) | value.allow;
        }

        return result;
    }

    private getRootAccessValue(): number {
        let result = 0;

        for (const name of Permissions.getNames()) {
            result |= Permissions.getByName(name).value;
        }

        return result;
    }

    private async fetchComputedPermissions(location: ChatLocation): Promise<number> {
        const result = await this.tracker.client.send('GetComputedPermissions', {location});

        if (result.error) {
            throw result.error;
        }

        return result.data.permissions;
    }

    private async fetchMembersOrFail(location: ChatLocation): Promise<[SpaceMember | null, RoomMember | null]> {
        const results = await Promise.all([
            location.spaceId ? this.tracker.spaces.getMe(location.spaceId) : null,
            location.roomId ? this.tracker.rooms.getMe(location.roomId) : null,
        ]);

        const spaceFail = location.spaceId && ! results[0];
        const roomFail = location.roomId && ! results[1];

        if (spaceFail || roomFail) {
            const layer = spaceFail ? `space (${location.spaceId})` : `room (${location.roomId})`;
            throw new Error(`Attempting to calculate permissions for a ${layer} that the user does not belong to`);
        }

        return results;
    }

    private validateLocation(location: ChatLocation): void {
        if (location.topicId && ! location.roomId) {
            throw new Error('Corrupted arguments hierarchy');
        }
    }

    private handleSession(ev: Session): void {
        // Drop the fetch guards so permission checks recompute against fresh
        // overwrites (getOverwrites refetches and upserts on the next access),
        // and notify consumers to recompute so bound permission UI is never
        // left showing stale results after a reconnect.
        this.overwritesPromises.forgetAll();
        this.emit('change');
    }
}