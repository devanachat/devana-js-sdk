import {ObservableIndexedObjectCollection} from "../IndexedObjectCollection";
import {
    NewRelationship,
    RelationshipDeleted,
    Relationships,
    UserRelationship,
    UserRelationshipType
} from "../types/src";
import {PromiseRegistry} from "./AsyncUtils";
import {ChatStateTracker} from "./ChatStateTracker";

const getId = (refUserId: string, type: UserRelationshipType): string => `${refUserId}-${type}`;
const getIdFromRelationship = (relationship: UserRelationship): string => getId(relationship.refUser.id, relationship.type);

export class RelationshipsManager {
    private relationships: ObservableIndexedObjectCollection<UserRelationship> = new ObservableIndexedObjectCollection<UserRelationship>(getIdFromRelationship);
    private promises = new PromiseRegistry();

    public constructor(private tracker: ChatStateTracker) {
        this.tracker.client.on('Relationships', ev => this.handleRelationships(ev));
        this.tracker.client.on('NewRelationship', ev => this.handleNewRelationship(ev));
        this.tracker.client.on('RelationshipDeleted', ev => this.handleRelationshipDeleted(ev));
        this.tracker.client.on('Session', () => this.handleSession());
    }

    public async get(): Promise<ObservableIndexedObjectCollection<UserRelationship>> {
        if (this.promises.notExist('all')) {
            this.promises.registerByFunction(async () => {
                const result = await this.tracker.client.send('GetRelationships', {});
                if (result.error) {
                    throw result.error;
                }
            }, 'all');
        }

        await this.promises.get('all');
        return this.relationships;
    }

    public async exists(refUserId: string, type: UserRelationshipType): Promise<boolean> {
        await this.get();
        return this.relationships.has(getId(refUserId, type));
    }

    private handleRelationships(ev: Relationships): void {
        // Full list from the server: reconcile in place so a reconnect refetch
        // updates a bound (visible) list without an intermediate empty state.
        this.relationships.reconcile(...ev.relationships);
    }

    private handleNewRelationship(ev: NewRelationship): void {
        if (this.promises.has('all')) {
            this.relationships.set(ev.relationship);
        }
    }

    private handleRelationshipDeleted(ev: RelationshipDeleted): void {
        if (this.promises.has('all')) {
            this.relationships.delete(getIdFromRelationship(ev.relationship));
        }
    }

    private handleSession(): void {
        // Keep the (possibly bound) collection; just drop the fetch guard so the
        // next get() refetches and reconciles it in place.
        this.promises.forgetAll();
    }
}