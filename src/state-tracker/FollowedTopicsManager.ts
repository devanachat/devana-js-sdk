import {EventTarget} from "../EventTarget";
import {ChatStateTracker} from "./ChatStateTracker";
import {DeferredTask, PromiseRegistry} from "./AsyncUtils";
import {IndexedCollection, ObservableIndexedObjectCollection} from "../IndexedObjectCollection";
import {
    ChatLocation,
    FollowedTopic,
    FollowedTopicUpdated,
    NewMessage, NewTopic,
    RoomDeleted,
    RoomJoined, RoomLeft,
    Session, TopicDeleted,
    TopicFollowed
} from "../types/src";

interface EventMap {
    change: {};
}

export class FollowedTopicsManager extends EventTarget<EventMap> {
    private readonly followedTopics = new IndexedCollection<string, ObservableIndexedObjectCollection<FollowedTopic>>();
    private readonly followedTopicsPromises = new PromiseRegistry();
    private readonly deferredSession = new DeferredTask();
    private readonly summariesCache = new Map<string, { mentionCount: number, isUnread: boolean }>();

    public constructor(private tracker: ChatStateTracker) {
        super();

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
     * Cache followed topics for all joined rooms in a space and fetch them in bulk if necessary.
     * Then you can get them using getRoomFollowedTopics().
     * @see getForRoom
     */
    public async cacheForSpace(spaceId: string | null): Promise<void> {
        if (spaceId && ! (await this.tracker.spaces.get()).has(spaceId)) {
            throw new Error(`You are not in space ${spaceId}`);
        }

        const rooms = await this.tracker.rooms.get();
        const roomIds = spaceId
            ? rooms.findBy('spaceId', spaceId).items.map(r => r.id)
            : rooms.items.filter(r => !r.spaceId).map(r => r.id);

        if (!roomIds.length) {
            return;
        }

        const isAlreadyCached = roomIds.every(roomId => this.followedTopics.has(roomId));
        if (isAlreadyCached) {
            return;
        }

        const spaceRegistryKey = `space_fetch_${spaceId || 'spaceless'}`;

        if (this.followedTopicsPromises.notExist(spaceRegistryKey)) {
            this.followedTopicsPromises.registerByFunction(async () => {
                const result = await this.tracker.client.send('GetFollowedTopics', {location: {spaceId}});
                if (result.error) throw result.error;

                this.setFollowedTopicsArray(roomIds, result.data.followedTopics);
            }, spaceRegistryKey);
        }

        await this.followedTopicsPromises.get(spaceRegistryKey);
    }

    /**
     * Get followed topics for the given room.
     * @return Undefined if you are not in the room, collection otherwise.
     */
    public async getForRoom(roomId: string): Promise<ObservableIndexedObjectCollection<FollowedTopic> | undefined> {
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
        const collection = await this.getForRoom(roomId);

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
     * Summarize all unread messages or mentions from any topic in given location.
     * This method uses an internal cache, so it's ok to call it multiple times.
     * Capture the 'change' event to determine when it's worth calling this method again due to data changes.
     * @return Undefined if you are not in room.
     */
    public async summarize(location: ChatLocation): Promise<{ mentionCount: number, isUnread: boolean }> {
        const cacheKey = location.topicId
            ? `topic:${location.roomId}:${location.topicId}`
            : location.roomId
                ? `room:${location.roomId}`
                : location.spaceId
                    ? `space:${location.spaceId}`
                    : 'spaceless';

        if (this.summariesCache.has(cacheKey)) {
            return this.summariesCache.get(cacheKey)!;
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
            await this.cacheForSpace(location.spaceId);
            roomIds = rooms.findBy('spaceId', location.spaceId).items.map(r => r.id);
        } else {
            await this.cacheForSpace(null);
            roomIds = rooms.items.filter(r => !r.spaceId).map(r => r.id);
        }

        let mentionCount = 0;
        let isUnread = false;

        for (const roomId of roomIds) {
            const collection = await this.getForRoom(roomId);

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
        this.summariesCache.set(cacheKey, result);

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

    private handleSession(ev: Session): void {
        this.followedTopics.deleteAll();
        this.followedTopicsPromises.forgetAll();
        this.invalidateUnreadSummaries();
        this.deferredSession.resolve();
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
        this.clearRoomFollowedTopicsStructures(ev.id);
    }

    private handleRoomJoin(ev: RoomJoined): void {
        this.clearRoomFollowedTopicsStructures(ev.room.id);
    }

    private handleRoomLeft(ev: RoomLeft): void {
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

    /**
     * Invalidate the summaries cache intentionally, only for the locations affected by the change.
     */
    private invalidateUnreadSummaries(roomId?: string, topicId?: string): void {
        if (roomId) {
            this.summariesCache.delete(`room:${roomId}`);

            if (topicId) {
                this.summariesCache.delete(`topic:${roomId}:${topicId}`);
            } else {
                for (const key of this.summariesCache.keys()) {
                    if (key.startsWith(`topic:${roomId}:`)) {
                        this.summariesCache.delete(key);
                    }
                }
            }

            for (const key of this.summariesCache.keys()) {
                if (key.startsWith('space:') || key === 'spaceless') {
                    this.summariesCache.delete(key);
                }
            }
        } else {
            this.summariesCache.clear();
        }

        this.emit('change');
    }

    private invalidateUnreadSummariesForRooms(roomIds: string[]): void {
        const roomIdsSet = new Set(roomIds);
        roomIds.forEach(roomId => {
            this.summariesCache.delete(`room:${roomId}`);
        });

        for (const key of this.summariesCache.keys()) {
            if (key.startsWith('space:') || key === 'spaceless') {
                this.summariesCache.delete(key);
                continue;
            }
            if (key.startsWith('topic:')) {
                const parts = key.split(':');
                if (parts.length >= 2 && roomIdsSet.has(parts[1])) {
                    this.summariesCache.delete(key);
                }
            }
        }

        this.emit('change');
    }

    private async updateLocallyFollowedTopicOnNewMessage(ev: NewMessage): Promise<void> {
        const roomFollowedTopics = this.followedTopics.get(ev.message.location.roomId);
        const followedTopic = roomFollowedTopics?.get(ev.message.location.topicId);

        if (!roomFollowedTopics || !followedTopic || ev.message.type === 'Ephemeral') {
            // Skip if we don't follow this room or message is ephemeral
            return;
        }

        const me = await this.tracker.getMe();
        const isMe = ev.message.author.user.id === me.id;
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
                `<@${me.id}>`,
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