import { Message, ReactionUpdated, MessagesRedacted, NewMessage, Reacted, Topic, UserReaction } from "../types/src";
import { ChatStateTracker } from "./ChatStateTracker";
import { CollectionEventMap, ObservableIndexedObjectCollection } from "../IndexedObjectCollection";
export declare enum WindowState {
    /**
     * The latest messages (those received live) are available in the history window, history has not been fetched.
     */
    LIVE = 0,
    /**
     * The latest messages has been fetched and are available in the history window.
     */
    LATEST = 1,
    /**
     * The historical messages have been fetched and are available in the history window.
     * Latest messages are not available and will not be available.
     */
    PAST = 2,
    /**
     * The oldest messages have been fetched and are available in the history window.
     * Next attempts to fetch previous messages will result with no-op.
     */
    OLDEST = 3
}
export declare abstract class TraversableRemoteCollection<ItemT, EventMapT extends CollectionEventMap = CollectionEventMap> extends ObservableIndexedObjectCollection<ItemT, EventMapT> {
    /**
     * Current mode od collection window. To change mode, call one of available fetch methods.
     */
    get state(): WindowState;
    protected internalState: {
        current: WindowState;
        ongoing?: WindowState;
        limit: number | null;
        retainRatio: number;
        fetchLimit: number;
        lastFetchCount: number;
        oldestId: string | null;
    };
    /**
     * Number of items to fetch per request.
     */
    get fetchLimit(): number;
    /**
     * Sets number of items to fetch per request.
     */
    set fetchLimit(value: number);
    /**
     * Maximum number of items stored in window (High Watermark).
     * Null for unlimited.
     */
    get limit(): number | null;
    /**
     * Maximum number of items stored in window (High Watermark).
     * Null for unlimited. Lowering it below the current length drops the oldest items right away.
     */
    set limit(value: number | null);
    /**
     * Percentage of limit to keep when trimming.
     */
    get retainRatio(): number;
    /**
     * Percentage of limit to keep when trimming.
     */
    set retainRatio(value: number);
    get hasLatest(): boolean;
    get hasOldest(): boolean;
    abstract createMirror(): TraversableRemoteCollection<ItemT, EventMapT>;
    resetToLatest(force?: boolean): Promise<void>;
    fetchPrevious(): Promise<void>;
    fetchNext(): Promise<void>;
    jumpTo(id: string): Promise<void>;
    protected abstract fetchLatestItems(): Promise<ItemT[]>;
    protected abstract fetchItemsBefore(): Promise<ItemT[] | null>;
    protected abstract fetchItemsAfter(): Promise<ItemT[] | null>;
    protected abstract fetchItemsAround(id: string): Promise<ItemT[] | null>;
    protected abstract isLatestItemLoaded(): Promise<boolean>;
    protected refreshFetchedState(): Promise<void>;
    /**
     * Add items without emitting an event, trimming the window from the opposite end using the
     * High/Low Watermark strategy. An item already in the window keeps its position.
     * @return Ids of the items trimmed out.
     */
    protected addItems(newItems: ItemT[], to: 'head' | 'tail', highWatermark?: number | null): string[];
    protected emitChangeWithDiff(itemChanged: boolean, originalState: WindowState): void;
    /**
     * Drop the oldest items, so that at most `keep` remain. The newest items stay, so whether the window holds the
     * latest ones does not change - but the oldest it held are gone.
     * @return Ids of the dropped items.
     */
    protected trimHead(keep: number | null): string[];
    private trimTail;
    /**
     * Number of items left after trimming a window that went over the given High Watermark.
     */
    private getLowWatermark;
}
export type TopicHistoryWindowEventMap = CollectionEventMap & {
    reftopicsdeleted: string[];
};
export declare class TopicHistoryWindow extends TraversableRemoteCollection<Message, TopicHistoryWindowEventMap> {
    private roomId;
    private topicId;
    private tracker;
    /**
     * Reexported available window modes enum.
     */
    readonly WindowState: typeof WindowState;
    protected internalState: typeof TraversableRemoteCollection<Message>['prototype']['internalState'] & {
        traverseLock: boolean;
        includeMyReactions: boolean;
        myReactions: Record<string, UserReaction[]>;
        liveLimit: number | null;
    };
    /**
     * The window does not subscribe to the client itself - the messages manager routes the events of its topic to it.
     */
    constructor(roomId: string, topicId: string, tracker: ChatStateTracker);
    createMirror(): TopicHistoryWindow;
    get isTraverseLocked(): boolean;
    /**
     * What the connected user has reacted with, keyed by message id. Kept apart from
     * the messages, so the history itself is identical for every user.
     */
    get myReactions(): Readonly<Record<string, UserReaction[]>>;
    /**
     * Whether the history is fetched together with the reactions of the connected
     * user. Turn it off only where the active state of a reaction is never rendered.
     */
    get includeMyReactions(): boolean;
    set includeMyReactions(value: boolean);
    /**
     * Maximum number of items a window that has not been fetched yet (LIVE state) collects from the incoming
     * messages. Null for the same as {@link limit}. It keeps the windows of topics nobody looks at small;
     * the windows of ephemeral topics are exempt, as the live messages are all the history they have.
     */
    get liveLimit(): number | null;
    set liveLimit(value: number | null);
    setTraverseLock(lock: boolean): Promise<void>;
    resetToLatest(force?: boolean): Promise<void>;
    fetchNext(): Promise<void>;
    fetchPrevious(): Promise<void>;
    jumpTo(id: string): Promise<void>;
    /**
     * For internal use.
     * @internal
     */
    _updateMessageReference(refTopic: Topic): void;
    protected fetchItemsAfter(): Promise<Message[] | null>;
    protected fetchItemsAround(id: string): Promise<Message[] | null>;
    protected fetchItemsBefore(): Promise<Message[] | null>;
    protected fetchLatestItems(): Promise<Message[]>;
    private fetchMessages;
    /**
     * The response is the truth for every message it covers, so a message it does not
     * mention has no reaction of this user left on it.
     */
    private storeMyReactions;
    private getTopic;
    private getLatestMessageId;
    protected isLatestItemLoaded(): Promise<boolean>;
    /**
     * For internal use.
     * @internal
     */
    _handleNewMessage(ev: NewMessage): void;
    /**
     * The counter arrives as the global source of truth - only it is overwritten, and
     * a reaction nobody holds any more (count 0) leaves the message.
     * For internal use.
     * @internal
     */
    _handleReactionUpdated(ev: ReactionUpdated): void;
    /**
     * For internal use.
     * @internal
     */
    _handleReacted(ev: Reacted): void;
    /**
     * For internal use.
     * @internal
     */
    _handleMessagesRedacted(ev: MessagesRedacted): Promise<void>;
}
