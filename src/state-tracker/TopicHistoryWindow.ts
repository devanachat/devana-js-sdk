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
     * Null for unlimited. Lowering it below the current length drops the oldest items right away.
     */
    public set limit(value: number | null) {
        this.internalState.limit = value;

        const deletedItems = this.trimHead(value);

        if (deletedItems.length) {
            this.eventTarget.emit('change', {deletedItems});
        }
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

    /**
     * Add items without emitting an event, trimming the window from the opposite end using the
     * High/Low Watermark strategy. An item already in the window keeps its position.
     * @return Ids of the items trimmed out.
     */
    protected addItems(newItems: ItemT[], to: 'head' | 'tail', highWatermark: number | null = this.limit): string[] {
        const entries = newItems.map(item => [this.getId(item), item] as [string, ItemT]);

        if (to === 'tail') {
            this._items.set(...entries);
            return this.trimHead(this.getLowWatermark(highWatermark));
        }

        // Prepending has to rebuild the map; a duplicate keeps the already loaded version of the item.
        const loaded = Array.from(this._items.items);
        this._items.deleteAll();
        this._items.set(...entries, ...loaded);

        return this.trimTail(this.getLowWatermark(highWatermark));
    }

    protected emitChangeWithDiff(itemChanged: boolean, originalState: WindowState): void {
        if (itemChanged || originalState !== this.state) {
            this.eventTarget.emit('change', { setItems: Array.from(this._items.items.keys()) })
        }
    }

    /**
     * Drop the oldest items, so that at most `keep` remain. The newest items stay, so whether the window holds the
     * latest ones does not change - but the oldest it held are gone.
     * @return Ids of the dropped items.
     */
    protected trimHead(keep: number | null): string[] {
        if (keep === null || this._items.length <= keep) {
            return [];
        }

        const deletedItems: string[] = [];
        const deleteCount = this._items.length - keep;

        for (const id of this._items.items.keys()) {
            if (deletedItems.length === deleteCount) {
                break;
            }
            deletedItems.push(id);
        }

        this._items.delete(...deletedItems);

        if (this.internalState.current === WindowState.OLDEST) {
            this.internalState.current = WindowState.PAST;
        }

        return deletedItems;
    }

    private trimTail(keep: number | null): string[] {
        if (keep === null || this._items.length <= keep) {
            return [];
        }

        const deletedItems = Array.from(this._items.items.keys()).slice(keep);
        this._items.delete(...deletedItems);

        return deletedItems;
    }

    /**
     * Number of items left after trimming a window that went over the given High Watermark.
     */
    private getLowWatermark(highWatermark: number | null): number | null {
        if (highWatermark === null || this._items.length <= highWatermark) {
            return null;
        }

        return Math.floor(highWatermark * this.internalState.retainRatio);
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
        liveLimit: number | null,
    };

    /**
     * The window does not subscribe to the client itself - the messages manager routes the events of its topic to it.
     */
    public constructor(
        private roomId: string,
        private topicId: string,
        private tracker: ChatStateTracker,
    ) {
        super('id');

        this.internalState.traverseLock = false;
        this.internalState.includeMyReactions = true;
        this.internalState.myReactions = {};
        this.internalState.liveLimit = 50;
    }

    public createMirror(): TopicHistoryWindow {
        const copy = new TopicHistoryWindow(this.roomId, this.topicId, this.tracker);
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

    /**
     * Maximum number of items a window that has not been fetched yet (LIVE state) collects from the incoming
     * messages. Null for the same as {@link limit}. It keeps the windows of topics nobody looks at small;
     * the windows of ephemeral topics are exempt, as the live messages are all the history they have.
     */
    public get liveLimit(): number | null {
        return this.internalState.liveLimit;
    }

    public set liveLimit(value: number | null) {
        this.internalState.liveLimit = value;
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

        const next = {...this.internalState.myReactions};

        for (const message of messages) {
            const own = myReactions?.[message.id];

            if (own?.length) {
                next[message.id] = own;
            } else {
                delete next[message.id];
            }
        }

        this.internalState.myReactions = next;
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

    /**
     * For internal use.
     * @internal
     */
    public _handleNewMessage(ev: NewMessage): void {
        if (! this.hasLatest) {
            return;
        }

        const limit = this.state === WindowState.LIVE && ! this.internalState.traverseLock
            ? this.internalState.liveLimit ?? this.limit
            : this.limit;
        const deletedItems = this.addItems([ev.message], 'tail', limit);

        this.eventTarget.emit('change', deletedItems.length
            ? {setItems: [ev.message.id], deletedItems}
            : {setItems: [ev.message.id]});
    }

    /**
     * The counter arrives as the global source of truth - only it is overwritten, and
     * a reaction nobody holds any more (count 0) leaves the message.
     * For internal use.
     * @internal
     */
    public _handleReactionUpdated(ev: ReactionUpdated): void {
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

    /**
     * For internal use.
     * @internal
     */
    public _handleReacted(ev: Reacted): void {
        if (! this.has(ev.messageId)) {
            return;
        }

        const {type, value, isAdded} = ev.reaction;
        const own = (this.internalState.myReactions[ev.messageId] ?? [])
            .filter(reaction => reaction.type !== type || reaction.value !== value);

        if (isAdded) {
            own.push({type, value});
        }

        const {[ev.messageId]: _previous, ...myReactions} = this.internalState.myReactions;

        if (own.length) {
            myReactions[ev.messageId] = own;
        }

        this.internalState.myReactions = myReactions;
        this.eventTarget.emit('change', {setItems: [ev.messageId]});
    }

    /**
     * For internal use.
     * @internal
     */
    public async _handleMessagesRedacted(ev: MessagesRedacted): Promise<void> {
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
