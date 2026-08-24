import {
    GetMessages,
    Message,
    MessageReaction,
    ReactionUpdated,
    MessagesRedacted,
    NewMessage,
    Reacted,
    Topic,
    UserReaction,
} from "../types/src";
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

    public async resetToLatest(force: boolean = false): Promise<void> {
        if (this.internalState.ongoing || (! force && this.internalState.current === WindowState.LATEST)) {
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
        if (this.internalState.ongoing || (this.state !== WindowState.LIVE && this._items.has(id))) {
            return;
        }

        let result: ItemT[] | null;
        const originalState = this.state;
        this.internalState.ongoing = WindowState.PAST;

        try {
            result = await this.fetchItemsAround(id);
            this.internalState.lastFetchCount = result ? result.length : 0;

            if (result) {
                this._items.deleteAll(); // Directly call deleteAll to prevent event emit.
                this.addItems(result, 'tail');
                await this.refreshFetchedState();
            }
        } finally {
            this.internalState.ongoing = undefined;
        }

        this.emitChangeWithDiff(!!result, originalState);
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
        includeMyReactions: boolean,
        myReactions: Record<string, UserReaction[]>,
    };

    public constructor(
        private roomId: string,
        private topicId: string,
        private tracker: ChatStateTracker,
        bindEvents: boolean = true,
    ) {
        super('id');

        this.internalState.traverseLock = false;
        this.internalState.includeMyReactions = true;
        this.internalState.myReactions = {};

        if (bindEvents) {
            this.tracker.client.on('NewMessage', ev => this.handleNewMessage(ev));
            this.tracker.client.on('MessagesRedacted', ev => this.handleMessagesRedacted(ev));
            this.tracker.client.on('ReactionUpdated', ev => this.handleReactionUpdated(ev));
            this.tracker.client.on('Reacted', ev => this.handleReacted(ev));
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

    /**
     * What the connected user has reacted with, keyed by message id. Kept apart from
     * the messages, so the history itself is identical for every user.
     */
    public get myReactions(): Readonly<Record<string, UserReaction[]>> {
        return this.internalState.myReactions;
    }

    /**
     * Whether the history is fetched together with the reactions of the connected
     * user. Turn it off only where the active state of a reaction is never rendered.
     */
    public get includeMyReactions(): boolean {
        return this.internalState.includeMyReactions;
    }

    public set includeMyReactions(value: boolean) {
        this.internalState.includeMyReactions = value;
    }

    public async setTraverseLock(lock: boolean): Promise<void> {
        this.internalState.traverseLock = lock;

        if (lock && (this.state !== WindowState.LIVE && this.state !== WindowState.LATEST)) {
            await super.resetToLatest();
        }
    }

    public async resetToLatest(force: boolean = false): Promise<void> {
        if (this.internalState.traverseLock) {
            return;
        }
        return super.resetToLatest(force);
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

        // If there is no message to refer, fetch latest
        return afterId ? this.fetchMessages({after: afterId}) : null;
    }

    protected async fetchItemsAround(id: string): Promise<Message[] | null> {
        return this.fetchMessages({around: id});
    }

    protected async fetchItemsBefore(): Promise<Message[] | null> {
        const beforeId = this.getAt(0)?.id;

        // If there is no message to refer, fetch latest
        return beforeId ? this.fetchMessages({before: beforeId}) : null;
    }

    protected async fetchLatestItems(): Promise<Message[]> {
        return this.fetchMessages({});
    }

    private async fetchMessages(criteria: Partial<GetMessages>): Promise<Message[]> {
        const result = await this.tracker.client.send('GetMessages', {
            location: {roomId: this.roomId, topicId: this.topicId},
            limit: this.internalState.fetchLimit,
            includeMyReactions: this.internalState.includeMyReactions,
            ...criteria,
        });

        if (result.error) {
            throw new Error(`Cannot fetch messages: ${result.error.message}`);
        }

        this.storeMyReactions(result.data.messages, result.data.myReactions);

        return result.data.messages;
    }

    /**
     * The response is the truth for every message it covers, so a message it does not
     * mention has no reaction of this user left on it.
     */
    private storeMyReactions(messages: Message[], myReactions?: Record<string, UserReaction[]>): void {
        if (! this.internalState.includeMyReactions) {
            return;
        }

        for (const message of messages) {
            const own = myReactions?.[message.id];

            if (own?.length) {
                this.internalState.myReactions[message.id] = own;
            } else {
                delete this.internalState.myReactions[message.id];
            }
        }
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

    /**
     * The counter arrives as the global source of truth - only it is overwritten, and
     * a reaction nobody holds any more (count 0) leaves the message.
     */
    private handleReactionUpdated(ev: ReactionUpdated): void {
        const message = this.get(ev.messageId);

        if (! message) {
            return;
        }

        const index = message.reactions.findIndex(
            reaction => reaction.type === ev.reaction.type && reaction.value === ev.reaction.value);

        if (index === -1 && ! ev.reaction.count) {
            return;
        }

        const reactions: MessageReaction[] = [...message.reactions];

        if (index === -1) {
            reactions.push(ev.reaction);
        } else if (ev.reaction.count) {
            reactions[index] = ev.reaction; // In place - a pill must not jump around as its counter moves
        } else {
            reactions.splice(index, 1);
        }

        this.set({...message, reactions});
    }

    private handleReacted(ev: Reacted): void {
        if (! this.has(ev.messageId)) {
            return;
        }

        const {type, value, isAdded} = ev.reaction;
        const own = (this.internalState.myReactions[ev.messageId] ?? [])
            .filter(reaction => reaction.type !== type || reaction.value !== value);

        if (isAdded) {
            own.push({type, value});
        }

        if (own.length) {
            this.internalState.myReactions[ev.messageId] = own;
        } else {
            delete this.internalState.myReactions[ev.messageId];
        }

        this.eventTarget.emit('change', {setItems: [ev.messageId]});
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
