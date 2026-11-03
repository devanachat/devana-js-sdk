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
} from "../protocol";
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
        fetchSettled?: Promise<void>,
        settleFetch?: () => void,
        limit: number | null, // Acts as High Watermark
        retainRatio: number, // Percentage of limit to keep when trimming
        fetchLimit: number,
        lastFetchCount: number,
        oldestId: string | null,
        gaps: string[],
    } = {
        current: WindowState.LIVE,
        ongoing: undefined,
        limit: 1000,
        retainRatio: 1,
        fetchLimit: 50,
        lastFetchCount: 0,
        oldestId: null,
        gaps: [],
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

    /**
     * IDs of the items with a gap in front of them: the item right above in the window is not the real predecessor,
     * an unknown number of items in between was never fetched. Such a seam appears when {@link resyncToLatest} gets
     * a full page that does not reach the loaded items. A marker lives as long as its item stays in the window and
     * is closed once the items right before it are fetched.
     */
    public get gaps(): readonly string[] {
        return this.internalState.gaps;
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
        this.beginFetch(WindowState.LATEST);

        try {
            result = await this.fetchLatestItems();
            this.internalState.lastFetchCount = result.length;
        } finally {
            this.endFetch();
        }

        this.replaceItems(result);
        this.internalState.current = WindowState.LATEST;
        this.emitChangeWithDiff(true, originalState);
    }

    /**
     * Refresh the window with the latest page, keeping the already loaded items instead of replacing them - the
     * reconnect-friendly variant of {@link resetToLatest}. The page is merged on top of the loaded items (an item in
     * both is taken from the page) and only the window size limit pushes the oldest ones out. When the page is full
     * and does not reach the newest loaded item, both parts are still kept and the seam is recorded in {@link gaps}.
     */
    public async resyncToLatest(): Promise<void> {
        if (this.internalState.ongoing) {
            return;
        }

        let result;
        const originalState = this.state;
        this.beginFetch(WindowState.LATEST);

        try {
            result = await this.fetchLatestItems();
            this.internalState.lastFetchCount = result.length;
        } finally {
            this.endFetch();
        }

        const loaded = this.items;
        const fetchedIds = new Set(result.map(item => this.getId(item)));
        const retained = loaded.filter(item => ! fetchedIds.has(this.getId(item)));

        // A page shorter than the limit is everything the remote side has, so nothing can be missing in between.
        const isContinuous = ! retained.length
            || result.length < this.internalState.fetchLimit
            || fetchedIds.has(this.getId(loaded[loaded.length - 1]));

        // The page is continuous, so only its first item can have a gap in front of it.
        this.forgetGapsOf(result.slice(1).map(item => this.getId(item)));

        if (! isContinuous && ! this.internalState.gaps.includes(this.getId(result[0]))) {
            this.internalState.gaps = [...this.internalState.gaps, this.getId(result[0])];
        }

        this._items.deleteAll(); // Directly call deleteAll to prevent event emit.
        this.addItems([...retained, ...result], 'tail');
        this.internalState.current = WindowState.LATEST;
        this.emitChangeWithDiff(true, originalState);
    }

    public async fetchPrevious(): Promise<void> {
        if (this.internalState.ongoing || this.hasOldest) {
            return;
        }

        let result;
        const originalState = this.state;
        const firstItem = this.getAt(0);
        this.beginFetch(WindowState.PAST);

        try {
            result = await this.fetchItemsBefore();
            this.internalState.lastFetchCount = result ? result.length : 0;
        } finally {
            this.endFetch();
        }

        if (! result) {
            return this.resetToLatest();
        }

        if (! result.length) {
            this.internalState.oldestId = firstItem ? this.getId(firstItem) : null;

            await this.refreshFetchedState();

            // LATEST state has priority over OLDEST
            if (this.internalState.current === WindowState.PAST) {
                this.internalState.current = WindowState.OLDEST;
            }

            this.emitChangeWithDiff(false, originalState);
            return;
        }

        if (firstItem) {
            // The page was fetched as the direct predecessors of the first item, so a gap in front of it is closed.
            this.forgetGapsOf([this.getId(firstItem)]);
        }

        this.addItems(result, 'head');
        await this.refreshFetchedState();
        this.emitChangeWithDiff(true, originalState);
    }

    public async fetchNext(): Promise<void> {
        if (this.hasLatest) {
            return;
        }

        return this.fetchAfterLast();
    }

    /**
     * Append the items that follow the last one in the window; an empty window gets the latest items.
     */
    protected async fetchAfterLast(): Promise<void> {
        if (this.internalState.ongoing) {
            return;
        }

        let result;
        const originalState = this.state;
        this.beginFetch(WindowState.PAST);

        try {
            result = await this.fetchItemsAfter();
            this.internalState.lastFetchCount = result ? result.length : 0;
        } finally {
            this.endFetch();
        }

        if (! result) {
            await this.resetToLatest(true);
            return;
        }

        if (result.length) {
            this.addItems(result, 'tail');
            await this.refreshFetchedState();
            this.emitChangeWithDiff(true, originalState);
            return;
        }
    }

    /**
     * Load the items around the given one. Asked for while another fetch is running, it waits for that fetch to end
     * instead of being dropped - when the call returns, the window either holds the item or it could not be loaded.
     */
    public async jumpTo(id: string): Promise<void> {
        while (this.internalState.ongoing) {
            await this.internalState.fetchSettled;
        }

        if (this.state !== WindowState.LIVE && this._items.has(id)) {
            return;
        }

        let result: ItemT[] | null;
        const originalState = this.state;
        this.beginFetch(WindowState.PAST);

        try {
            result = await this.fetchItemsAround(id);
            this.internalState.lastFetchCount = result ? result.length : 0;

            if (result) {
                this.replaceItems(result);
                await this.refreshFetchedState();
            }
        } finally {
            this.endFetch();
        }

        this.emitChangeWithDiff(!!result, originalState);
    }

    public delete(...ids: string[]): void {
        super.delete(...ids);
        this.forgetGapsOf(ids);
    }

    public deleteAll(): void {
        super.deleteAll();
        this.internalState.gaps = [];
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

    protected beginFetch(kind: WindowState): void {
        this.internalState.ongoing = kind;
        this.internalState.fetchSettled = new Promise(resolve => this.internalState.settleFetch = resolve);
    }

    protected endFetch(): void {
        this.internalState.ongoing = undefined;
        this.internalState.settleFetch?.();
    }

    /**
     * Replace the whole content without emitting an event; the old gap markers mean nothing for the new content.
     */
    protected replaceItems(items: ItemT[]): void {
        this._items.deleteAll();
        this.internalState.gaps = [];
        this.addItems(items, 'tail');
    }

    protected forgetGapsOf(ids: string[]): void {
        if (this.internalState.gaps.length && ids.length) {
            const removed = new Set(ids);
            this.internalState.gaps = this.internalState.gaps.filter(id => ! removed.has(id));
        }
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
        this.forgetGapsOf(deletedItems);

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
        this.forgetGapsOf(deletedItems);

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
        private preview: boolean = false,
    ) {
        super('id');

        this.internalState.traverseLock = false;
        this.internalState.includeMyReactions = ! preview;
        this.internalState.myReactions = {};
        this.internalState.liveLimit = 50;
    }

    public createMirror(): TopicHistoryWindow {
        const copy = new TopicHistoryWindow(this.roomId, this.topicId, this.tracker, this.preview);
        copy.eventTarget = this.eventTarget;
        copy._items = this._items;
        copy.internalState = this.internalState;
        return copy;
    }

    /**
     * Window of a room you have not joined. It gets no live messages - at the latest ones fetchNext() fetches the newer.
     */
    public get isPreview(): boolean {
        return this.preview;
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

    public async resyncToLatest(): Promise<void> {
        if (this.internalState.traverseLock) {
            return;
        }
        return super.resyncToLatest();
    }

    public async fetchNext(): Promise<void> {
        if (this.internalState.traverseLock) {
            return;
        }
        if (this.preview && this.hasLatest) {
            return this.fetchAfterLast(); // No events reach a preview
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
     * The latest messages (oldest first) with the reactions of the user, or null if the window does not hold them.
     * @internal
     */
    public _exportLatest(limit: number): {messages: Message[], myReactions: Record<string, UserReaction[]>} | null {
        if (this.state !== WindowState.LATEST) {
            return null;
        }

        const items = this.items;
        // A restored window is taken for continuous, so nothing above the newest gap goes into it.
        const continuousFrom = Math.max(0, ...this.internalState.gaps.map(id => items.findIndex(item => item.id === id)));
        const messages = items.slice(Math.max(continuousFrom, items.length - Math.max(limit, this.fetchLimit)));
        const myReactions: Record<string, UserReaction[]> = {};

        for (const message of messages) {
            if (this.internalState.myReactions[message.id]) {
                myReactions[message.id] = this.internalState.myReactions[message.id];
            }
        }

        return {messages, myReactions};
    }

    /**
     * Fill the window with saved latest messages, as if they were just fetched; the next reset to the latest replaces
     * them.
     * @internal
     */
    public _restoreLatest(messages: Message[], myReactions: Record<string, UserReaction[]>): void {
        const originalState = this.state;

        this.replaceItems(messages);
        this.internalState.myReactions = {...myReactions};
        this.internalState.current = WindowState.LATEST;
        this.emitChangeWithDiff(true, originalState);
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
        if (this.preview) {
            // The tracker holds the topics of the joined rooms only
            const result = await this.tracker.client.send('GetTopics', {roomId: this.roomId, topicIds: [this.topicId]});

            if (result.error) {
                throw new Error(`Cannot fetch topic: ${result.error.message}`);
            }

            return result.data.topics.find(topic => topic.id === this.topicId);
        }

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

        // Not `{[ev.messageId]: _, ...rest}` - Babel's loose object rest drops the key when the binding is unused (babel/babel#18196)
        const myReactions = {...this.internalState.myReactions};
        delete myReactions[ev.messageId];

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
