import { ChatStateTracker } from "./ChatStateTracker";
import { ObservableIndexedObjectCollection } from "../IndexedObjectCollection";
import { User } from "../types/src";
import { EventTarget } from "../EventTarget";
export declare class UsersManager {
    private tracker;
    readonly onlineStatus: EventTarget<{
        change: User;
    }>;
    private readonly users;
    constructor(tracker: ChatStateTracker);
    /**
     * Get all available (cached) user objects at once.
     */
    getAvailable(): Promise<ObservableIndexedObjectCollection<User>>;
    private handleMembers;
    private handleSession;
    /**
     * Every message carries its author, so most of what arrives here is already known - only the users that actually
     * changed are stored, and the collection does not report a change for each message.
     */
    private handleUsers;
}
