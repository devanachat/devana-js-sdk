import {Message, RoomSummary} from "../protocol";
import {ChatStateTracker} from "./ChatStateTracker";
import {CollectionEventMap} from "../IndexedObjectCollection";
import {TraversableRemoteCollection, WindowState} from "./TopicHistoryWindow";

/**
 * Thrown when a room cannot be previewed: the server refused the summary or the history, or it gave no topic to address
 * the history with. `code` is the code of the server error (see `ErrorCode`), or `NoTopic`.
 */
export class RoomPreviewError extends Error {
    public constructor(message: string, public readonly code: string) {
        super(message);
        this.name = 'RoomPreviewError';
    }
}

/** A page of the history is fetched again at the end no sooner than this by {@link PreviewHistoryWindow.refresh}. */
const DEFAULT_REFRESH_INTERVAL_MS = 5000;

/**
 * The messages of a topic of a room the user has not joined (access level 2: `PreviewRooms`).
 *
 * It is the same window as {@link TopicHistoryWindow} - the same states, `resetToLatest`, `fetchPrevious`,
 * `fetchNext`, `jumpTo`, `limit`, mirrors and `change` events - except for what the server does not give a non-member:
 * - no live events (the server sends the events of a room to its members only), so new messages come with
 *   {@link refresh}, on demand;
 * - nothing changes for the user: no `Ack`, no unread counters, and the room is not added to the joined ones.
 *
 * Create it with `client.state.previewRoom()`. It holds no subscriptions, only the messages; call {@link dispose}
 * when the view is closed, or when the user has joined the room and the regular history takes over.
 */
export class PreviewHistoryWindow extends TraversableRemoteCollection<Message, CollectionEventMap> {
    public readonly WindowState: typeof WindowState = WindowState;

    declare protected internalState: TraversableRemoteCollection<Message>['internalState'] & {
        refreshedAt: number,
        refreshInterval: number,
        disposed: boolean,
    };

    /**
     * @param roomId The previewed room.
     * @param topicId The topic whose history the window holds.
     * @param summary The summary of the room the window was created from; a window created otherwise has none.
     */
    public constructor(
        public readonly roomId: string,
        public readonly topicId: string,
        private readonly tracker: ChatStateTracker,
        public readonly summary?: RoomSummary,
    ) {
        super('id');

        this.internalState.refreshedAt = 0;
        this.internalState.refreshInterval = DEFAULT_REFRESH_INTERVAL_MS;
        this.internalState.disposed = false;
    }

    public createMirror(): PreviewHistoryWindow {
        const copy = new PreviewHistoryWindow(this.roomId, this.topicId, this.tracker, this.summary);
        copy.eventTarget = this.eventTarget;
        copy._items = this._items;
        copy.internalState = this.internalState;
        return copy;
    }

    /**
     * Previews do not follow the history live, so there is no sense in a window that never was filled
     * being "live". Always false.
     */
    public get isTraverseLocked(): boolean {
        return false;
    }

    /**
     * A preview cannot react, so there are no reactions of the user. Kept for the interface of {@link TopicHistoryWindow}.
     */
    public get myReactions(): Readonly<Record<string, never>> {
        return {};
    }

    public get isDisposed(): boolean {
        return this.internalState.disposed;
    }

    /**
     * The shortest time between two fetches done by {@link refresh}, in milliseconds.
     */
    public get refreshInterval(): number {
        return this.internalState.refreshInterval;
    }

    public set refreshInterval(value: number) {
        this.internalState.refreshInterval = value;
    }

    /**
     * Fills the window: with the surroundings of the message, or - without one - with the latest messages.
     */
    public async load(around?: string): Promise<void> {
        return around ? this.jumpTo(around) : this.resetToLatest();
    }

    /**
     * Takes the messages written since the window was filled - for when the end of the list is reached or the user
     * asks for it. Does nothing when the window does not end at the latest message, when a fetch is on, or when the
     * last one was less than {@link refreshInterval} ago.
     */
    public async refresh(): Promise<void> {
        if (this.isDisposed || this.internalState.ongoing || this.state !== WindowState.LATEST
            || Date.now() - this.internalState.refreshedAt < this.internalState.refreshInterval) {
            return;
        }

        const lastId = this.getAt(this.length - 1)?.id;

        if (! lastId) {
            return this.resetToLatest(true);
        }

        const originalState = this.state;
        this.internalState.ongoing = WindowState.LATEST;

        let result: Message[];

        try {
            result = await this.fetchMessages({after: lastId});
        } finally {
            this.internalState.ongoing = undefined;
        }

        if (this.isDisposed) {
            return;
        }

        this.internalState.refreshedAt = Date.now();

        if (result.length) {
            this.addItems(result, 'tail');
            await this.refreshFetchedState();
        }

        this.emitChangeWithDiff(result.length > 0, originalState);
    }

    /**
     * Drops the messages and makes every later call a no-op. The window cannot be used again.
     */
    public dispose(): void {
        this.internalState.disposed = true;
        this._items.deleteAll();
    }

    public async resetToLatest(force: boolean = false): Promise<void> {
        if (this.isDisposed) {
            return;
        }

        await super.resetToLatest(force);
        this.internalState.refreshedAt = Date.now();
    }

    public async fetchPrevious(): Promise<void> {
        return this.isDisposed ? undefined : super.fetchPrevious();
    }

    public async fetchNext(): Promise<void> {
        return this.isDisposed ? undefined : super.fetchNext();
    }

    public async jumpTo(id: string): Promise<void> {
        return this.isDisposed ? undefined : super.jumpTo(id);
    }

    protected async fetchLatestItems(): Promise<Message[]> {
        return this.fetchMessages({});
    }

    protected async fetchItemsBefore(): Promise<Message[] | null> {
        const beforeId = this.getAt(0)?.id;

        // If there is no message to refer, fetch latest
        return beforeId ? this.fetchMessages({before: beforeId}) : null;
    }

    protected async fetchItemsAfter(): Promise<Message[] | null> {
        const afterId = this.getAt(this.length - 1)?.id;

        // If there is no message to refer, fetch latest
        return afterId ? this.fetchMessages({after: afterId}) : null;
    }

    protected async fetchItemsAround(id: string): Promise<Message[] | null> {
        return this.fetchMessages({around: id});
    }

    /**
     * The topic is asked for, as the tracker knows only the topics of the rooms the user is in.
     */
    protected async isLatestItemLoaded(): Promise<boolean> {
        const result = await this.tracker.client.send('GetTopics', {roomId: this.roomId, topicIds: [this.topicId]});

        if (result.error) {
            throw new RoomPreviewError(`Cannot fetch the topic: ${result.error.message}`, result.error.code);
        }

        const lastMessageId = result.data.topics[0]?.lastMessage?.id;

        return lastMessageId ? this.has(lastMessageId) : true;
    }

    private async fetchMessages(criteria: {before?: string, after?: string, around?: string}): Promise<Message[]> {
        const result = await this.tracker.client.send('GetMessages', {
            location: {roomId: this.roomId, topicId: this.topicId},
            limit: this.internalState.fetchLimit,
            ...criteria,
        });

        if (result.error) {
            throw new RoomPreviewError(`Cannot fetch messages: ${result.error.message}`, result.error.code);
        }

        // A window disposed while the request was on stays empty.
        return this.isDisposed ? [] : result.data.messages;
    }
}
