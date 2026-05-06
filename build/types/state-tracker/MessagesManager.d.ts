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
     * Batch acknowledge all missed messages from any topics in given room.
     */
    ackRoomFollowedTopics(roomId: string): Promise<void>;
    /**
     * Calculate missed messages from any topic in given room.
     * @return Undefined if you are not in room.
     */
    calculateRoomMissedMessages(roomId: string): Promise<number | undefined>;
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
    private createHistoryForNewRoom;
    private handleNewMessage;
    private handleFollowedTopicUpdated;
    private handleTopicFollowed;
    private handleTopicUnfollowed;
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
