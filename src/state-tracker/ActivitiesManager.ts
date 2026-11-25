import {EventTarget} from "../EventTarget";
import {ObservableIndexedObjectCollection} from "../IndexedObjectCollection";
import {
    Activities,
    Activity,
    ActivityDeleted,
    ActivityUpdated,
    FollowedTopicUpdated,
    Message,
    MessagesRedacted,
    MessageUpdated,
    NewActivity,
    RoomDeleted,
    RoomJoined,
    RoomLeft,
    User,
} from "../protocol";
import {PromiseRegistry} from "./AsyncUtils";
import {ChatStateTracker} from "./ChatStateTracker";

// Mirror the server, so a live activity joins its group as the stored one did
const VISIBLE_LIMIT = 20;
const GROUP_SCAN = 5;
const MAX_ACTORS = 3;

interface EventMap {
    seenAtChange: {};
}

const time = (isoDate: string | null): number => isoDate ? Date.parse(isoDate) : 0;

const newestFirst = (a: Activity, b: Activity): number => time(b.createdAt) - time(a.createdAt);

// A reaction is to one's own message, so acknowledging it says nothing about the reaction
const isReadWithAck = (activity: Activity): boolean => activity.type !== 'Reaction' && activity.type !== 'Custom';

// Message ids are time-ordered and their base58 form has a fixed length, so they compare as strings
const isAcknowledged = (activity: Activity, topicId: string, lastAckMessageId: string): boolean =>
    isReadWithAck(activity)
    && activity.location?.topicId === topicId
    && activity.messageId !== null
    && activity.messageId <= lastAckMessageId;

export class ActivitiesManager extends EventTarget<EventMap> {
    private readonly activities = new ObservableIndexedObjectCollection<Activity>('id');
    private readonly messages = new ObservableIndexedObjectCollection<Message>('id');
    private readonly users = new ObservableIndexedObjectCollection<User>('id');
    private readonly promises = new PromiseRegistry();
    private readonly acks = new Map<string, string>();
    private readonly hiddenRoomIds = new Set<string>();
    private activitiesWanted = false;
    private messagesWanted = false;
    private refreshScheduled = false;
    private seen: string | null = null;

    public constructor(private tracker: ChatStateTracker) {
        super();

        this.tracker.client.on('NewActivity', ev => this.handleNewActivity(ev));
        this.tracker.client.on('ActivityUpdated', ev => this.handleActivityUpdated(ev));
        this.tracker.client.on('ActivityDeleted', ev => this.handleActivityDeleted(ev));
        this.tracker.client.on('FollowedTopicUpdated', ev => this.handleFollowedTopicUpdated(ev));
        this.tracker.client.on('MessageUpdated', ev => this.handleMessageUpdated(ev));
        this.tracker.client.on('MessagesRedacted', ev => this.handleMessagesRedacted(ev));
        this.tracker.client.on('RoomDeleted', ev => this.handleRoomDeleted(ev));
        this.tracker.client.on('RoomLeft', ev => this.handleRoomLeft(ev));
        this.tracker.client.on('RoomJoined', ev => this.handleRoomJoined(ev));
        this.tracker.client.on('Session', () => this.handleSession());
    }

    /**
     * Your latest activities, keyed by id; always the same collection. The first call fetches them, later ones resolve
     * with them. Once fetched, they are fetched again after every reconnect, also when the first fetch failed because
     * the connection was not ready yet. The collection keeps no meaningful order - sort by `createdAt`. Marking the list
     * as seen and clearing it is done with the `UpdateActivities` command.
     * @param fetchWithMessages Fetch the messages and the actors of the activities along, so {@link getMessages} and
     * {@link getUsers} need no request.
     */
    public async get(fetchWithMessages: boolean = false): Promise<ObservableIndexedObjectCollection<Activity>> {
        if (fetchWithMessages) {
            await this.getMessages();
        }

        if (this.promises.notExist('activities')) {
            this.activitiesWanted = true;
            this.registerFetch(false);
        }

        await this.promises.get('activities');
        return this.activities;
    }

    /**
     * The messages the activities point at, keyed by message id; always the same collection. The first call fetches
     * them together with the list of {@link get}, unless they were fetched already; afterwards they come with new
     * activities, follow the edits and are fetched again after every reconnect.
     */
    public async getMessages(): Promise<ObservableIndexedObjectCollection<Message>> {
        if (this.promises.notExist('messages')) {
            this.activitiesWanted = true;
            this.messagesWanted = true;
            this.registerFetch(true);
        }

        await this.promises.get('messages');
        return this.messages;
    }

    /**
     * The actors of the activities, keyed by user id; always the same collection, fetched and kept together with
     * {@link getMessages}.
     */
    public async getUsers(): Promise<ObservableIndexedObjectCollection<User>> {
        await this.getMessages();
        return this.users;
    }

    /**
     * When the list was last seen, on any device; null until it is fetched or while it was never seen. A change emits
     * `seenAtChange`. Activities created later that are not {@link Activity.isRead} are the unread ones.
     */
    public get seenAt(): string | null {
        return this.seen;
    }

    private registerFetch(withMessages: boolean): void {
        const fetching = this.fetch(withMessages);

        this.promises.register(fetching, 'activities');
        if (withMessages) {
            this.promises.register(fetching, 'messages');
        }
    }

    private async fetch(withMessages: boolean): Promise<void> {
        const result = await this.tracker.client.send('GetActivities', {withMessages});
        if (result.error) {
            throw result.error;
        }

        this.apply(result.data, withMessages);
    }

    private apply(ev: Activities, withMessages: boolean): void {
        this.activities.reconcile(...ev.activities);

        if (withMessages) {
            this.messages.reconcile(...ev.messages);
            this.users.reconcile(...ev.users);
        }

        this.setSeen(ev.seenAt);
    }

    private refresh(): void {
        if (this.messagesWanted) {
            this.registerFetch(true);
        } else if (this.activitiesWanted) {
            this.registerFetch(false);
        }

        this.promises.get('activities')?.catch(() => {});
    }

    private setSeen(seenAt: string | null): void {
        if (seenAt !== this.seen) {
            this.seen = seenAt;
            this.emit('seenAtChange', {});
        }
    }

    private handleNewActivity(ev: NewActivity): void {
        if (!this.activitiesWanted) {
            return;
        }

        const topicId = ev.activity.location?.topicId ?? '';
        const lastAck = this.acks.get(topicId);
        const added = lastAck && isAcknowledged(ev.activity, topicId, lastAck)
            ? {...ev.activity, isRead: true}
            : ev.activity;
        const newest = this.activities.items.sort(newestFirst);
        const group = added.groupKey === null ? undefined : newest
            .slice(0, GROUP_SCAN)
            .find(activity => activity.groupKey === added.groupKey);

        if (group && time(group.createdAt) > time(this.seen)) {
            this.activities.set({
                ...added,
                id: group.id,
                count: group.count + 1,
                actorIds: [...new Set([...added.actorIds, ...group.actorIds])].slice(0, MAX_ACTORS),
            });
        } else {
            this.activities.set(added);
            this.activities.delete(...newest.slice(VISIBLE_LIMIT - 1).map(activity => activity.id));
        }

        if (this.messagesWanted) {
            if (ev.message) {
                this.messages.set(ev.message);
            }
            this.users.set(...ev.users);
        }
    }

    private handleActivityUpdated(ev: ActivityUpdated): void {
        if (time(ev.seenAt) > time(this.seen)) {
            this.setSeen(ev.seenAt);
        }

        if (ev.cleared) {
            this.activities.deleteAll();
            this.messages.deleteAll();
            this.users.deleteAll();
        }
    }

    private handleActivityDeleted(ev: ActivityDeleted): void {
        if (this.activities.has(ev.id)) {
            this.activities.delete(ev.id);
        }
    }

    private handleFollowedTopicUpdated(ev: FollowedTopicUpdated): void {
        const {location, lastAckMessageId} = ev.followedTopic;

        if (!location.topicId || !lastAckMessageId) {
            return;
        }

        // An acknowledgement may come before the activity of the same message
        this.acks.set(location.topicId, lastAckMessageId);

        const read = this.activities.items
            .filter(activity => !activity.isRead && isAcknowledged(activity, location.topicId, lastAckMessageId))
            .map(activity => ({...activity, isRead: true}));

        this.activities.set(...read);
    }

    private handleMessageUpdated(ev: MessageUpdated): void {
        if (this.messages.has(ev.message.id)) {
            this.messages.set(ev.message);
        }
    }

    private handleMessagesRedacted(ev: MessagesRedacted): void {
        const ids = new Set(ev.ids);

        this.deleteActivities(activity => activity.messageId !== null && ids.has(activity.messageId));
    }

    private handleRoomDeleted(ev: RoomDeleted): void {
        this.hiddenRoomIds.delete(ev.id);
        this.deleteActivities(activity => activity.location?.roomId === ev.id);
    }

    private handleRoomLeft(ev: RoomLeft): void {
        // The server keeps them and hands them back once you rejoin
        if (this.deleteActivities(activity => activity.location?.roomId === ev.id)) {
            this.hiddenRoomIds.add(ev.id);
        }
    }

    private handleRoomJoined(ev: RoomJoined): void {
        if (!this.hiddenRoomIds.delete(ev.room.id) || this.refreshScheduled) {
            return;
        }

        // Joining a space joins its rooms one by one; one request brings back the activities of all of them
        this.refreshScheduled = true;
        setTimeout(() => {
            this.refreshScheduled = false;
            this.refresh();
        }, 0);
    }

    private deleteActivities(predicate: (activity: Activity) => boolean): boolean {
        const deleted = this.activities.items.filter(predicate);
        const messageIds = deleted
            .map(activity => activity.messageId)
            .filter((id): id is string => id !== null && this.messages.has(id));

        this.activities.delete(...deleted.map(activity => activity.id));
        this.messages.delete(...messageIds);

        return deleted.length > 0;
    }

    private handleSession(): void {
        this.acks.clear();
        this.promises.forgetAll();
        this.refresh();
    }
}
