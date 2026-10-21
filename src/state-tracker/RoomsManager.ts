import {IndexedCollection, ObservableIndexedObjectCollection} from "../IndexedObjectCollection";
import {
    Message,
    MessagesRedacted,
    NewMessage,
    NewTopic,
    Room, RoomDeleted,
    RoomJoined, RoomLeft,
    RoomMember, RoomMemberLeft, RoomMembers, RoomMembersJoined,
    RoomMemberUpdated, RoomUpdated, Session, SpaceDeleted, SpaceLeft, SpaceMemberLeft,
    SpaceMemberUpdated,
    Topic,
    TopicDeleted, TopicUpdated,
    UserUpdated,
} from "../protocol";
import {ChatStateTracker} from "./ChatStateTracker";
import {DeferredTask, PromiseRegistry} from "./AsyncUtils";
import {MessagesManager} from "./MessagesManager";
import {FollowedTopicsManager} from "./FollowedTopicsManager";
import {
    memberWithoutPresence,
    messageWithoutPresence,
    RoomMembersSnapshot,
    StateSnapshotIntent,
    TopicHistorySnapshot,
    withoutPresence,
} from "./StateSnapshot";

export class RoomsManager {
    public readonly messages: MessagesManager;
    public readonly followedTopics: FollowedTopicsManager;

    private readonly list = new ObservableIndexedObjectCollection<Room>('id');
    private readonly topics = new IndexedCollection<string, ObservableIndexedObjectCollection<Topic>>();
    private readonly members = new IndexedCollection<string, ObservableIndexedObjectCollection<RoomMember>>();
    private readonly deferredSession = new DeferredTask();
    private readonly membersPromises = new PromiseRegistry();
    private readonly topicsPromises = new PromiseRegistry();
    private readonly importedTopicIds = new Map<string, Set<string>>();

    public constructor(private tracker: ChatStateTracker) {
        this.messages = new MessagesManager(tracker);
        this.followedTopics = new FollowedTopicsManager(tracker);

        this.tracker.client.on('NewMessage', ev => this.handleNewMessage(ev));
        this.tracker.client.on('MessagesRedacted', ev => this.handleMessagesRedacted(ev));
        this.tracker.client.on('NewTopic', ev => this.handleNewTopic(ev));
        this.tracker.client.on('TopicDeleted', ev => this.handleTopicDeleted(ev));
        this.tracker.client.on('RoomJoined', ev => this.handleRoomJoined(ev));
        this.tracker.client.on('RoomLeft', ev => this.handleRoomLeft(ev));
        this.tracker.client.on('RoomUpdated', ev => this.handleRoomUpdated(ev));
        this.tracker.client.on('RoomDeleted', ev => this.handleRoomDeleted(ev));
        this.tracker.client.on('TopicUpdated', ev => this.handleTopicUpdated(ev));
        this.tracker.client.on('RoomMembersJoined', ev => this.handleRoomMembersJoined(ev));
        this.tracker.client.on('RoomMemberLeft', ev => this.handleRoomMemberLeft(ev));
        this.tracker.client.on('RoomMembers', ev => this.handleRoomMembers(ev));
        this.tracker.client.on('RoomMemberUpdated', ev => this.handleRoomMemberUpdated(ev));
        this.tracker.client.on('SpaceMemberLeft', ev => this.handleSpaceMemberLeft(ev));
        this.tracker.client.on('SpaceMemberUpdated', ev => this.handleSpaceMemberUpdated(ev));
        this.tracker.client.on('SpaceDeleted', ev => this.handleSpaceDeleted(ev));
        this.tracker.client.on('SpaceLeft', ev => this.handleSpaceDeleted(ev));
        this.tracker.client.on('UserUpdated', ev => this.handleUserUpdated(ev));
        this.tracker.client.on('Session', ev => this.handleSession(ev));
    }

    /**
     * Get collection of room members.
     */
    public async getMembers(roomId: string): Promise<ObservableIndexedObjectCollection<RoomMember> | undefined> {
        if (this.membersPromises.notExist(roomId)) {
            this.membersPromises.registerByFunction(async () => {
                const result = await this.tracker.client.send('GetRoomMembers', {id: roomId});
                if (result.error) {
                    throw result.error;
                }
                this.handleRoomMembers(result.data);
            }, roomId);
        }

        await this.membersPromises.get(roomId);
        return this.members.get(roomId);
    }

    /**
     * Get a room member representing the current user.
     */
    public async getMe(roomId: string): Promise<RoomMember | undefined> {
        const userId = (await this.tracker.getMe()).id;

        if (! this.list.has(roomId)) {
            // User is not in passed room.
            return undefined;
        }

        const members = await this.getMembers(roomId);
        return members?.items.find(member => (member.user?.id ?? member.spaceMember.user.id) === userId);
    }

    /**
     * Get collection of all the rooms you are in.
     */
    public async get(): Promise<ObservableIndexedObjectCollection<Room>> {
        await this.deferredSession.promise;
        return this.list;
    }

    /**
     * Get a collection of locally cached Topic objects for given room.
     * You can pass topic ids as second argument, to try to fetch them from the server.
     */
    public async getTopics(roomId: string, tryToFetchTopicIds?: string[]): Promise<ObservableIndexedObjectCollection<Topic> | undefined> {
        await this.deferredSession.promise;

        if (tryToFetchTopicIds?.length) {
            // Topic can be fetched if it isn't already cached and fetch is not already in progress
            const canFetch = (topicId: string) => ! this.topics.get(roomId)?.has(topicId) && ! this.topicsPromises.has(roomId + topicId);
            const idsToFetch = tryToFetchTopicIds.filter(canFetch);

            if (idsToFetch.length) {
                const promise = this.tracker
                    .client
                    .send('GetTopics', {roomId, topicIds: idsToFetch})
                    .then(result => this.topics.get(result.data.location.roomId)?.set(...result.data.topics));

                idsToFetch.forEach(topicId => this.topicsPromises.register(promise, roomId + topicId));
            }

            for (const topicId of tryToFetchTopicIds) {
                await this.topicsPromises.get(roomId + topicId);
            }
        }

        return this.topics.get(roomId);
    }

    /**
     * For internal use.
     * @internal
     */
    public _getRoom(roomId: string): Room | undefined {
        return this.list.get(roomId);
    }

    /**
     * For internal use. If you want to delete topic, execute a proper command on client object.
     * @internal
     */
    public _deleteTopicsFromRoom(roomId: string, ...topicIds: string[]): void {
        this.topics.get(roomId)?.delete(...topicIds);
    }

    /**
     * For internal use.
     * @internal
     */
    public _exportRooms(): Room[] {
        return this.list.items.map(room => room.recipients
            ? {...room, recipients: room.recipients.map(withoutPresence)}
            : room);
    }

    /**
     * For internal use.
     * @internal
     */
    public _importRooms(rooms: Room[]): void {
        this.messages._importRooms(rooms);
        this.addJoinedRooms(...rooms);
        this.deferredSession.resolve();
    }

    /**
     * For internal use.
     * @internal
     */
    public _exportHistories(intent: StateSnapshotIntent): TopicHistorySnapshot[] {
        const histories: TopicHistorySnapshot[] = [];
        const exported = new Set<string>();

        for (const {roomId, topicId: requestedTopicId} of intent.histories ?? []) {
            const room = this.list.get(roomId);
            const topicId = requestedTopicId ?? room?.defaultTopic?.id;

            if (! room || ! topicId || exported.has(`${roomId}/${topicId}`)) {
                continue;
            }

            const latest = this.messages._exportLatest(roomId, topicId, intent.historyLimit ?? 0);
            const topics = this.topics.get(roomId);

            // A topic other than the default one is restored from the snapshot, so it has to be known.
            if (! latest || (topicId !== room.defaultTopic?.id && ! topics?.has(topicId))) {
                continue;
            }

            const topicIds = new Set<string>([topicId, ...latest.messages.map(message => message.topicRef)]);
            topicIds.delete(room.defaultTopic?.id);

            exported.add(`${roomId}/${topicId}`);
            histories.push({
                roomId,
                topicId,
                messages: latest.messages.map(messageWithoutPresence),
                myReactions: latest.myReactions,
                topics: Array.from(topicIds).filter(id => topics?.has(id)).map(id => topics.get(id)),
            });
        }

        return histories;
    }

    /**
     * Members of private conversations are not exported - they are made of the recipients of the room.
     * @internal
     */
    public _exportMembers(roomIds: string[], limit: number): RoomMembersSnapshot[] {
        const snapshots: RoomMembersSnapshot[] = [];

        if (! limit) {
            return snapshots;
        }

        for (const roomId of new Set(roomIds)) {
            const members = this.members.get(roomId);

            if (members && members.length <= limit && this.list.get(roomId)?.type !== 'Pm') {
                snapshots.push({roomId, members: members.items.map(memberWithoutPresence)});
            }
        }

        return snapshots;
    }

    /**
     * Expects the rooms to be imported already - histories and members of other rooms are skipped.
     * @internal
     */
    public _importHistories(histories: TopicHistorySnapshot[], roomMembers: RoomMembersSnapshot[]): void {
        for (const {roomId, members} of roomMembers) {
            if (this.list.has(roomId) && this.list.get(roomId).type !== 'Pm') {
                this.handleRoomMembers({id: roomId, members});
                // Served from the snapshot until the session invalidates it.
                this.membersPromises.register(Promise.resolve(), roomId);
            }
        }

        for (const history of histories) {
            const room = this.list.get(history.roomId);

            if (! room) {
                continue;
            }

            const topics = history.topics.filter(topic => topic.id !== room.defaultTopic?.id);

            if (topics.length) {
                this.addJoinedRoomTopics(room.id, ...topics);

                const importedTopicIds = this.importedTopicIds.get(room.id) ?? new Set<string>();
                topics.forEach(topic => importedTopicIds.add(topic.id));
                this.importedTopicIds.set(room.id, importedTopicIds);
            }

            const topic = history.topicId === room.defaultTopic?.id
                ? room.defaultTopic
                : this.topics.get(room.id)?.get(history.topicId);

            if (topic) {
                this.messages._importHistory(room.id, topic, history);
            }
        }
    }

    /**
     * The session carries only the default topics, so the other restored ones are fetched anew.
     * @internal
     */
    public _refreshImportedTopics(): void {
        const importedTopicIds = Array.from(this.importedTopicIds);
        this.importedTopicIds.clear();

        for (const [roomId, ids] of importedTopicIds) {
            if (! this.list.has(roomId)) {
                continue;
            }

            const topicIds = Array.from(ids);
            const promise = this.tracker.client.send('GetTopics', {roomId, topicIds}).then(result => {
                if (! result.error) {
                    this.topics.get(roomId)?.set(...result.data.topics);
                }
            });

            topicIds.forEach(topicId => this.topicsPromises.register(promise, roomId + topicId));
            // Best effort: on a failure the restored topics stay, as after a reconnect.
            promise.catch(() => undefined);
        }
    }

    private deleteRoom(...roomIds: string[]): void {
        this.list.delete(...roomIds);
        this.members.delete(...roomIds);
        this.membersPromises.forget(...roomIds);

        for (const roomId of roomIds) {
            const topicIds: string[] = this.topics.get(roomId)?.items.map(topic => topic.id) ?? [];
            this.followedTopics._deleteByTopicIds(roomId, ...topicIds);
        }

        this.topics.delete(...roomIds);
    }

    private deleteRoomsBySpaceId(spaceId: string): void {
        this.deleteRoom(
            ...this.list.findBy('spaceId', spaceId).items.map(room => room.id)
        );
    }

    private handleSpaceMemberUpdated(ev: SpaceMemberUpdated): void {
        // Update members of rooms related to this space
        for (const room of this.list.findBy('spaceId', ev.spaceId).items) {
            const roomMembers = this.members.get(room.id);

            if (!roomMembers || !roomMembers.has(ev.userId)) {
                // Skip update if member list for this room is not loaded
                // or user is not in room
                continue;
            }

            // Update space member in roomMember, but first fill the user object (it's null in event)
            const roomMember = roomMembers.get(ev.userId);
            roomMembers.set({ ...roomMember, spaceMember: { ...ev.member, user: roomMember.spaceMember.user } });
        }
    }

    private handleSpaceMemberLeft(ev: SpaceMemberLeft): void {
        this.list
            .findBy('spaceId', ev.spaceId).items
            .forEach(room => this.members.get(room.id)?.delete(ev.userId));
    }

    private handleRoomMemberUpdated(ev: RoomMemberUpdated): void {
        if (! this.members.has(ev.roomId)) {
            // We do not track member list for this room.
            return;
        }

        const members = this.members.get(ev.roomId);
        const member = members.get(ev.userId);
        const user = member.spaceMember?.user ?? member.user;

        // Preserving user object, because it's not included in event
        members.set(ev.member.spaceMember
            ? { ...ev.member, spaceMember: { ...ev.member.spaceMember, user } }
            : { ...ev.member, user });
    }

    private handleSpaceDeleted(ev: SpaceDeleted | SpaceLeft): void {
        this.deleteRoomsBySpaceId(ev.id);
    }

    private handleTopicDeleted(ev: TopicDeleted): void {
        const collection = this.topics.get(ev.location.roomId);
        collection.delete(ev.location.topicId);

        const room = this.list.get(ev.location.roomId);
        if (room.defaultTopic?.id === ev.location.topicId) {
            this.list.set({...room, defaultTopic: null});
        }
    }

    private handleNewTopic(ev: NewTopic): void {
        this.addJoinedRoomTopics(ev.roomId, ev.topic);
    }

    private addJoinedRoomTopics(roomId: string, ...topics: Topic[]): void {
        if (this.topics.has(roomId)) {
            this.topics.get(roomId).set(...topics);
        } else {
            this.topics.set([roomId, new ObservableIndexedObjectCollection<Topic>('id', topics)]);
        }
    }

    private handleRoomJoined(ev: RoomJoined): void {
        this.addJoinedRooms(ev.room);
    }

    private handleRoomUpdated(ev: RoomUpdated): void {
        if (this.list.has(ev.room.id)) {
            this.list.set(ev.room);
        }
    }

    private handleRoomDeleted(ev: RoomDeleted): void {
        this.deleteRoom(ev.id);
    }

    private handleTopicUpdated(ev: TopicUpdated): void {
        const room = this.list.get(ev.location.roomId);

        if (this.topics.get(ev.location.roomId)?.has(ev.topic.id)) {
            this.topics.get(ev.location.roomId).set(ev.topic);
        }

        if (room.defaultTopic.id === ev.topic.id) {
            const newRoom = { ...room };
            newRoom.defaultTopic = ev.topic;
            this.list.set(newRoom);
        }
    }

    private addJoinedRooms(...rooms: Room[]): void {
        for (const room of rooms) {
            if (room.defaultTopic) {
                this.addJoinedRoomTopics(room.id, room.defaultTopic);
            }

            if (room.type === 'Pm' && room.recipients) {
                // Treat PM recipients as normal room members.
                // We are registering fake promise in `memberPromises`
                // because GetMembers are not supported for PM rooms.
                this.handleRoomMembers({
                    id: room.id,
                    members: room.recipients.map(user => ({
                        user,
                        spaceMember: null,
                        roles: null,
                        customColor: null,
                        customNick: null,
                        customAvatar: null,
                        extras: '',
                    })),
                });
                this.membersPromises.register(Promise.resolve(), room.id);
            }
        }
        this.list.set(...rooms);
    }

    private handleRoomLeft(ev: RoomLeft): void {
        this.deleteRoom(ev.id);
    }

    private handleRoomMembersJoined(ev: RoomMembersJoined): void {
        if (this.members.has(ev.roomId)) {
            this.members.get(ev.roomId).set(...ev.members);
        }
    }

    private handleRoomMemberLeft(ev: RoomMemberLeft): void {
        if (this.members.has(ev.roomId)) {
            this.members.get(ev.roomId).delete(ev.userId);
        }
    }

    private handleRoomMembers(ev: RoomMembers): void {
        if (! this.members.has(ev.id)) {
            this.members.set([
                ev.id,
                new ObservableIndexedObjectCollection(
                    member => member.user?.id ?? member.spaceMember.user.id,
                    ev.members,
                )
            ]);
        } else {
            // Reconcile into the existing (bound) collection so a reconnect
            // refetch updates it in place instead of leaving stale members.
            this.members.get(ev.id).reconcile(...ev.members);
        }
    }

    private handleSession(ev: Session): void {
        const stateRoomIds = new Set(ev.state.rooms.map(room => room.id));

        // Remove only rooms that were left/deleted on the server during the
        // downtime, reusing the cascade cleanup (members, topics, followed
        // topics). Surviving rooms keep their identity and bindings.
        const removedRoomIds = this.list.items
            .filter(room => ! stateRoomIds.has(room.id))
            .map(room => room.id);
        if (removedRoomIds.length) {
            this.deleteRoom(...removedRoomIds);
        }

        // Invalidate lazy caches so the next access refetches fresh data, but
        // keep the collection objects: handleRoomMembers reconciles into them,
        // so bound views refresh in place without blanking.
        this.membersPromises.forgetAll();
        this.topicsPromises.forgetAll();

        // Upsert surviving/new rooms from the authoritative snapshot.
        this.addJoinedRooms(...ev.state.rooms);

        this.deferredSession.resolve();
    }

    private handleUserUpdated(ev: UserUpdated): void {
        // Update room members users
        this.members.items.forEach((members) => {
            const member = members.get(ev.user.id);

            if (! member) {
                // Skip room; updated user is not here
                return;
            }

            members.set(member.user
                ? {...member, user: ev.user}
                : {...member, spaceMember: {...member.spaceMember, user: ev.user}});
        });

        // Update recipients users
        const newRooms: Room[] = [];
        this.list.items.forEach(room => {
            if (room.recipients?.some(user => user.id === ev.user.id)) {
                newRooms.push({
                    ...room,
                    recipients: room.recipients.map(user => user.id === ev.user.id ? ev.user : user),
                });
            }
        });
        this.list.set(...newRooms);
    }

    private handleNewMessage(ev: NewMessage): void {
        const topics = this.topics.get(ev.message.location.roomId);
        const topic = topics?.get(ev.message.location.topicId);

        if (!topic) {
            return; // No topic found, nothing to update
        }

        const newTopic = {
            ...topic,
            messageCount: topic.messageCount + 1,
            lastMessage: ev.message,
        };

        topics.set(newTopic);
        this.updatePmDefaultTopic(ev.message.location.roomId, newTopic);
    }

    private async handleMessagesRedacted(ev: MessagesRedacted): Promise<void> {
        // Remove redacted messages from topic and update metadata
        const topics = this.topics.get(ev.location.roomId);
        const topic = topics?.get(ev.location.topicId);
        if (topic) {
            const messageCount = Math.max(topic.messageCount - ev.ids.length, 0);
            const lastMessage: Message = messageCount > 0 ? await this.messages._resolveLastMessage(ev.location) : null;
            const newTopic = { ...topic, messageCount, lastMessage } as Topic;
            topics.set(newTopic);
            this.updatePmDefaultTopic(ev.location.roomId, newTopic);
        }
    }

    /**
     * The topics collection is where the message counters of a topic are kept up to date; a room in the list
     * is not replaced on every message, as everything bound to the room would be rendered anew with it.
     * Private conversations are the exception - they are listed by their last message.
     */
    private updatePmDefaultTopic(roomId: string, topic: Topic): void {
        const room = this.list.get(roomId);

        if (room?.type === 'Pm' && room.defaultTopic?.id === topic.id) {
            this.list.set({ ...room, defaultTopic: topic });
        }
    }
}