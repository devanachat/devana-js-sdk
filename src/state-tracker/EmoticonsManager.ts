import {ChatStateTracker} from "./ChatStateTracker";
import {
    IndexedCollection,
    ObservableIndexedObjectCollection
} from "../IndexedObjectCollection";
import {Emoticon, EmoticonDeleted, Emoticons, NewEmoticon, SpaceDeleted} from "../types/src";
import {PromiseRegistry} from "./AsyncUtils";

const GLOBAL_KEY = 'global';

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

    public async get(spaceId?: string): Promise<ObservableIndexedObjectCollection<Emoticon>> {
        const key = spaceId ?? GLOBAL_KEY;

        if (this.emoticonsPromises.notExist(key)) {
            this.emoticonsPromises.registerByFunction(async () => {
                const result = await this.tracker.client.send('GetEmoticons', {spaceId});
                if (result.error) {
                    throw result.error;
                }
                this.handleEmoticons(result.data);
            }, key);
        }

        await this.emoticonsPromises.get(key);
        return this.list.get(key);
    }

    private handleEmoticons(event: Emoticons): void {
        const spaceId = event.location.spaceId ?? GLOBAL_KEY;

        if (!this.list.has(spaceId)) {
            this.list.set([spaceId, new ObservableIndexedObjectCollection<Emoticon>('id')]);
        }

        const collection = this.list.get(spaceId);
        collection.set(...event.emoticons);
    }

    private handleNewEmoticon(ev: NewEmoticon): void {
        const collection = this.list.get(ev.emoticon.spaceId ?? GLOBAL_KEY);
        collection?.set(ev.emoticon);
    }

    private handleEmoticonDeleted(ev: EmoticonDeleted): void {
        const collection = this.list.get(ev.spaceId ?? GLOBAL_KEY);
        collection?.delete(ev.emoticonId);
    }

    private handleSpaceDeleted(event: SpaceDeleted): void {
        this.list.delete(event.id);
    }

    private handleSession(): void {
        this.list.deleteAll();
        this.emoticonsPromises.forgetAll();
    }
}