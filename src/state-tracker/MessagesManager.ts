import {ChatStateTracker} from "./ChatStateTracker";
import {
    NewMessage,
    FollowedTopic,
    TopicFollowed,
    RoomDeleted,
    RoomLeft,
    TopicDeleted,
    FollowedTopicUpdated,
    RoomJoined,
    NewTopic,
    Session,
    Room,
    Message, ChatLocation,
} from "../types/src";
import {
    IndexedCollection,
    ObservableIndexedObjectCollection
} from "../IndexedObjectCollection";
import {DeferredTask, PromiseRegistry} from "./AsyncUtils";
import {RoomMessagesHistory} from "./RoomMessagesHistory";

export class MessagesManager {
    private readonly roomHistories = new IndexedCollection<string, RoomMessagesHistory>();
    private readonly followedTopics = new IndexedCollection<string, ObservableIndexedObjectCollection<FollowedTopic>>();
    private readonly followedTopicsPromises = new PromiseRegistry();
    private readonly deferredSession = new DeferredTask();
    private readonly unreadSummariesCache = new Map<string, { mentionCount: number, isUnread: boolean }>();

    public constructor(private tracker: ChatStateTracker) {
        this.tracker.client.on('Session', ev => this.handleSession(ev));
        this.tracker.client.on('RoomJoined', ev => this.handleRoomJoin(ev));
        this.tracker.client.on('NewTopic', ev => this.handleNewTopic(ev));
        this.tracker.client.on('FollowedTopicUpdated', ev => this.handleFollowedTopicUpdated(ev));
        this.tracker.client.on('TopicFollowed', ev => this.handleTopicFollowed(ev));
        this.tracker.client.on('NewMessage', ev => this.handleNewMessage(ev));
        this.tracker.client.on('RoomDeleted', ev => this.handleRoomDeleted(ev));
        this.tracker.client.on('RoomLeft', ev => this.handleRoomLeft(ev));
        this.tracker.client.on('TopicDeleted', ev => this.handleTopicDeleted(ev));
    }

    /**
     * Get history manager for given room ID.
     */
    public async getRoomHistory(roomId: string): Promise<RoomMessagesHistory | undefined> {
        await this.deferredSession.promise;
        return this.roomHistories.get(roomId);
    }

    /**
     * Cache followed topics for all joined rooms in a space and fetch them in bulk if necessary.
     * Then you can get them using getRoomFollowedTopics().
     * @see getRoomFollowedTopics
     */
    public async cacheSpaceFollowedTopics(spaceId: string | null): Promise<void> {
        if (spaceId && ! (await this.tracker.spaces.get()).has(spaceId)) {
            throw new Error(`You are not in space ${spaceId}`);
        }

        const roomIds = (await this.tracker.rooms.get()).findBy('spaceId', spaceId).items.map(room => room.id);

        if (! roomIds.length) {
            // We don't need to ping server for followed topics for this space, if user has no joined rooms
            return;
        }

        const resultPromise = this.tracker.client.send('GetFollowedTopics', {location: {spaceId}});

        roomIds.forEach(roomId => this.followedTopicsPromises.register(resultPromise, roomId));

        const result = await resultPromise;

        if (result.error) {
            throw result.error;
        }

        this.setFollowedTopicsArray(roomIds, result.data.followedTopics);
    }

    /**
     * Get followed topics for the given room.
     * @return Undefined if you are not in the room, collection otherwise.
     */
    public async getRoomFollowedTopics(roomId: string): Promise<ObservableIndexedObjectCollection<FollowedTopic> | undefined> {
        if (! (await this.tracker.rooms.get()).has(roomId)) {
            return undefined;
        }

        if (! this.followedTopics.has(roomId)) {
            if (this.followedTopicsPromises.notExist(roomId)) {
                this.followedTopicsPromises.registerByFunction(async () => {
                    const result = await this.tracker.client.send('GetFollowedTopics', {location: {roomId}});

                    if (result.error) {
                        throw result.error;
                    }

                    this.setFollowedTopicsArray([roomId], result.data.followedTopics);
                }, roomId);
            }

            await this.followedTopicsPromises.get(roomId);
        }

        return this.followedTopics.get(roomId);
    }

    /**
     * Batch acknowledge all messages for given room.
     */
    public async ackRoom(roomId: string): Promise<void> {
        const collection = await this.getRoomFollowedTopics(roomId);

        if (! collection) {
            return;
        }

        for (const followedTopic of collection.items) {
            if (followedTopic.isUnread) {
                await this.tracker.client.send('Ack', {location: followedTopic.location});
            }
        }
    }

    /**
     * Calculate missed messages with mentions from any topic in given room.
     * @return Undefined if you are not in room.
     */
    public async summarizeUnreadMessages(location: ChatLocation): Promise<{ mentionCount: number, isUnread: boolean }> {
        const cacheKey = location.topicId
            ? `topic:${location.roomId}:${location.topicId}`
            : location.roomId
                ? `room:${location.roomId}`
                : location.spaceId
                    ? `space:${location.spaceId}`
                    : 'spaceless';

        if (this.unreadSummariesCache.has(cacheKey)) {
            return this.unreadSummariesCache.get(cacheKey)!;
        }

        let roomIds: string[] = [];
        let targetTopicId: string | undefined;
        const rooms = await this.tracker.rooms.get();

        if (location.topicId) {
            if (!location.roomId) {
                throw new Error("roomId is required when querying by topicId");
            }
            roomIds = [location.roomId];
            targetTopicId = location.topicId;
        } else if (location.roomId) {
            roomIds = [location.roomId];
        } else if (location.spaceId) {
            await this.cacheSpaceFollowedTopics(location.spaceId);
            roomIds = rooms.findBy('spaceId', location.spaceId).items.map(r => r.id);
        } else {
            roomIds = rooms.items.filter(r => !r.spaceId).map(r => r.id);
        }

        let mentionCount = 0;
        let isUnread = false;

        for (const roomId of roomIds) {
            const collection = await this.getRoomFollowedTopics(roomId);

            if (!collection) {
                continue;
            }

            for (const topic of collection.items) {
                if (targetTopicId && topic.location.topicId !== targetTopicId) {
                    continue;
                }

                if (topic.isUnread) {
                    isUnread = true;
                }

                mentionCount += (topic.mentionCount ?? 0);
            }
        }

        const result = { mentionCount, isUnread };
        this.unreadSummariesCache.set(cacheKey, result);

        return result;
    }

    /**
     * For internal use. If you want to delete the message, execute a proper command on client object.
     * @internal
     */
    public _deleteByTopicIds(roomId: string, ...topicIds: string[]): void {
        this.followedTopics.get(roomId)?.delete(...topicIds);
        topicIds.forEach(topicId => this.invalidateUnreadSummaries(roomId, topicId));
    }

    /**
     * For internal use.
     * @internal
     */
    public async _resolveLastMessage(location: ChatLocation): Promise<Message|null> {
        // Try to get last message from history window (if cached)
        let message: Message = await this.getRoomHistory(location.roomId)
            .then(roomHistory => roomHistory?.getMessagesWindow(location.topicId, true))
            .then(
                historyWindow =>
                    historyWindow?.hasLatest && historyWindow.getAt(historyWindow.length - 1)
            );

        if (!message) {
            const result = await this.tracker.client.send('GetMessages', {
                location,
                limit: 1,
            });
            message = result.data?.messages[0];
        }

        return message || null;
    }

    /**
     * Wyczyść cache celowo, tylko dla lokalizacji których dotyczy zmiana.
     */
    private invalidateUnreadSummaries(roomId?: string, topicId?: string): void {
        if (!roomId) {
            this.unreadSummariesCache.clear();
            return;
        }

        this.unreadSummariesCache.delete(`room:${roomId}`);

        if (topicId) {
            this.unreadSummariesCache.delete(`topic:${roomId}:${topicId}`);
        } else {
            for (const key of this.unreadSummariesCache.keys()) {
                if (key.startsWith(`topic:${roomId}:`)) {
                    this.unreadSummariesCache.delete(key);
                }
            }
        }

        for (const key of this.unreadSummariesCache.keys()) {
            if (key.startsWith('space:') || key === 'spaceless') {
                this.unreadSummariesCache.delete(key);
            }
        }
    }

    private invalidateUnreadSummariesForRooms(roomIds: string[]): void {
        const roomIdsSet = new Set(roomIds);
        roomIds.forEach(roomId => {
            this.unreadSummariesCache.delete(`room:${roomId}`);
        });

        for (const key of this.unreadSummariesCache.keys()) {
            if (key.startsWith('space:') || key === 'spaceless') {
                this.unreadSummariesCache.delete(key);
                continue;
            }
            if (key.startsWith('topic:')) {
                const parts = key.split(':');
                if (parts.length >= 2 && roomIdsSet.has(parts[1])) {
                    this.unreadSummariesCache.delete(key);
                }
            }
        }
    }

    private createHistoryForNewRoom(room: Room): void {
        this.roomHistories.set([room.id, new RoomMessagesHistory(room, this.tracker)]);
    }

    private handleNewMessage(ev: NewMessage): void {
        void this.updateLocallyFollowedTopicOnNewMessage(ev);
    }

    private handleFollowedTopicUpdated(ev: FollowedTopicUpdated): void {
        this.followedTopics.get(ev.followedTopic.location.roomId)?.set(ev.followedTopic);
        this.invalidateUnreadSummaries(ev.followedTopic.location.roomId, ev.followedTopic.location.topicId);
    }

    private handleTopicFollowed(ev: TopicFollowed): void {
        this.setFollowedTopicsArray([ev.followedTopic.location.roomId], [ev.followedTopic]);
        this.invalidateUnreadSummaries(ev.followedTopic.location.roomId, ev.followedTopic.location.topicId);
    }

    private handleRoomDeleted(ev: RoomDeleted): void {
        this.roomHistories.delete(ev.id);
        this.clearRoomFollowedTopicsStructures(ev.id);
    }

    private handleRoomJoin(ev: RoomJoined): void {
        this.createHistoryForNewRoom(ev.room)
        this.clearRoomFollowedTopicsStructures(ev.room.id);
    }

    private handleRoomLeft(ev: RoomLeft): void {
        this.roomHistories.delete(ev.id);
        this.clearRoomFollowedTopicsStructures(ev.id);
    }

    private async handleNewTopic(ev: NewTopic): Promise<void> {
        if (this.followedTopics.has(ev.roomId)) {
            // Check if the new topic is followed by user
            // only if client asked for followed topics list before for this room
            const result = await this.tracker.client.send(
                'GetFollowedTopics',
                {location: {roomId: ev.roomId, topicId: ev.topic.id}},
            );
            const followedTopic = result.data.followedTopics[0];
            if (followedTopic) {
                this.followedTopics.get(ev.roomId).set(followedTopic);
                this.invalidateUnreadSummaries(ev.roomId, ev.topic.id);
            }
        }
    }

    private handleTopicDeleted(ev: TopicDeleted): void {
        this.followedTopics.get(ev.location.roomId)?.delete(ev.location.topicId);
        this.invalidateUnreadSummaries(ev.location.roomId, ev.location.topicId);
    }

    private handleSession(ev: Session): void {
        this.followedTopics.deleteAll();
        this.followedTopicsPromises.forgetAll();
        this.invalidateUnreadSummaries();
        this.roomHistories.deleteAll();
        ev.state.rooms.forEach(room => this.createHistoryForNewRoom(room));
        this.deferredSession.resolve();
    }

    private async updateLocallyFollowedTopicOnNewMessage(ev: NewMessage): Promise<void> {
        const roomFollowedTopics = this.followedTopics.get(ev.message.location.roomId);
        const followedTopic = roomFollowedTopics?.get(ev.message.location.topicId);

        if (!roomFollowedTopics || !followedTopic || ev.message.type === 'Ephemeral') {
            // Skip if we don't follow this room or targeted topic or the message is ephemeral
            return;
        }

        const isMe = ev.message.author.user.id === this.tracker.me?.id;

        let update: Partial<FollowedTopic>;

        if (isMe) {
            // Reset missed messages count if new message is authored by me
            update = {missed: 0, lastAckMessageId: ev.message.id};
        } else if (ev.message.type === 'Text') {
            // ...check for mentions if it's text message...
            const member = await this.tracker.rooms.getMe(ev.message.location.roomId);
            const roleIds = [...(member.spaceMember?.roles ?? []), ...member.roles];
            const mentionHandlers = [
                ...roleIds.map(id => `<@&${id}>`),
                `<@${ev.message.author.user.id}>`,
            ];
            const mentionExists = mentionHandlers.some(handler => ev.message.content.includes(handler));

            update = {
                missed: followedTopic.missed === null ? null : followedTopic.missed + 1,
                isUnread: true,
                mentionCount: followedTopic.mentionCount + (mentionExists ? 1 : 0),
            };
        } else {
            // ...or just mark as unread.
            update = {
                missed: followedTopic.missed === null ? null : followedTopic.missed + 1,
                isUnread: true,
            };
        }

        roomFollowedTopics.set({...followedTopic, ...update});
        this.invalidateUnreadSummaries(ev.message.location.roomId, ev.message.location.topicId);
    }

    private setFollowedTopicsArray(roomIds: string[], followedTopics: FollowedTopic[]): void {
        const roomToTopics: {[roomId: string]: FollowedTopic[]} = {};

        // Reassign followed topics to limit collection change event emit
        followedTopics.forEach(followedTopic => {
            roomToTopics[followedTopic.location.roomId] ??= [];
            roomToTopics[followedTopic.location.roomId].push(followedTopic);
        });

        roomIds.forEach(roomId => {
            if (! this.followedTopics.has(roomId)) {
                this.followedTopics.set([roomId, new ObservableIndexedObjectCollection<FollowedTopic>(
                    followedTopic => followedTopic.location.topicId
                )]);
            }

            if (roomToTopics[roomId]) {
                this.followedTopics.get(roomId).set(...roomToTopics[roomId]);
            }
        });

        this.invalidateUnreadSummariesForRooms(roomIds);
    }

    private clearRoomFollowedTopicsStructures(roomId: string): void {
        this.followedTopics.delete(roomId);
        this.followedTopicsPromises.forget(roomId);
        this.invalidateUnreadSummaries(roomId);
    }
}