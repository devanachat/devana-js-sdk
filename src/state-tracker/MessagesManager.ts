import {ChatStateTracker} from "./ChatStateTracker";
import {
    ChatLocation,
    NewMessage,
    FollowedTopic,
    TopicFollowed,
    TopicUnfollowed,
    RoomDeleted,
    RoomLeft,
    TopicDeleted,
    FollowedTopicUpdated, RoomJoined, NewTopic, Session, Room, MessageType,
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

    public constructor(private tracker: ChatStateTracker) {
        this.tracker.client.on('Session', ev => this.handleSession(ev));
        this.tracker.client.on('RoomJoined', ev => this.handleRoomJoin(ev));
        this.tracker.client.on('NewTopic', ev => this.handleNewTopic(ev));
        this.tracker.client.on('FollowedTopicUpdated', ev => this.handleFollowedTopicUpdated(ev));
        this.tracker.client.on('TopicFollowed', ev => this.handleTopicFollowed(ev));
        this.tracker.client.on('TopicUnfollowed', ev => this.handleTopicUnfollowed(ev));
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
     * Batch acknowledge all missed messages from any topics in given room.
     */
    public async ackRoomFollowedTopics(roomId: string): Promise<void> {
        const collection = await this.getRoomFollowedTopics(roomId);

        if (! collection) {
            return;
        }

        for (const followedTopic of collection.items) {
            if (followedTopic.missed) {
                await this.tracker.client.send('Ack', {location: followedTopic.location});
            }
        }
    }

    /**
     * Calculate missed messages from any topic in given room.
     * @return Undefined if you are not in room.
     */
    public async calculateRoomMissedMessages(roomId: string): Promise<number | undefined> {
        const collection = await this.getRoomFollowedTopics(roomId);

        if (collection) {
            return collection.items.reduce(
                (previousValue, currentValue) => previousValue + (currentValue.missed ?? 0),
                0,
            );
        }

        return undefined;
    }

    /**
     * For internal use. If you want to delete the message, execute a proper command on client object.
     * @internal
     */
    public _deleteByTopicIds(roomId: string, ...topicIds: string[]): void {
        this.followedTopics.get(roomId)?.delete(...topicIds);
    }

    private createHistoryForNewRoom(room: Room): void {
        this.roomHistories.set([room.id, new RoomMessagesHistory(room, this.tracker)]);
    }

    private handleNewMessage(ev: NewMessage): void {
        this.updateLocallyFollowedTopicOnNewMessage(ev);
    }

    private handleFollowedTopicUpdated(ev: FollowedTopicUpdated): void {
        this.followedTopics.get(ev.followedTopic.location.roomId)?.set(ev.followedTopic);
    }

    private handleTopicFollowed(ev: TopicFollowed): void {
        this.setFollowedTopicsArray([ev.followedTopic.location.roomId], [ev.followedTopic]);
    }

    private handleTopicUnfollowed(ev: TopicUnfollowed): void {
        this.followedTopics.get(ev.location.roomId)?.delete(ev.location.topicId);
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
            }
        }
    }

    private handleTopicDeleted(ev: TopicDeleted): void {
        this.followedTopics.get(ev.location.roomId)?.delete(ev.location.topicId);
    }

    private handleSession(ev: Session): void {
        this.followedTopics.deleteAll();
        this.followedTopicsPromises.forgetAll();
        this.roomHistories.deleteAll();
        ev.state.rooms.forEach(room => this.createHistoryForNewRoom(room));
        this.deferredSession.resolve();
    }

    private updateLocallyFollowedTopicOnNewMessage(ev: NewMessage): void {
        const roomFollowedTopics = this.followedTopics.get(ev.message.location.roomId);
        const followedTopic = roomFollowedTopics?.get(ev.message.location.topicId);
        const ephemeralMessageTypes = ['System'] as MessageType[];

        if (!roomFollowedTopics || !followedTopic || ephemeralMessageTypes.includes(ev.message.type)) {
            // Skip if we don't follow this room or targeted topic or message is ephemeral
            return;
        }

        const isMe = ev.message.author.user.id === this.tracker.me?.id;

        let update: Partial<FollowedTopic>;

        if (isMe) {
            // Reset missed messages count if new message is authored by me
            update = {missed: 0, lastAckMessageId: ev.message.id};
        } else {
            // ...add 1 otherwise
            update = {missed: followedTopic.missed === null ? null : followedTopic.missed + 1};
        }

        roomFollowedTopics.set({...followedTopic, ...update});
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
    }

    private clearRoomFollowedTopicsStructures(roomId: string): void {
        this.followedTopics.delete(roomId);
        this.followedTopicsPromises.forget(roomId);
    }
}