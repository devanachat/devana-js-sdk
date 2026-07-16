import { EventTarget } from "../EventTarget";
import { ChatStateTracker } from "./ChatStateTracker";
import { ObservableIndexedObjectCollection } from "../IndexedObjectCollection";
import { ChatLocation, FollowedTopic } from "../types/src";
interface EventMap {
    change: {};
}
export declare class FollowedTopicsManager extends EventTarget<EventMap> {
    private tracker;
    private readonly followedTopics;
    private readonly followedTopicsPromises;
    private readonly deferredSession;
    private readonly summariesCache;
    constructor(tracker: ChatStateTracker);
    /**
     * Cache followed topics for all joined rooms in a space and fetch them in bulk if necessary.
     * Then you can get them using getRoomFollowedTopics().
     * @see getForRoom
     */
    cacheForSpace(spaceId: string | null): Promise<void>;
    /**
     * Get followed topics for the given room.
     * @return Undefined if you are not in the room, collection otherwise.
     */
    getForRoom(roomId: string): Promise<ObservableIndexedObjectCollection<FollowedTopic> | undefined>;
    /**
     * Batch acknowledge all messages for given room.
     */
    ackRoom(roomId: string): Promise<void>;
    /**
     * Summarize all unread messages or mentions from any topic in given location.
     * This method uses an internal cache, so it's ok to call it multiple times.
     * Capture the 'change' event to determine when it's worth calling this method again due to data changes.
     * @return Undefined if you are not in room.
     */
    summarize(location: ChatLocation): Promise<{
        mentionCount: number;
        isUnread: boolean;
    }>;
    /**
     * For internal use. If you want to delete the message, execute a proper command on client object.
     * @internal
     */
    _deleteByTopicIds(roomId: string, ...topicIds: string[]): void;
    private handleSession;
    private handleNewMessage;
    private handleFollowedTopicUpdated;
    private handleTopicFollowed;
    private handleTopicUnfollowed;
    private handleRoomDeleted;
    private handleRoomJoin;
    private handleRoomLeft;
    private handleNewTopic;
    private handleTopicDeleted;
    /**
     * Invalidate the summaries cache intentionally, only for the locations affected by the change.
     */
    private invalidateUnreadSummaries;
    private invalidateUnreadSummariesForRooms;
    private updateLocallyFollowedTopicOnNewMessage;
    private setFollowedTopicsArray;
    private clearRoomFollowedTopicsStructures;
}
export {};
