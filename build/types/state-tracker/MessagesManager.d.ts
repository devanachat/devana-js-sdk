import { ChatStateTracker } from "./ChatStateTracker";
import { FollowedTopic, Message, ChatLocation } from "../types/src";
import { ObservableIndexedObjectCollection } from "../IndexedObjectCollection";
import { RoomMessagesHistory } from "./RoomMessagesHistory";
export declare class MessagesManager {
    private tracker;
    private readonly roomHistories;
    private readonly followedTopics;
    private readonly followedTopicsPromises;
    private readonly deferredSession;
    private readonly unreadSummariesCache;
    constructor(tracker: ChatStateTracker);
    /**
     * Get history manager for given room ID.
     */
    getRoomHistory(roomId: string): Promise<RoomMessagesHistory | undefined>;
    /**
     * Cache followed topics for all joined rooms in a space and fetch them in bulk if necessary.
     * Then you can get them using getRoomFollowedTopics().
     * @see getRoomFollowedTopics
     */
    cacheSpaceFollowedTopics(spaceId: string | null): Promise<void>;
    /**
     * Get followed topics for the given room.
     * @return Undefined if you are not in the room, collection otherwise.
     */
    getRoomFollowedTopics(roomId: string): Promise<ObservableIndexedObjectCollection<FollowedTopic> | undefined>;
    /**
     * Batch acknowledge all messages for given room.
     */
    ackRoom(roomId: string): Promise<void>;
    /**
     * Calculate missed messages with mentions from any topic in given room.
     * @return Undefined if you are not in room.
     */
    summarizeUnreadMessages(location: ChatLocation): Promise<{
        mentionCount: number;
        isUnread: boolean;
    }>;
    /**
     * For internal use. If you want to delete the message, execute a proper command on client object.
     * @internal
     */
    _deleteByTopicIds(roomId: string, ...topicIds: string[]): void;
    /**
     * For internal use.
     * @internal
     */
    _resolveLastMessage(location: ChatLocation): Promise<Message | null>;
    /**
     * Wyczyść cache celowo, tylko dla lokalizacji których dotyczy zmiana.
     */
    private invalidateUnreadSummaries;
    private invalidateUnreadSummariesForRooms;
    private createHistoryForNewRoom;
    private handleNewMessage;
    private handleFollowedTopicUpdated;
    private handleTopicFollowed;
    private handleRoomDeleted;
    private handleRoomJoin;
    private handleRoomLeft;
    private handleNewTopic;
    private handleTopicDeleted;
    private handleSession;
    private updateLocallyFollowedTopicOnNewMessage;
    private setFollowedTopicsArray;
    private clearRoomFollowedTopicsStructures;
}
