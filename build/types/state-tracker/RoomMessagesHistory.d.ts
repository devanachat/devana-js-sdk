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
     */
    getMessagesWindow(topicId: string): Promise<TopicHistoryWindow | undefined>;
    private handleRoomUpdated;
    private handleNewTopic;
    private handleTopicDeleted;
    private createHistoryWindowForTopic;
    private updateTraverseLock;
}
