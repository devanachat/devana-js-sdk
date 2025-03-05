import { ChatStateTracker } from "./ChatStateTracker";
import { ObservableIndexedObjectCollection } from "../IndexedObjectCollection";
import { User } from "../types/src";
export declare class UsersManager {
    private tracker;
    private readonly users;
    constructor(tracker: ChatStateTracker);
    /**
     * Get all available (cached) user objects at once.
     */
    getAvailable(): Promise<ObservableIndexedObjectCollection<User>>;
    private handleMembers;
    private handleUsers;
    private handleSession;
}
