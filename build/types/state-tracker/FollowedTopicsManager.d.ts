import { EventTarget } from "../EventTarget";
import { ChatStateTracker } from "./ChatStateTracker";
import { ObservableIndexedObjectCollection } from "../IndexedObjectCollection";
import { ChatLocation, FollowedTopic } from "../types/src";
interface EventMap {
    change: {};
}
export interface UnreadSummary {
    mentionCount: number;
    unreadTopicCount: number;
    unreadRoomCount: number;
    isUnread: boolean;
}
export declare class FollowedTopicsManager extends EventTarget<EventMap> {
    private tracker;
    private readonly followedTopics;
    private readonly followedTopicsPromises;
    private readonly deferredSession;
    private readonly summariesCache;
    /**
     * Rooms whose cached followed-topics are stale after a reconnect and must
     * be refetched (and reconciled in place) the next time they are accessed.
     */
    private readonly staleRooms;
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
    summarize(location: ChatLocation): Promise<UnreadSummary>;
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
    /**
     * Reconcile the followed-topics collection for a single room to exactly
     * match the provided list (upsert present, drop absent) without emitting an
     * intermediate empty state, and clear its stale marker. Does not touch the
     * unread summaries cache - callers decide how to invalidate it.
     */
    private applyRoomFollowedTopics;
    /**
     * Reconcile a batch of rooms from a single bulk GetFollowedTopics response.
     * Rooms with no followed topics in the response are reconciled to empty, so
     * topics unfollowed/removed during the downtime are correctly dropped.
     */
    private reconcileRoomsFollowedTopics;
    private setFollowedTopicsArray;
    private clearRoomFollowedTopicsStructures;
}
export {};
