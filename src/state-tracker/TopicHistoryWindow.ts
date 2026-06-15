import {Message, MessagesRedacted, NewMessage, Topic} from "../types/src";
import {ChatStateTracker} from "./ChatStateTracker";
import {CollectionEventMap, ObservableIndexedObjectCollection} from "../IndexedObjectCollection";

export enum WindowState {
    /**
     * The latest messages (those received live) are available in the history window, history has not been fetched.
     */
    LIVE,

    /**
     * The latest messages has been fetched and are available in the history window.
     */
    LATEST,

    /**
     * The historical messages have been fetched and are available in the history window.
     * Latest messages are not available and will not be available.
     */
    PAST,

    /**
     * The oldest messages have been fetched and are available in the history window.
     * Next attempts to fetch previous messages will result with no-op.
     */
    OLDEST,
}

export abstract class TraversableRemoteCollection<
    ItemT,
    EventMapT extends CollectionEventMap = CollectionEventMap
> extends ObservableIndexedObjectCollection<ItemT, EventMapT> {
    /**
     * Current mode od collection window. To change mode, call one of available fetch methods.
     */
    public get state(): WindowState {
        return this.internalState.current;
    }

    protected internalState: {
        current: WindowState,
        ongoing?: WindowState,
        limit: number | null, // Acts as High Watermark
        retainRatio: number, // Percentage of limit to keep when trimming
        fetchLimit: number,
        lastFetchCount: number,
        oldestId: string | null,
    } = {
        current: WindowState.LIVE,
        ongoing: undefined,
        limit: 1000,
        retainRatio: 1,
        fetchLimit: 50,
        lastFetchCount: 0,
        oldestId: null,
    };

    /**
     * Number of items to fetch per request.
     */
    public get fetchLimit(): number {
        return this.internalState.fetchLimit;
    }

    /**
     * Sets number of items to fetch per request.
     */
    public set fetchLimit(value: number) {
        this.internalState.fetchLimit = value;
    }

    /**
     * Maximum number of items stored in window (High Watermark).
     * Null for unlimited.
     */
    public get limit(): number | null {
        return this.internalState.limit;
    }

    /**
     * Maximum number of items stored in window (High Watermark).
     * Null for unlimited.
     */
    public set limit(value: number | null) {
        this.internalState.limit = value;
    }

    /**
     * Percentage of limit to keep when trimming.
     */
    public get retainRatio(): number {
        return this.internalState.retainRatio;
    }

    /**
     * Percentage of limit to keep when trimming.
     */
    public set retainRatio(value: number) {
        this.internalState.retainRatio = value;
    }

    public get hasLatest(): boolean {
        return [WindowState.LATEST, WindowState.LIVE].includes(this.state);
    }

    public get hasOldest(): boolean {
        return this.state === WindowState.OLDEST
            || this.state === WindowState.LATEST && this.length < this.fetchLimit
            || this.internalState.oldestId !== null && this.has(this.internalState.oldestId);
    }

    public abstract createMirror(): TraversableRemoteCollection<ItemT, EventMapT>;

    public async resetToLatest(): Promise<void> {
        if (this.internalState.ongoing || this.internalState.current === WindowState.LATEST) {
            return;
        }

        let result;
        const originalState = this.state;
        this.internalState.ongoing = WindowState.LATEST;

        try {
            result = await this.fetchLatestItems();
            this.internalState.lastFetchCount = result.length;
        } finally {
            this.internalState.ongoing = undefined;
        }

        this._items.deleteAll(); // Directly call deleteAll to prevent event emit.
        this.addItems(result, 'tail');
        this.internalState.current = WindowState.LATEST;
        this.emitChangeWithDiff(true, originalState);
    }

    public async fetchPrevious(): Promise<void> {
        if (this.internalState.ongoing || this.hasOldest) {
            return;
        }

        let result;
        const originalState = this.state;
        this.internalState.ongoing = WindowState.PAST;

        try {
            result = await this.fetchItemsBefore();
            this.internalState.lastFetchCount = result ? result.length : 0;
        } finally {
            this.internalState.ongoing = undefined;
        }

        if (! result) {
            return this.resetToLatest();
        }

        if (! result.length) {
            const firstItem = this.getAt(0);
            this.internalState.oldestId = firstItem ? this.getId(firstItem) : null;

            await this.refreshFetchedState();

            // LATEST state has priority over OLDEST
            if (this.internalState.current === WindowState.PAST) {
                this.internalState.current = WindowState.OLDEST;
            }

            this.emitChangeWithDiff(false, originalState);
            return;
        }

        this.addItems(result, 'head');
        await this.refreshFetchedState();
        this.emitChangeWithDiff(true, originalState);
    }

    public async fetchNext(): Promise<void> {
        if (this.internalState.ongoing || this.hasLatest) {
            return;
        }

        let result;
        const originalState = this.state;
        this.internalState.ongoing = WindowState.PAST;

        try {
            result = await this.fetchItemsAfter();
            this.internalState.lastFetchCount = result ? result.length : 0;
        } finally {
            this.internalState.ongoing = undefined;
        }

        if (! result) {
            await this.resetToLatest();
            return;
        }

        if (result.length) {
            this.addItems(result, 'tail');
            await this.refreshFetchedState();
            this.emitChangeWithDiff(true, originalState);
            return;
        }
    }

    public async jumpTo(id: string): Promise<void> {
        if (this.internalState.ongoing || this._items.has(id)) {
            return;
        }

        let result: ItemT[] | null;
        const originalState = this.state;
        this.internalState.ongoing = WindowState.PAST;

        try {
            result = await this.fetchItemsAround(id);
            this.internalState.lastFetchCount = result ? result.length : 0;
        } finally {
            this.internalState.ongoing = undefined;
        }

        if (!result) {
            return;
        }

        this._items.deleteAll(); // Directly call deleteAll to prevent event emit.
        this.addItems(result, 'tail');
        this.internalState.current = WindowState.PAST;
        this.emitChangeWithDiff(true, originalState);
    }

    protected abstract fetchLatestItems(): Promise<ItemT[]>;

    protected abstract fetchItemsBefore(): Promise<ItemT[] | null>;

    protected abstract fetchItemsAfter(): Promise<ItemT[] | null>;

    protected abstract fetchItemsAround(id: string): Promise<ItemT[] | null>;

    protected abstract isLatestItemLoaded(): Promise<boolean>;

    protected async refreshFetchedState(): Promise<void> {
        this.internalState.current = (await this.isLatestItemLoaded()) ? WindowState.LATEST : WindowState.PAST;
    }

    protected addItems(newItems: ItemT[], to: 'head' | 'tail'): void {
        let result;

        if (to === 'head') {
            result = this.trimItemsArrayToLimit([...newItems, ...this.items], 'tail');
        }

        if (to === 'tail') {
            result = this.trimItemsArrayToLimit([...this.items, ...newItems], 'head');
        }

        // Directly calls to prevent event emit.
        this._items.deleteAll();
        this._items.set(...(result.map(item => [this.getId(item), item] as [string, ItemT])));
    }

    protected emitChangeWithDiff(itemChanged: boolean, originalState: WindowState): void {
        if (itemChanged || originalState !== this.state) {
            this.eventTarget.emit('change', { setItems: Array.from(this._items.items.keys()) })
        }
    }

    /**
     * Return array with messages trimmed using High/Low Watermark strategy.
     */
    private trimItemsArrayToLimit(items: ItemT[], from: 'head' | 'tail'): ItemT[] {
        const highWatermark = this.limit;

        if (highWatermark === null || items.length <= highWatermark) {
            return items;
        }

        const lowWatermark = Math.floor(highWatermark * this.internalState.retainRatio);

        if (from === 'head') {
            return items.slice(-lowWatermark);
        }

        if (from === 'tail') {
            return items.slice(0, lowWatermark);
        }

        return items;
    }
}

export type TopicHistoryWindowEventMap = CollectionEventMap & {
    reftopicsdeleted: string[];
};

export class TopicHistoryWindow extends TraversableRemoteCollection<
    Message,
    TopicHistoryWindowEventMap
> {
    /**
     * Reexported available window modes enum.
     */
    public readonly WindowState: typeof WindowState = WindowState;

    declare protected internalState: typeof TraversableRemoteCollection<Message>['prototype']['internalState'] & {
        traverseLock: boolean,
    };

    public constructor(
        private roomId: string,
        private topicId: string,
        private tracker: ChatStateTracker,
        bindEvents: boolean = true,
    ) {
        super('id');

        this.internalState.traverseLock = false;

        if (bindEvents) {
            this.tracker.client.on('NewMessage', ev => this.handleNewMessage(ev));
            this.tracker.client.on('MessagesRedacted', ev => this.handleMessagesRedacted(ev));
        }
    }

    public createMirror(): TopicHistoryWindow {
        const copy = new TopicHistoryWindow(this.roomId, this.topicId, this.tracker, false);
        copy.eventTarget = this.eventTarget;
        copy._items = this._items;
        copy.internalState = this.internalState;
        return copy;
    }

    public get isTraverseLocked(): boolean {
        return this.internalState.traverseLock;
    }

    public async setTraverseLock(lock: boolean): Promise<void> {
        this.internalState.traverseLock = lock;

        if (lock && (this.state !== WindowState.LIVE && this.state !== WindowState.LATEST)) {
            await super.resetToLatest();
        }
    }

    public async resetToLatest(): Promise<void> {
        if (this.internalState.traverseLock) {
            return;
        }
        return super.resetToLatest();
    }

    public async fetchNext(): Promise<void> {
        if (this.internalState.traverseLock) {
            return;
        }
        return super.fetchNext();
    }

    public async fetchPrevious(): Promise<void> {
        if (this.internalState.traverseLock) {
            return;
        }
        return super.fetchPrevious();
    }

    public async jumpTo(id: string): Promise<void> {
        if (this.internalState.traverseLock) {
            return;
        }
        return super.jumpTo(id);
    }

    /**
     * For internal use.
     * @internal
     */
    public _updateMessageReference(refTopic: Topic): void {
        const refMessage = this.get(refTopic.refMessage.id);

        if (refMessage) {
            // Update referenced topic ID in message
            this.set({...refMessage, topicRef: refTopic.id});
        }
    }

    protected async fetchItemsAfter(): Promise<Message[] | null> {
        const afterId = this.getAt(this.length - 1)?.id;

        if (! afterId) {
            // If there is no message to refer, fetch latest
            return null;
        }

        const result = await this.tracker.client.send('GetMessages', {
            location: {roomId: this.roomId, topicId: this.topicId},
            after: afterId,
            limit: this.internalState.fetchLimit,
        });

        if (result.error) {
            throw new Error(`Cannot fetch messages: ${result.error.message}`);
        }

        return result.data.messages;
    }

    protected async fetchItemsAround(id: string): Promise<Message[] | null> {
        const result = await this.tracker.client.send('GetMessages', {
            location: {roomId: this.roomId, topicId: this.topicId},
            around: id,
            limit: this.internalState.fetchLimit,
        });

        if (result.error) {
            throw new Error(`Cannot fetch messages: ${result.error.message}`);
        }

        return result.data.messages;
    }

    protected async fetchItemsBefore(): Promise<Message[] | null> {
        const beforeId = this.getAt(0)?.id;

        if (! beforeId) {
            // If there is no message to refer, fetch latest
            return null;
        }

        const result = await this.tracker.client.send('GetMessages', {
            location: {roomId: this.roomId, topicId: this.topicId},
            before: beforeId,
            limit: this.internalState.fetchLimit,
        });

        if (result.error) {
            throw new Error(`Cannot fetch messages: ${result.error.message}`);
        }

        return result.data.messages;
    }

    protected async fetchLatestItems(): Promise<Message[]> {
        const result = await this.tracker.client.send('GetMessages', {
            location: {roomId: this.roomId, topicId: this.topicId},
            limit: this.internalState.fetchLimit,
        });

        if (result.error) {
            throw new Error(`Cannot fetch messages: ${result.error.message}`);
        }

        return result.data.messages;
    }

    private async getTopic(): Promise<Topic | undefined> {
        return (await this.tracker.rooms.getTopics(this.roomId, [this.topicId])).get(this.topicId);
    }

    private async getLatestMessageId(): Promise<string | undefined> {
        return (await this.getTopic())?.lastMessage?.id;
    }

    protected async isLatestItemLoaded(): Promise<boolean> {
        const lastMessageId = await this.getLatestMessageId();
        return lastMessageId ? this.has(lastMessageId) : true;
    }

    private async handleNewMessage(ev: NewMessage): Promise<void> {
        if (
            [WindowState.LATEST, WindowState.LIVE].includes(this.state)
            && ev.message.location.roomId === this.roomId
            && ev.message.location.topicId === this.topicId
        ) {
            const originalState = this.state;
            this.addItems([ev.message], 'tail');
            this.emitChangeWithDiff(true, originalState);
        }
    }

    private async handleMessagesRedacted(ev: MessagesRedacted): Promise<void> {
        if (ev.location.topicId !== this.topicId || ev.location.roomId !== this.roomId) {
            return;
        }

        const refTopicIds = this.items
            .filter(msg => msg.topicRef && ev.ids.includes(msg.id))
            .map(msg => msg.topicRef as string);

        this.delete(...ev.ids);

        if (this.length === 0) {
            await this.resetToLatest();
        }

        if (refTopicIds.length > 0) {
            this.eventTarget.emit('reftopicsdeleted', refTopicIds);
        }
    }
}
