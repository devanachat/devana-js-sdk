import {Message, NewMessage, Session, Topic} from "../types/src";
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
        return this.currentState;
    }

    /**
     * Maximum numer of items stored in window.
     * Null for unlimited.
     */
    public limit: number | null = 50;

    private currentState: WindowState = WindowState.LIVE;
    private fetchingState: WindowState = undefined;
    public oldestId: string = null;

    public get hasLatest(): boolean {
        return [WindowState.LATEST, WindowState.LIVE].includes(this.state);
    }

    public get hasOldest(): boolean {
        return this.state === WindowState.OLDEST || this.oldestId !== null && this.has(this.oldestId);
    }

    public async resetToLatest(): Promise<void> {
        if (this.fetchingState || this.currentState === WindowState.LATEST) {
            return;
        }

        this.fetchingState = WindowState.LATEST;

        let result;

        try {
            result = await this.fetchLatestItems();
        } finally {
            this.fetchingState = undefined;
        }

        this.deleteAll();
        this.addItems(result, 'tail');
        this.currentState = WindowState.LATEST;
    }

    public async fetchPrevious(): Promise<void> {
        if (this.fetchingState || this.hasOldest) {
            return;
        }

        this.fetchingState = WindowState.PAST;

        let result;

        try {
            result = await this.fetchItemsBefore();
        } finally {
            this.fetchingState = undefined;
        }

        if (! result) {
            return this.resetToLatest();
        }

        if (! result.length) {
            const firstItem = this.getAt(0);
            this.oldestId = firstItem ? this.getId(firstItem) : null;

            await this.refreshFetchedState();

            // LATEST state has priority over OLDEST
            if (this.currentState === WindowState.PAST) {
                this.currentState = WindowState.OLDEST;
            }

            return;
        }

        this.addItems(result, 'head');
        await this.refreshFetchedState();
    }

    public async fetchNext(): Promise<void> {
        if (this.fetchingState || this.hasLatest) {
            return;
        }

        this.fetchingState = WindowState.PAST;

        let result;

        try {
            result = await this.fetchItemsAfter();
        } finally {
            this.fetchingState = undefined;
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
        this.currentState = (await this.isLatestItemLoaded()) ? WindowState.LATEST : WindowState.PAST;
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

    public constructor(
        private roomId: string,
        private topicId: string,
        private tracker: ChatStateTracker,
    ) {
        super('id');
        this.tracker.client.on('Session', ev => this.handleSession(ev));
        this.tracker.client.on('NewMessage', ev => this.handleNewMessage(ev));
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

    private handleSession(ev: Session): void {
        const rooms = ev.state.rooms;

        if (rooms.find(room => room.id === this.roomId)) {
            this.resetToLatest();
        } else {
            this.deleteAll();
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
        });

        if (result.error) {
            throw new Error(`Cannot fetch messages: ${result.error.message}`);
        }

        return result.data.messages;
    }

    protected async fetchLatestItems(): Promise<Message[]> {
        const result = await this.tracker.client.send('GetMessages', {
            location: {roomId: this.roomId, topicId: this.topicId},
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