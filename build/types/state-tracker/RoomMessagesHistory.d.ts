import { ChatStateTracker } from "./ChatStateTracker";
import { Room } from "../types/src";
import { TopicHistoryWindow } from "./TopicHistoryWindow";
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
    private handleRoomUpdated;
    private handleNewTopic;
    private handleTopicDeleted;
    private createHistoryWindowForTopic;
    private updateTraverseLock;
}
