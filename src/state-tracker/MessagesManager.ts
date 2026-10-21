import {ChatStateTracker} from "./ChatStateTracker";
import {
    RoomDeleted,
    RoomLeft,
    RoomJoined,
    Session,
    Room,
    Message, ChatLocation,
    Topic,
} from "../protocol";
import {IndexedCollection} from "../IndexedObjectCollection";
import {DeferredTask} from "./AsyncUtils";
import {RoomMessagesHistory} from "./RoomMessagesHistory";
import {TopicHistoryWindow} from "./TopicHistoryWindow";
import {TopicHistorySnapshot} from "./StateSnapshot";

export class MessagesManager {
    private readonly roomHistories = new IndexedCollection<string, RoomMessagesHistory>();
    private readonly previewHistories = new IndexedCollection<string, RoomMessagesHistory>();
    private readonly deferredSession = new DeferredTask();

    public constructor(private tracker: ChatStateTracker) {
        this.tracker.client.on('Session', ev => this.handleSession(ev));
        this.tracker.client.on('RoomJoined', ev => this.handleRoomJoin(ev));
        this.tracker.client.on('RoomDeleted', ev => this.handleRoomDeleted(ev));
        this.tracker.client.on('RoomLeft', ev => this.handleRoomLeft(ev));

        // One subscription for all the histories, routed by location: a message costs the same however many rooms
        // and topics are tracked, and nothing stays subscribed after its room or topic is gone.
        this.tracker.client.on('RoomUpdated', ev => void this.roomHistories.get(ev.room.id)?._handleRoomUpdated(ev));
        this.tracker.client.on('NewTopic', ev => this.roomHistories.get(ev.roomId)?._handleNewTopic(ev));
        this.tracker.client.on('TopicDeleted', ev => this.roomHistories.get(ev.location.roomId)?._handleTopicDeleted(ev));
        this.tracker.client.on('NewMessage', ev => this.roomHistories.get(ev.message.location.roomId)?._handleNewMessage(ev));
        this.tracker.client.on('MessagesRedacted', ev => this.roomHistories.get(ev.location.roomId)?._handleMessagesRedacted(ev));
        this.tracker.client.on('ReactionUpdated', ev => this.forEachRoomHistory(history => history._handleReactionUpdated(ev)));
        this.tracker.client.on('Reacted', ev => this.forEachRoomHistory(history => history._handleReacted(ev)));
    }

    /**
     * Get history manager for given room ID. For a room you have not joined it is a preview (requires `PreviewRooms`),
     * kept until {@link forgetRoomPreview} or until you join the room.
     */
    public async getRoomHistory(roomId: string): Promise<RoomMessagesHistory> {
        await this.deferredSession.promise;

        if (this.roomHistories.has(roomId)) {
            return this.roomHistories.get(roomId);
        }

        if (! this.previewHistories.has(roomId)) {
            this.previewHistories.set([roomId, new RoomMessagesHistory(roomId, this.tracker)]);
        }

        return this.previewHistories.get(roomId);
    }

    public forgetRoomPreview(roomId: string): void {
        this.previewHistories.delete(roomId);
    }

    /**
     * For internal use.
     * @internal
     */
    public async _resolveLastMessage(location: ChatLocation): Promise<Message|null> {
        // Try to get last message from history window (if cached); not getRoomHistory(), it would create a preview
        await this.deferredSession.promise;
        const historyWindow = await this.roomHistories.get(location.roomId)?.getMessagesWindow(location.topicId, true);
        let message: Message = historyWindow?.hasLatest && historyWindow.getAt(historyWindow.length - 1);

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
     * For internal use.
     * @internal
     */
    public _importRooms(rooms: Room[]): void {
        for (const room of rooms) {
            this.createHistoryForNewRoom(room);
        }

        this.deferredSession.resolve();
    }

    /**
     * For internal use.
     * @internal
     */
    public _exportLatest(roomId: string, topicId: string, limit: number): ReturnType<TopicHistoryWindow['_exportLatest']> {
        const history = this.roomHistories.get(roomId);

        // Ephemeral history lives only in the memory of the session.
        if (! history || history._isEphemeral) {
            return null;
        }

        return history._peekWindow(topicId)?._exportLatest(limit) ?? null;
    }

    /**
     * For internal use.
     * @internal
     */
    public _importHistory(roomId: string, topic: Topic, snapshot: TopicHistorySnapshot): void {
        const history = this.roomHistories.get(roomId);

        if (history && ! history._isEphemeral) {
            const messages = snapshot.messages.filter(
                message => message.location.roomId === roomId && message.location.topicId === topic.id,
            );
            history._restoreWindow(topic, messages, snapshot.myReactions);
        }
    }

    private forEachRoomHistory(callback: (history: RoomMessagesHistory) => void): void {
        for (const history of this.roomHistories.items.values()) {
            callback(history);
        }
    }

    private createHistoryForNewRoom(room: Room): void {
        this.previewHistories.delete(room.id);
        this.roomHistories.set([room.id, new RoomMessagesHistory(room, this.tracker)]);
    }

    private handleRoomDeleted(ev: RoomDeleted): void {
        this.roomHistories.delete(ev.id);
    }

    private handleRoomJoin(ev: RoomJoined): void {
        this.createHistoryForNewRoom(ev.room);
    }

    private handleRoomLeft(ev: RoomLeft): void {
        this.roomHistories.delete(ev.id);
    }

    private handleSession(ev: Session): void {
        const stateRoomIds = new Set(ev.state.rooms.map(room => room.id));

        // Drop histories only for rooms that no longer exist server-side.
        for (const roomId of Array.from(this.roomHistories.items.keys())) {
            if (! stateRoomIds.has(roomId)) {
                this.roomHistories.delete(roomId);
            }
        }

        // Keep existing histories (preserving loaded messages and, crucially,
        // live-only ephemeral history), create histories for newly joined
        // rooms, and resync survivors against the fresh room snapshot.
        for (const room of ev.state.rooms) {
            const history = this.roomHistories.get(room.id);
            if (history) {
                void history.resync(room);
            } else {
                this.createHistoryForNewRoom(room);
            }
        }

        this.deferredSession.resolve();
    }
}