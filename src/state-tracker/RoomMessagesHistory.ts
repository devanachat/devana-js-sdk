import {ChatStateTracker} from "./ChatStateTracker";
import {
    Message,
    MessagesRedacted,
    NewMessage,
    NewTopic,
    Reacted,
    ReactionUpdated,
    Room,
    RoomUpdated,
    Topic,
    TopicDeleted,
    UserReaction,
} from "../protocol";
import {IndexedCollection,} from "../IndexedObjectCollection";
import {TopicHistoryWindow, WindowState} from "./TopicHistoryWindow";

/**
 * Does not subscribe to the client itself - the messages manager routes the events of its room to it, so a history
 * dropped together with its room stops receiving them.
 */
export class RoomMessagesHistory {
    public readonly isPreview: boolean;

    private readonly roomId: string;
    private historyWindows = new IndexedCollection<string, TopicHistoryWindow>();
    private traverseLock: boolean = false;
    private timeLimitedHistory: boolean = false;
    private room: Room | null;

    public constructor(
        room: Room | string,
        private tracker: ChatStateTracker,
    ) {
        this.roomId = typeof room === 'string' ? room : room.id;
        this.room = typeof room === 'string' ? null : room;
        this.isPreview = this.room === null;

        if (this.room) {
            this.updateHistoryMode(this.room);
        }

        if (this.room?.defaultTopic) {
            this.createHistoryWindowForTopic(this.room.defaultTopic);
        }
    }

    /**
     * Returns a history window object for the given topic ID, allowing you to view message history.
     * @param topicId
     * @param peek If true, do not create a cache for this topic and do not allow it to collect new messages.
     */
    public async getMessagesWindow(topicId: string, peek: boolean = false): Promise<TopicHistoryWindow | undefined> {
        if (!this.historyWindows.has(topicId) && !peek) {
            if (this.isPreview) {
                this.createHistoryWindow(topicId);
            } else {
                const topic = (await this.tracker.rooms.getTopics(this.roomId, [topicId])).get(topicId);

                if (topic) {
                    this.createHistoryWindowForTopic(topic);
                }
            }
        }

        return this.historyWindows.get(topicId);
    }

    /**
     * Re-synchronise this room's history after a reconnect without discarding
     * the existing window objects (which would blank the UI and, for ephemeral
     * rooms, permanently drop live-only history).
     *
     * The window bindings are preserved; only windows that the application had
     * actually pulled to the latest page (state === LATEST) are refreshed, with
     * a single request instead of a chain of catch-up requests. Windows that
     * were never pulled (LIVE) or belong to an ephemeral room are left
     * untouched so their in-memory context survives the reconnect.
     *
     * Rooms keeping the full history are reset to the latest page (the rest can
     * always be traversed back), while the windows of rooms with a time-limited
     * history (MaxAge) keep what they had loaded and get the missed messages on
     * top - the server may no longer serve the older ones. If more messages were
     * missed than a single page holds, the seam is recorded in the window gaps.
     */
    public async resync(room: Room): Promise<void> {
        this.room = room;
        this.updateHistoryMode(room);

        if (this.room.defaultTopic) {
            this.createHistoryWindowForTopic(this.room.defaultTopic);
        }

        for (const [, window] of Array.from(this.historyWindows.items)) {
            try {
                await window.setTraverseLock(this.traverseLock);

                // Ephemeral history lives only in memory (the server does not
                // persist it), so never refetch/replace it on reconnect.
                if (this.traverseLock) {
                    continue;
                }

                if (window.state !== WindowState.LATEST) {
                    continue;
                }

                if (this.timeLimitedHistory) {
                    await window.resyncToLatest();
                } else {
                    await window.resetToLatest(true);
                }
            } catch (_e) {
                // Best effort: the connection can drop again mid-resync. The
                // window keeps its current content and stays usable, so the
                // application can refresh it on demand.
            }
        }
    }

    /**
     * For internal use.
     * @internal
     */
    public get _isEphemeral(): boolean {
        return this.traverseLock;
    }

    /**
     * The window of the topic, if created; unlike getMessagesWindow(), never creates nor fetches one.
     * @internal
     */
    public _peekWindow(topicId: string): TopicHistoryWindow | undefined {
        return this.historyWindows.get(topicId);
    }

    /**
     * For internal use.
     * @internal
     */
    public _restoreWindow(topic: Topic, messages: Message[], myReactions: Record<string, UserReaction[]>): void {
        this.createHistoryWindowForTopic(topic);
        this.historyWindows.get(topic.id)._restoreLatest(messages, myReactions);
    }

    /**
     * For internal use.
     * @internal
     */
    public async _handleRoomUpdated(ev: RoomUpdated): Promise<void> {
        this.room = ev.room;

        this.updateHistoryMode(ev.room);

        if (ev.room.defaultTopic) {
            this.createHistoryWindowForTopic(ev.room.defaultTopic);
        }

        for (const [, window] of Array.from(this.historyWindows.items)) {
            await window.setTraverseLock(this.traverseLock);
        }
    }

    /**
     * For internal use.
     * @internal
     */
    public _handleNewTopic(ev: NewTopic): void {
        this.createHistoryWindowForTopic(ev.topic);
    }

    /**
     * For internal use.
     * @internal
     */
    public _handleTopicDeleted(ev: TopicDeleted): void {
        this.historyWindows.delete(ev.location.topicId);
    }

    /**
     * For internal use.
     * @internal
     */
    public _handleNewMessage(ev: NewMessage): void {
        this.historyWindows.get(ev.message.location.topicId)?._handleNewMessage(ev);
    }

    /**
     * For internal use.
     * @internal
     */
    public _handleMessagesRedacted(ev: MessagesRedacted): void {
        void this.historyWindows.get(ev.location.topicId)?._handleMessagesRedacted(ev);
    }

    /**
     * For internal use.
     * @internal
     */
    public _handleReactionUpdated(ev: ReactionUpdated): void {
        for (const window of this.historyWindows.items.values()) {
            window._handleReactionUpdated(ev);
        }
    }

    /**
     * For internal use.
     * @internal
     */
    public _handleReacted(ev: Reacted): void {
        for (const window of this.historyWindows.items.values()) {
            window._handleReacted(ev);
        }
    }

    private createHistoryWindowForTopic(topic: Topic): void {
        if (this.historyWindows.has(topic.id)) {
            return;
        }

        this.createHistoryWindow(topic.id);

        // If new topic refers to some message from this room, update other structures
        if (topic.refMessage) {
            const refHistoryWindow = this.historyWindows.get(topic.refMessage.location.topicId);
            refHistoryWindow?._updateMessageReference(topic);
        }
    }

    private createHistoryWindow(topicId: string): void {
        const historyWindow = new TopicHistoryWindow(this.roomId, topicId, this.tracker, this.isPreview);

        void historyWindow.setTraverseLock(this.traverseLock);

        this.historyWindows.set([topicId, historyWindow]);

        // Current behavior of deletion a message with referenced topic is to delete the whole side topic
        // So we need to listen for topic deletions here
        historyWindow.on('reftopicsdeleted', (deletedTopicIds: string[]) => {
            for (const topicId of deletedTopicIds) {
                this.historyWindows.delete(topicId);
            }
            this.tracker.rooms._deleteTopicsFromRoom(this.roomId, ...deletedTopicIds);
        });
    }

    private updateHistoryMode(room: Room): void {
        this.traverseLock = room.history.mode === 'Ephemeral';
        this.timeLimitedHistory = room.history.mode === 'MaxAge';
    }
}