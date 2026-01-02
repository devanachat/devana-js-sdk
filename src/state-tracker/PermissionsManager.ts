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
} from "../types/src";
import {EventHandler, EventTarget} from "../EventTarget";
import {IndexedCollection} from "../IndexedObjectCollection";
import {Permissions} from "../Permissions";
import {PromiseRegistry} from "./AsyncUtils";

const getOvId = (
    location: ChatLocation,
    target?: PermissionOverwritesTarget,
) => [location.roomId, location.topicId, target?.type, target?.userId, target?.roleId].filter(Boolean).join('/');

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

export class PermissionsManager extends EventTarget {
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

    public on(eventName: 'change', handler: EventHandler<any>): this {
        return super.on(eventName, handler);
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

    public async calculatePermissions(location: ChatLocation): Promise<number> {
        this.validateLocation(location);

        const userId = (await this.tracker.getMe()).id;
        const [spaceMember, roomMember] = await this.fetchMembersOrFail(location);
        const userRoles: string[] = [...(spaceMember?.roles ?? []), ...(roomMember?.roles ?? [])];
        const promises: Promise<PermissionOverwritesValue>[] = [
            // Global user overwrites
            this.getOverwrites({}, { type: 'User', userId }).then(v => v.overwrites),
        ];

        if (location.spaceId && (await this.tracker.spaces.get())?.has(location.spaceId)) {
            const filterLocation: ChatLocation = {spaceId: location.spaceId};
            promises.push(this.collectRoleOverwrites(filterLocation, userRoles));
            promises.push(this.getOverwrites(filterLocation, { type: 'User', userId }).then(v => v.overwrites));
        }

        if (location.roomId && (await this.tracker.rooms.get())?.has(location.roomId)) {
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

        return this.resolveOverwritesHierarchy(await Promise.all(promises));
    }

    private handlePermissionOverwrites(ev: PermissionOverwritesUpdated | PermissionOverwrites): void {
        this.overwrites.set([getOvIdByObject(ev), ev]);
        this.emit('change');
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
    ): Promise<PermissionOverwritesValue> {
        const roleOverwrites = await Promise.all(userRoles.map(
            roleId => this.getOverwrites(location, { type: 'Role', roleId }),
        ));

        return this.resolveOverwritesFromRolesByOrder(location.spaceId, roleOverwrites);
    }

    private async resolveOverwritesFromRolesByOrder(
        spaceId: string,
        overwrites: PermissionOverwrites[],
    ): Promise<PermissionOverwritesValue> {
        let allows = 0, denies = 0;
        const roles = await this.tracker.spaces.getRoles(spaceId);
        const sortedOverwrites = overwrites.sort(
            (a, b) =>
                roles.get(a.target.roleId).priority - roles.get(b.target.roleId).priority
        );

        // Max length of bit word
        const permissionsLength = overwrites.reduce(
            (previousValue: number, currentValue: PermissionOverwrites) =>
                Math.max(
                    previousValue,
                    currentValue.overwrites.allow?.toString(2).length ?? 0,
                    currentValue.overwrites.deny?.toString(2).length ?? 0,
                ),
            0,
        );

        sortedOverwrites.forEach(overwriteEvent => {
            const overwrites = overwriteEvent.overwrites;
            const revDecDenies = overwrites.deny?.toString(2).split('').reverse().join('') ?? '';
            const revDecAllows = overwrites.allow?.toString(2).split('').reverse().join('') ?? '';

            for (let i = 0; i < permissionsLength; i++) {
                const deny = parseInt(revDecDenies[i] ?? '0');
                const allow = parseInt(revDecAllows[i] ?? '0');

                if (deny) {
                    denies |= 1 << i;
                }

                if (allow) {
                    allows |= 1 << i;
                }
            }
        });

        return {allow: allows, deny: denies};
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
        this.overwrites.deleteAll();
        this.overwritesPromises.forgetAll();
    }
}