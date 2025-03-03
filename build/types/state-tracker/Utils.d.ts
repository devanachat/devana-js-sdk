import { ChatStateTracker } from "./ChatStateTracker";
import { IndexedObjectCollection } from "../IndexedObjectCollection";
import { Room, RoomSummary, User } from "../types/src";
export declare class Utils {
    private tracker;
    constructor(tracker: ChatStateTracker);
    /**
     * Collect all room summaries and rooms you joined in one collection.
     */
    collectAllAvailableRooms(): Promise<IndexedObjectCollection<Room | RoomSummary>>;
    /**
     * Collect all users from all spaces and rooms you are in.
     */
    collectAllAvailableUsers(): Promise<IndexedObjectCollection<User>>;
}
