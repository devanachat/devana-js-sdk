import { ObservableIndexedObjectCollection } from "../IndexedObjectCollection";
import { UserRelationship, UserRelationshipType } from "../types/src";
import { ChatStateTracker } from "./ChatStateTracker";
export declare class RelationshipsManager {
    private tracker;
    private relationships;
    private promises;
    constructor(tracker: ChatStateTracker);
    get(): Promise<ObservableIndexedObjectCollection<UserRelationship>>;
    exists(refUserId: string, type: UserRelationshipType): Promise<boolean>;
    private handleRelationships;
    private handleNewRelationship;
    private handleRelationshipDeleted;
    private handleSession;
}
