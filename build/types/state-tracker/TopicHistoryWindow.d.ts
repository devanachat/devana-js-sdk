import { Message, Topic } from "../types/src";
import { ChatStateTracker } from "./ChatStateTracker";
import { ObservableIndexedObjectCollection } from "../IndexedObjectCollection";
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
export declare abstract class TraversableRemoteCollection<T> extends ObservableIndexedObjectCollection<T> {
    /**
     * Current mode od collection window. To change mode, call one of available fetch methods.
     */
    get state(): WindowState;
    /**
     * Maximum numer of items stored in window.
     * Null for unlimited.
     */
    limit: number | null;
    private currentState;
    private fetchingState;
    oldestId: string;
    get hasLatest(): boolean;
    get hasOldest(): boolean;
    resetToLatest(): Promise<void>;
    fetchPrevious(): Promise<void>;
    fetchNext(): Promise<void>;
    protected abstract fetchLatestItems(): Promise<T[]>;
    protected abstract fetchItemsBefore(): Promise<T[] | null>;
    protected abstract fetchItemsAfter(): Promise<T[] | null>;
    protected abstract isLatestItemLoaded(): Promise<boolean>;
    protected refreshFetchedState(): Promise<void>;
    protected addItems(newItems: T[], to: 'head' | 'tail'): void;
    /**
     * Return array with messages of count that matching limit.
     */
    private trimItemsArrayToLimit;
}
export declare class TopicHistoryWindow extends TraversableRemoteCollection<Message> {
    private roomId;
    private topicId;
    private tracker;
    /**
     * Reexported available window modes enum.
     */
    readonly WindowState: typeof WindowState;
    private traverseLock;
    constructor(roomId: string, topicId: string, tracker: ChatStateTracker);
    get isTraverseLocked(): boolean;
    setTraverseLock(lock: boolean): Promise<void>;
    resetToLatest(): Promise<void>;
    fetchNext(): Promise<void>;
    fetchPrevious(): Promise<void>;
    /**
     * For internal use.
     * @internal
     */
    _updateMessageReference(refTopic: Topic): void;
    private handleNewMessage;
    private handleSession;
    protected fetchItemsAfter(): Promise<Message[] | null>;
    protected fetchItemsBefore(): Promise<Message[] | null>;
    protected fetchLatestItems(): Promise<Message[]>;
    private getTopic;
    private getLatestMessageId;
    protected isLatestItemLoaded(): Promise<boolean>;
}
