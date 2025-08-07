import {ChatStateTracker} from "./ChatStateTracker";
import {IndexedCollection, ObservableIndexedObjectCollection} from "../IndexedObjectCollection";
import {
    NewRole,
    NewRoom,
    Role,
    RoleDeleted,
    RoleUpdated,
    RoomDeleted,
    RoomSummary,
    RoomSummaryUpdated,
    RoomUpdated,
    Session,
    Space,
    SpaceDeleted,
    SpaceJoined,
    SpaceLeft,
    SpaceMember,
    SpaceMemberJoined,
    SpaceMemberLeft,
    SpaceMembers,
    SpaceMemberUpdated,
    SpaceRooms,
    SpaceUpdated,
    UserUpdated
} from "../types/src";
import {DeferredTask, PromiseRegistry} from "./AsyncUtils";
import {reorderRolesOnPriorityUpdate} from "./functions";

export class SpacesManager {
    private readonly list = new ObservableIndexedObjectCollection<Space>('id');
    private readonly roles = new IndexedCollection<string, ObservableIndexedObjectCollection<Role>>();
    private readonly rooms = new IndexedCollection<string, ObservableIndexedObjectCollection<RoomSummary>>();
    private readonly roomIdToSpaceId = new IndexedCollection<string, string>();
    private readonly members = new IndexedCollection<string, ObservableIndexedObjectCollection<SpaceMember>>();
    private readonly deferredSession = new DeferredTask();
    private readonly roomsPromises = new PromiseRegistry();
    private readonly membersPromises = new PromiseRegistry();

    public constructor(private tracker: ChatStateTracker) {
        this.tracker.client.on('NewRoom', ev => this.handleNewRoom(ev));
        this.tracker.client.on('RoomDeleted', ev => this.handleRoomDeleted(ev));
        this.tracker.client.on('RoomUpdated', ev => this.handleRoomUpdated(ev));
        this.tracker.client.on('SpaceDeleted', ev => this.handleSpaceDeleted(ev));
        this.tracker.client.on('SpaceUpdated', ev => this.handleSpaceUpdated(ev));
        this.tracker.client.on('SpaceJoined', ev => this.handleSpaceJoined(ev));
        this.tracker.client.on('SpaceLeft', ev => this.handleSpaceDeleted(ev));
        this.tracker.client.on('SpaceMemberJoined', ev => this.handleSpaceMemberJoined(ev));
        this.tracker.client.on('SpaceMemberLeft', ev => this.handleSpaceMemberLeft(ev));
        this.tracker.client.on('SpaceMembers', ev => this.handleSpaceMembers(ev));
        this.tracker.client.on('SpaceRooms', ev => this.handleSpaceRooms(ev));
        this.tracker.client.on('RoomSummaryUpdated', ev => this.handleRoomSummaryUpdated(ev));
        this.tracker.client.on('SpaceMemberUpdated', ev => this.handleSpaceMemberUpdated(ev));
        this.tracker.client.on('UserUpdated', ev => this.handleUserUpdated(ev));
        this.tracker.client.on('NewRole', ev => this.handleNewRole(ev));
        this.tracker.client.on('RoleDeleted', ev => this.handleRoleDeleted(ev));
        this.tracker.client.on('RoleUpdated', ev => this.handleRoleUpdated(ev));
        this.tracker.client.on('Session', ev => this.handleSession(ev));
    }

    /**
     * Get collection of all the spaces you are in.
     */
    public async get(): Promise<ObservableIndexedObjectCollection<Space>> {
        await this.deferredSession.promise;
        return this.list;
    }

    /**
     * Get collection of space roles.
     */
    public async getRoles(spaceId: string): Promise<ObservableIndexedObjectCollection<Role> | undefined> {
        await this.deferredSession.promise;
        return this.roles.get(spaceId);
    }

    /**
     * Get collection of the all available rooms inside given space.
     */
    public async getRooms(spaceId: string): Promise<ObservableIndexedObjectCollection<RoomSummary> | undefined> {
        if (this.roomsPromises.notExist(spaceId)) {
            this.roomsPromises.registerByFunction(async () => {
                const result = await this.tracker.client.send('GetSpaceRooms', {id: spaceId});
                if (result.error) {
                    throw result.error;
                }
                this.handleSpaceRooms(result.data);
            }, spaceId);
        }

        await this.roomsPromises.get(spaceId);
        return this.rooms.get(spaceId);
    }

    /**
     * Get collection of space members.
     */
    public async getMembers(spaceId: string): Promise<ObservableIndexedObjectCollection<SpaceMember> | undefined> {
        if (this.membersPromises.notExist(spaceId)) {
            this.membersPromises.registerByFunction(async () => {
                const result = await this.tracker.client.send('GetSpaceMembers', {id: spaceId});
                if (result.error) {
                    throw result.error;
                }
                this.handleSpaceMembers(result.data);
            }, spaceId);
        }

        await this.membersPromises.get(spaceId);
        return this.members.get(spaceId);
    }

    /**
     * Get a space member representing the current user.
     */
    public async getMe(spaceId: string): Promise<SpaceMember | undefined> {
        const userId = (await this.tracker.getMe()).id;

        if (! this.list.has(spaceId)) {
            // User is not in passed space.
            return undefined;
        }

        const members = await this.getMembers(spaceId);
        return members?.items.find(member => member.user.id === userId);
    }

    private handleNewRole(ev: NewRole): void {
        const collection = this.roles.get(ev.spaceId);
        collection.set(ev.role);
        this.list.get(ev.spaceId).roles = collection.items;
    }

    private handleNewRoom(ev: NewRoom): void {
        this.rooms.get(ev.spaceId)?.set(ev.summary);
        this.roomIdToSpaceId.set([ev.summary.id, ev.spaceId]);
    }

    private handleRoomUpdated(ev: RoomUpdated): void {
        if (ev.room.spaceId && this.rooms.has(ev.room.spaceId)) {
            const rooms = this.rooms.get(ev.room.spaceId);
            rooms.set({
                ...rooms.get(ev.room.id),
                name: ev.room.name,
                description: ev.room.description,
            } as RoomSummary);
        }
    }

    private async handleRoomDeleted(ev: RoomDeleted): Promise<void> {
        const spaceId = this.roomIdToSpaceId.get(ev.id);
        this.roomIdToSpaceId.delete(ev.id);

        if (! spaceId) {
            return;
        }

        const space = this.list.get(spaceId);
        let spaceChanged = false;

        this.rooms.get(spaceId)?.delete(ev.id);

        if (space.systemRoom === ev.id) {
            space.systemRoom = null;
            spaceChanged = true;
        }

        if (space.defaultRooms.includes(ev.id)) {
            space.defaultRooms = space.defaultRooms.filter(roomId => roomId !== ev.id);
            spaceChanged = true;
        }

        if (spaceChanged) {
            this.list.set(space);
        }
    }

    private handleRoleDeleted(ev: RoleDeleted): void {
        const collection = this.roles.get(ev.spaceId);
        collection.delete(ev.id);
        this.list.get(ev.spaceId).roles = collection.items;
    }

    private handleSpaceUpdated(ev: SpaceUpdated): void {
        this.list.set(ev.space);
    }

    private handleSpaceDeleted(ev: SpaceDeleted | SpaceLeft): void {
        const roomIds = this.rooms.get(ev.id)?.items.map(item => item.id) ?? [];
        this.roomIdToSpaceId.delete(...roomIds);

        this.roles.delete(ev.id);
        this.members.delete(ev.id);
        this.membersPromises.forget(ev.id);
        this.rooms.delete(ev.id);
        this.roomsPromises.forget(ev.id);
        this.list.delete(ev.id);
    }

    private handleSpaceJoined(ev: SpaceJoined): void {
        this.addJoinedSpaces(ev.space);
    }

    private addJoinedSpaces(...spaces: Space[]): void {
        this.roles.set(...(spaces.map(space => [
            space.id,
            new ObservableIndexedObjectCollection<Role>('id', space.roles)
        ]) as [string, ObservableIndexedObjectCollection<Role>][]));
        this.list.set(...spaces);
    }

    private handleSpaceMemberJoined(ev: SpaceMemberJoined): void {
        if (this.members.has(ev.spaceId)) {
            this.members.get(ev.spaceId).set(ev.member);
        }
    }

    private handleSpaceMemberLeft(ev: SpaceMemberLeft): void {
        if (this.members.has(ev.spaceId)) {
            this.members.get(ev.spaceId).delete(ev.userId);
        }
    }

    private handleSpaceMembers(ev: SpaceMembers): void {
        if (! this.members.has(ev.id)) {
            this.members.set([
                ev.id,
                new ObservableIndexedObjectCollection(member => member?.user.id, ev.members)
            ]);
        }
    }

    private handleSpaceRooms(ev: SpaceRooms): void {
        if (!this.rooms.has(ev.id)) {
            this.rooms.set([ev.id, new ObservableIndexedObjectCollection('id', ev.summaries)]);
            ev.summaries.forEach(summary => this.roomIdToSpaceId.set([summary.id, ev.id]));
        }
    }

    private async handleRoomSummaryUpdated(ev: RoomSummaryUpdated): Promise<void> {
        const spaceId = this.roomIdToSpaceId.get(ev.summary.id);
        const summariesPromise = this.roomsPromises.get(spaceId);

        /**
         * Update summary only if the list was already loaded.
         * RoomSummaryUpdated event has a partial summary, so we need to update the existing summary by merging it.
         */
        if (spaceId && summariesPromise) {
            await summariesPromise;

            const summaries = this.rooms.get(spaceId);
            const oldSummary = summaries.get(ev.summary.id);
            let newSummary: RoomSummary;

            if (oldSummary) {
                newSummary = {...oldSummary, ...ev.summary};
            } else {
                newSummary = ev.summary;
            }

            summaries.set(newSummary);
        }
    }

    private handleSpaceMemberUpdated(ev: SpaceMemberUpdated): void {
        if (this.members.has(ev.spaceId)) {
            const members = this.members.get(ev.spaceId);
            const member = members.get(ev.userId);
            members.set({...ev.member, user: member.user});
        }
    }

    private handleRoleUpdated(ev: RoleUpdated): void {
        const roles = this.roles.get(ev.spaceId);
        const oldRole = roles.get(ev.role.id);
        const newRole = ev.role;
        const rolesToUpdate = [newRole];

        if (oldRole.priority !== newRole.priority) {
            rolesToUpdate.push(
                ...reorderRolesOnPriorityUpdate(roles.items, oldRole, newRole)
            );
        }

        this.roles.get(ev.spaceId).set(...rolesToUpdate);
    }

    private handleSession(ev: Session): void {
        this.list.deleteAll();
        this.roles.deleteAll();
        this.rooms.deleteAll();
        this.roomsPromises.forgetAll();
        this.members.deleteAll();
        this.membersPromises.forgetAll();
        this.roomIdToSpaceId.deleteAll();

        this.addJoinedSpaces(...ev.state.spaces);

        this.deferredSession.resolve();
    }

    private handleUserUpdated(ev: UserUpdated): void {
        this.members.items.forEach((members) => {
            const member = members.get(ev.user.id);

            if (! member) {
                // Skip space; updated user is not here
                return;
            }

            members.set({...member, user: ev.user});
        });
    }
}