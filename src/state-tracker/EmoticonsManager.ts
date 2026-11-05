import {ChatStateTracker} from "./ChatStateTracker";
import {
    IndexedCollection,
    ObservableIndexedObjectCollection
} from "../IndexedObjectCollection";
import {Emoticon, EmoticonDeleted, Emoticons, NewEmoticon, SpaceDeleted} from "../protocol";
import {PromiseRegistry} from "./AsyncUtils";
import {EmoticonsSnapshot} from "./StateSnapshot";

export class EmoticonsManager {
    private list: IndexedCollection<string, ObservableIndexedObjectCollection<Emoticon>> = new IndexedCollection();
    private emoticonsPromises = new PromiseRegistry();
    
    public constructor(private tracker: ChatStateTracker) {
        this.tracker.client.on('Emoticons', ev => this.handleEmoticons(ev));
        this.tracker.client.on('NewEmoticon', ev => this.handleNewEmoticon(ev));
        this.tracker.client.on('EmoticonDeleted', ev => this.handleEmoticonDeleted(ev));
        this.tracker.client.on('SpaceDeleted', ev => this.handleSpaceDeleted(ev));
        this.tracker.client.on('Session', () => this.handleSession());
    }

    public async get(spaceId: string): Promise<ObservableIndexedObjectCollection<Emoticon>> {
        if (this.emoticonsPromises.notExist(spaceId)) {
            this.emoticonsPromises.registerByFunction(async () => {
                const result = await this.tracker.client.send('GetEmoticons', {spaceId});
                if (result.error) {
                    throw result.error;
                }
                this.handleEmoticons(result.data);
            }, spaceId);
        }

        await this.emoticonsPromises.get(spaceId);
        return this.list.get(spaceId);
    }

    /**
     * For internal use.
     * @internal
     */
    public _exportEmoticons(): EmoticonsSnapshot[] {
        return Array.from(this.list.items).map(([spaceId, emoticons]) => ({
            spaceId,
            emoticons: emoticons.items,
        }));
    }

    /**
     * Emoticons of spaces other than the given ones are skipped.
     * @internal
     */
    public _importEmoticons(snapshots: EmoticonsSnapshot[], spaceIds: string[]): void {
        const joinedSpaceIds = new Set(spaceIds);

        for (const {spaceId, emoticons} of snapshots) {
            // TODO(emoticons-compat): snapshots written before the global emoticons were gone still hold them under
            // null - drop the comment once no such snapshot can be left on a device (the check itself stays).
            if (! joinedSpaceIds.has(spaceId)) {
                continue;
            }

            this.handleEmoticons({location: {spaceId}, emoticons});
            // Served from the snapshot until the session invalidates it.
            this.emoticonsPromises.register(Promise.resolve(), spaceId);
        }
    }

    /**
     * For internal use.
     * @internal
     */
    public _forgetSpacesExcept(spaceIds: string[]): void {
        const keptKeys = new Set(spaceIds);
        const removedKeys = Array.from(this.list.items.keys()).filter(key => ! keptKeys.has(key));

        this.list.delete(...removedKeys);
        this.emoticonsPromises.forget(...removedKeys);
    }

    private handleEmoticons(event: Emoticons): void {
        // A selection by ids has no location.
        // TODO(emoticons-compat): one without a space is the always empty list of the gone global emoticons, sent
        // until the server stops answering old clients that way.
        const spaceId = event.location?.spaceId;

        if (!spaceId) {
            return;
        }

        if (!this.list.has(spaceId)) {
            this.list.set([spaceId, new ObservableIndexedObjectCollection<Emoticon>('id')]);
        }

        // handleEmoticons always carries the full list for a location, so
        // reconcile in place: a reconnect refetch drops removed emoticons and
        // adds new ones without blanking a bound (visible) collection.
        this.list.get(spaceId).reconcile(...event.emoticons);
    }

    private handleNewEmoticon(ev: NewEmoticon): void {
        const collection = this.list.get(ev.emoticon.spaceId);
        collection?.set(ev.emoticon);
    }

    private handleEmoticonDeleted(ev: EmoticonDeleted): void {
        const collection = this.list.get(ev.spaceId);
        collection?.delete(ev.emoticonId);
    }

    private handleSpaceDeleted(event: SpaceDeleted): void {
        this.list.delete(event.id);
    }

    private handleSession(): void {
        // Keep cached emoticon collections (they may be bound to visible
        // pickers); just drop the fetch guards so the next access refetches and
        // reconciles them in place.
        this.emoticonsPromises.forgetAll();
    }
}