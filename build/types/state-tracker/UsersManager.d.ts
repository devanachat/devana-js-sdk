import { ChatStateTracker } from "./ChatStateTracker";
import { ObservableIndexedObjectCollection } from "../IndexedObjectCollection";
import { User } from "../types/src";
import { EventTarget } from "../EventTarget";
export declare class UsersManager {
    private tracker;
    readonly onlineStatus: EventTarget<any>;
    private readonly users;
    constructor(tracker: ChatStateTracker);
    /**
     * Get all available (cached) user objects at once.
     */
    getAvailable(): Promise<ObservableIndexedObjectCollection<User>>;
    private handleMembers;
    private handleSession;
    private handleUsers;
}
