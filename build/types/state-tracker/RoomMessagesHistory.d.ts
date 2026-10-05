import { ChatStateTracker } from "./ChatStateTracker";
import { MessagesRedacted, NewMessage, NewTopic, Reacted, ReactionUpdated, Room, RoomUpdated, TopicDeleted } from "../types/src";
import { TopicHistoryWindow } from "./TopicHistoryWindow";
/**
 * Does not subscribe to the client itself - the messages manager routes the events of its room to it, so a history
 * dropped together with its room stops receiving them.
 */
export declare class RoomMessagesHistory {
    private room;
    private tracker;
    private historyWindows;
    private traverseLock;
    constructor(room: Room, tracker: ChatStateTracker);
    /**
     * Returns a history window object for the given topic ID, allowing you to view message history.
     * @param topicId
     * @param peek If true, do not create a cache for this topic and do not allow it to collect new messages.
     */
    getMessagesWindow(topicId: string, peek?: boolean): Promise<TopicHistoryWindow | undefined>;
    /**
     * Re-synchronise this room's history after a reconnect without discarding
     * the existing window objects (which would blank the UI and, for ephemeral
     * rooms, permanently drop live-only history).
     *
     * The window bindings are preserved; only windows that the application had
     * actually pulled to the latest page (state === LATEST) are refreshed, with
     * a single resetToLatest instead of a chain of catch-up requests. Windows
     * that were never pulled (LIVE) or belong to an ephemeral room are left
     * untouched so their in-memory context survives the reconnect.
     */
    resync(room: Room): Promise<void>;
    /**
     * For internal use.
     * @internal
     */
    _handleRoomUpdated(ev: RoomUpdated): Promise<void>;
    /**
     * For internal use.
     * @internal
     */
    _handleNewTopic(ev: NewTopic): void;
    /**
     * For internal use.
     * @internal
     */
    _handleTopicDeleted(ev: TopicDeleted): void;
    /**
     * For internal use.
     * @internal
     */
    _handleNewMessage(ev: NewMessage): void;
    /**
     * For internal use.
     * @internal
     */
    _handleMessagesRedacted(ev: MessagesRedacted): void;
    /**
     * For internal use.
     * @internal
     */
    _handleReactionUpdated(ev: ReactionUpdated): void;
    /**
     * For internal use.
     * @internal
     */
    _handleReacted(ev: Reacted): void;
    private createHistoryWindowForTopic;
    private updateTraverseLock;
}
