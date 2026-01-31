import {Message, MessagesRedacted, NewMessage, Topic} from "../types/src";
import {ChatStateTracker} from "./ChatStateTracker";
import {ObservableIndexedObjectCollection} from "../IndexedObjectCollection";

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

export abstract class TraversableRemoteCollection<T> extends ObservableIndexedObjectCollection<T> {
    /**
     * Current mode od collection window. To change mode, call one of available fetch methods.
     */
    public get state(): WindowState {
        return this.internalState.current;
    }

    protected internalState: {
        current: WindowState,
        ongoing?: WindowState,
        limit: number | null,
        fetchLimit: number,
        lastFetchCount: number,
        oldestId: string | null,
    } = {
        current: WindowState.LIVE,
        ongoing: undefined,
        limit: 50,
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
     * Maximum numer of items stored in window.
     * Null for unlimited.
     */
    public get limit(): number | null {
        return this.internalState.limit;
    }

    /**
     * Maximum numer of items stored in window.
     * Null for unlimited.
     */
    public set limit(value: number | null) {
        this.internalState.limit = value;
    }

    public get hasLatest(): boolean {
        return [WindowState.LATEST, WindowState.LIVE].includes(this.state);
    }

    public get hasOldest(): boolean {
        return this.state === WindowState.OLDEST
            || this.state === WindowState.LATEST && this.length < this.fetchLimit
            || this.internalState.oldestId !== null && this.has(this.internalState.oldestId);
    }

    public abstract createMirror(): TraversableRemoteCollection<T>;

    public async resetToLatest(): Promise<void> {
        if (this.internalState.ongoing || this.internalState.current === WindowState.LATEST) {
            return;
        }

        this.internalState.ongoing = WindowState.LATEST;

        let result;

        try {
            result = await this.fetchLatestItems();
            this.internalState.lastFetchCount = result.length;
        } finally {
            this.internalState.ongoing = undefined;
        }

        this.deleteAll();
        this.addItems(result, 'tail');
        this.internalState.current = WindowState.LATEST;
    }

    public async fetchPrevious(): Promise<void> {
        if (this.internalState.ongoing || this.hasOldest) {
            return;
        }

        this.internalState.ongoing = WindowState.PAST;

        let result;

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

            return;
        }

        this.addItems(result, 'head');
        await this.refreshFetchedState();
    }

    public async fetchNext(): Promise<void> {
        if (this.internalState.ongoing || this.hasLatest) {
            return;
        }

        this.internalState.ongoing = WindowState.PAST;

        let result;

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
            return;
        }
    }

    protected abstract fetchLatestItems(): Promise<T[]>;

    protected abstract fetchItemsBefore(): Promise<T[] | null>;

    protected abstract fetchItemsAfter(): Promise<T[] | null>;

    protected abstract isLatestItemLoaded(): Promise<boolean>;

    protected async refreshFetchedState(): Promise<void> {
        this.internalState.current = (await this.isLatestItemLoaded()) ? WindowState.LATEST : WindowState.PAST;
    }

    protected addItems(newItems: T[], to: 'head' | 'tail'): void {
        let result;

        if (to === 'head') {
            result = this.trimItemsArrayToLimit([...newItems, ...this.items], 'tail');
        }

        if (to === 'tail') {
            result = this.trimItemsArrayToLimit([...this.items, ...newItems], 'head');
        }

        this.deleteAll();
        this.set(...result);
    }

    /**
     * Return array with messages of count that matching limit.
     */
    private trimItemsArrayToLimit(items: T[], from: 'head' | 'tail'): T[] {
        if (this.limit === null) {
            return items;
        }

        if (from === 'head') {
            return items.slice(-this.limit);
        }

        if (from === 'tail') {
            return items.slice(0, this.limit);
        }
    }
}

export class TopicHistoryWindow extends TraversableRemoteCollection<Message> {
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

    private async handleNewMessage(ev: NewMessage): Promise<void> {
        if (
            [WindowState.LATEST, WindowState.LIVE].includes(this.state)
            && ev.message.location.roomId === this.roomId
            && ev.message.location.topicId === this.topicId
        ) {
            this.addItems([ev.message], 'tail');
        }
    }

    private async handleMessagesRedacted(ev: MessagesRedacted): Promise<void> {
        if (ev.location.topicId !== this.topicId || ev.location.roomId !== this.roomId) {
            return;
        }

        // const refTopicIds = this.items
        //     .filter(msg => msg.topicRef && ev.ids.includes(msg.id))
        //     .map(msg => msg.topicRef as string);

        this.delete(...ev.ids);

        if (this.length === 0) {
            await this.resetToLatest();
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
}