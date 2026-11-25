import {EventTarget} from "../EventTarget";
import {
    Activities,
    Activity,
    ActivityDeleted,
    ActivityUpdated,
    FollowedTopicUpdated,
    Message,
    NewActivity,
    User,
} from "../protocol";
import {PromiseRegistry} from "./AsyncUtils";
import {ChatStateTracker} from "./ChatStateTracker";

// Mirror the server, so a live activity joins its group as the stored one did
const VISIBLE_LIMIT = 20;
const GROUP_SCAN = 5;
const MAX_ACTORS = 3;

interface EventMap {
    change: {};
}

const time = (isoDate: string | null): number => isoDate ? Date.parse(isoDate) : 0;

// A reaction is to one's own message, so acknowledging it says nothing about the reaction
const isReadWithAck = (activity: Activity): boolean => activity.type !== 'Reaction' && activity.type !== 'Custom';

// Message ids are time-ordered and their base58 form has a fixed length, so they compare as strings
const isAcknowledged = (activity: Activity, topicId: string, lastAckMessageId: string): boolean =>
    isReadWithAck(activity)
    && activity.location?.topicId === topicId
    && activity.messageId !== null
    && activity.messageId <= lastAckMessageId;

export class ActivitiesManager extends EventTarget<EventMap> {
    private list: Activity[] = [];
    private readonly messages = new Map<string, Message>();
    private readonly users = new Map<string, User>();
    private seen: string | null = null;
    private incomplete = false;
    private readonly promises = new PromiseRegistry();
    private readonly acks = new Map<string, string>();
    private wanted = false;
    private received = false;

    public constructor(private tracker: ChatStateTracker) {
        super();

        this.tracker.client.on('Activities', ev => this.handleActivities(ev));
        this.tracker.client.on('NewActivity', ev => this.handleNewActivity(ev));
        this.tracker.client.on('ActivityUpdated', ev => this.handleActivityUpdated(ev));
        this.tracker.client.on('ActivityDeleted', ev => this.handleActivityDeleted(ev));
        this.tracker.client.on('FollowedTopicUpdated', ev => this.handleFollowedTopicUpdated(ev));
        this.tracker.client.on('Session', () => this.handleSession());
    }

    /**
     * Fetches the activities the first time; afterwards they change with the events of the server.
     * A loaded list is fetched again after every reconnect, as events are missed while disconnected.
     */
    public async load(): Promise<void> {
        this.wanted = true;

        if (this.promises.notExist('all')) {
            this.promises.registerByFunction(() => this.fetch(), 'all');
        }

        await this.promises.get('all');
    }

    /**
     * Fetches the activities again - needed when {@link isIncomplete}, as an activity that arrives live does not carry
     * the message it points at.
     */
    public async refresh(): Promise<void> {
        this.promises.register(this.fetch(), 'all');
        await this.promises.get('all');
    }

    /**
     * Newest first. A new array after every change.
     */
    public get activities(): Activity[] {
        return this.list;
    }

    public get seenAt(): string | null {
        return this.seen;
    }

    /**
     * Activities newer than {@link seenAt} whose message is not acknowledged yet (see {@link Activity.isRead}).
     */
    public get unreadCount(): number {
        const seen = time(this.seen);
        return this.list.filter(activity => !activity.isRead && time(activity.createdAt) > seen).length;
    }

    /**
     * True when an activity arrived without the message it points at; {@link refresh} brings it.
     */
    public get isIncomplete(): boolean {
        return this.incomplete;
    }

    /**
     * True once the list has arrived; until then {@link activities} is empty because it is not known yet.
     */
    public get loaded(): boolean {
        return this.received;
    }

    public getMessage(messageId: string): Message | undefined {
        return this.messages.get(messageId);
    }

    public getUser(userId: string): User | undefined {
        return this.users.get(userId);
    }

    /**
     * Marks everything shown as seen, on every device of the user. Nothing is sent when nothing is new.
     */
    public async markSeen(): Promise<void> {
        const newest = this.list[0]?.createdAt ?? null;

        if (!newest || time(newest) <= time(this.seen)) {
            return;
        }

        this.seen = newest;
        this.emit('change', {});

        const result = await this.tracker.client.send('UpdateActivity', {seenAt: newest});
        if (result.error) {
            throw result.error;
        }
    }

    /**
     * Empties the list on every device of the user.
     */
    public async clear(): Promise<void> {
        const result = await this.tracker.client.send('UpdateActivity', {clear: true});
        if (result.error) {
            throw result.error;
        }
    }

    private async fetch(): Promise<void> {
        const result = await this.tracker.client.send('GetActivities', {});
        if (result.error) {
            throw result.error;
        }
    }

    private handleActivities(ev: Activities): void {
        this.received = true;
        this.list = ev.activities;
        this.seen = ev.seenAt;
        this.incomplete = false;
        this.messages.clear();
        this.users.clear();

        for (const message of ev.messages) {
            this.messages.set(message.id, message);
        }
        for (const user of ev.users) {
            this.users.set(user.id, user);
        }

        this.emit('change', {});
    }

    private handleNewActivity(ev: NewActivity): void {
        if (!this.loaded) {
            return;
        }

        const topicId = ev.activity.location?.topicId ?? '';
        const lastAck = this.acks.get(topicId);
        const added = lastAck && isAcknowledged(ev.activity, topicId, lastAck)
            ? {...ev.activity, isRead: true}
            : ev.activity;
        const seen = time(this.seen);
        const groupIndex = added.groupKey === null ? -1 : this.list
            .slice(0, GROUP_SCAN)
            .findIndex(activity => activity.groupKey === added.groupKey);
        const group = groupIndex === -1 ? null : this.list[groupIndex];
        const rest = this.list.slice();

        if (group && time(group.createdAt) > seen) {
            rest.splice(groupIndex, 1);
            this.list = [{
                ...added,
                id: group.id,
                count: group.count + 1,
                actorIds: [...new Set([...added.actorIds, ...group.actorIds])].slice(0, MAX_ACTORS),
            }, ...rest];
        } else {
            this.list = [added, ...rest].slice(0, VISIBLE_LIMIT);
        }

        if (added.messageId && !this.messages.has(added.messageId)) {
            this.incomplete = true;
        }

        this.emit('change', {});
    }

    private handleActivityUpdated(ev: ActivityUpdated): void {
        if (time(ev.seenAt) > time(this.seen)) {
            this.seen = ev.seenAt;
        }
        if (ev.cleared) {
            this.list = [];
        }

        this.emit('change', {});
    }

    private handleActivityDeleted(ev: ActivityDeleted): void {
        const list = this.list.filter(activity => activity.id !== ev.id);

        if (list.length !== this.list.length) {
            this.list = list;
            this.emit('change', {});
        }
    }

    private handleFollowedTopicUpdated(ev: FollowedTopicUpdated): void {
        const {location, lastAckMessageId} = ev.followedTopic;

        if (!location.topicId || !lastAckMessageId) {
            return;
        }

        // An acknowledgement may come before the activity of the same message
        this.acks.set(location.topicId, lastAckMessageId);

        let changed = false;
        const list = this.list.map(activity => {
            if (activity.isRead || !isAcknowledged(activity, location.topicId, lastAckMessageId)) {
                return activity;
            }

            changed = true;
            return {...activity, isRead: true};
        });

        if (changed) {
            this.list = list;
            this.emit('change', {});
        }
    }

    private handleSession(): void {
        this.acks.clear();

        // Also after a load that failed, e.g. one asked for before the connection was ready
        if (!this.wanted) {
            return;
        }

        this.promises.forgetAll();
        this.load().catch(() => {});
    }
}
