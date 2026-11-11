import {ChatStateTracker} from "./ChatStateTracker";
import {IndexedCollection, ObservableIndexedCollection} from "../IndexedObjectCollection";
import {NewMessage, RoomDeleted, RoomLeft, TopicDeleted, Typing} from "../protocol";

export const TYPING_INTERVAL_MS = 5000;
export const TYPING_TIMEOUT_MS = 2 * TYPING_INTERVAL_MS;

/**
 * Ids of the users typing in a topic, each mapped to the time (`Date.now()`) its typing expires at.
 */
export type TypingUsers = ObservableIndexedCollection<string, number>;

interface TrackedTopic {
    roomId: string;
    users: TypingUsers;
    timer?: ReturnType<typeof setTimeout>;
}

export class TypingManager {
    private readonly topics = new IndexedCollection<string, TrackedTopic>();
    private readonly lastSentAt = new Map<string, number>();

    public constructor(private tracker: ChatStateTracker) {
        this.tracker.client.on('Typing', ev => this.handleTyping(ev));
        this.tracker.client.on('NewMessage', ev => this.handleNewMessage(ev));
        this.tracker.client.on('TopicDeleted', ev => this.handleTopicDeleted(ev));
        this.tracker.client.on('RoomLeft', ev => this.handleRoomGone(ev));
        this.tracker.client.on('RoomDeleted', ev => this.handleRoomGone(ev));
        this.tracker.client.on('Session', () => this.handleSession());
    }

    /**
     * Users typing in the topic, without you. Tracking of the topic starts with the first call, so the collection
     * fills up with the next notifications, within {@link TYPING_INTERVAL_MS}. A user leaves it
     * {@link TYPING_TIMEOUT_MS} after their last notification or at once with their message in the topic.
     * Only ids are kept - resolve the users yourself, e.g. from {@link RoomsManager.getMembers}.
     */
    public get(roomId: string, topicId: string): TypingUsers {
        if (!this.topics.has(topicId)) {
            this.topics.set([topicId, {roomId, users: new ObservableIndexedCollection<string, number>()}]);
        }

        return this.topics.get(topicId).users;
    }

    /**
     * Tell the other members of the room that you are typing in the topic. Call it on every change of the text:
     * the command is sent at most once per {@link TYPING_INTERVAL_MS} for a topic, and again right after your
     * message in it. Classic rooms do not support typing.
     */
    public notify(roomId: string, topicId: string): void {
        const now = Date.now();

        if (now - (this.lastSentAt.get(topicId) ?? -Infinity) < TYPING_INTERVAL_MS) {
            return;
        }

        this.lastSentAt.set(topicId, now);
        this.tracker.client.send('Type', {location: {roomId, topicId}}).catch(() => undefined);
    }

    private handleTyping(ev: Typing): void {
        const topic = this.topics.get(ev.location.topicId);

        if (!topic || ev.userId === this.tracker.me?.id) {
            return;
        }

        topic.users.set([ev.userId, Date.now() + TYPING_TIMEOUT_MS]);
        this.scheduleExpiry(topic);
    }

    private handleNewMessage(ev: NewMessage): void {
        const topicId = ev.message.location.topicId;
        const authorId = ev.message.author.user.id;

        if (authorId === this.tracker.me?.id) {
            this.lastSentAt.delete(topicId);
            return;
        }

        const topic = this.topics.get(topicId);

        if (topic?.users.has(authorId)) {
            topic.users.delete(authorId);
            this.scheduleExpiry(topic);
        }
    }

    private handleTopicDeleted(ev: TopicDeleted): void {
        this.clear(ev.location.topicId);
    }

    private handleRoomGone(ev: RoomLeft | RoomDeleted): void {
        for (const [topicId, topic] of this.topics.items.entries()) {
            if (topic.roomId === ev.id) {
                this.clear(topicId);
            }
        }
    }

    private handleSession(): void {
        this.lastSentAt.clear();

        for (const topic of this.topics.items.values()) {
            clearTimeout(topic.timer);
            topic.users.deleteAll();
        }
    }

    private clear(topicId: string): void {
        const topic = this.topics.get(topicId);

        if (topic) {
            clearTimeout(topic.timer);
            topic.users.deleteAll();
        }

        this.lastSentAt.delete(topicId);
    }

    private scheduleExpiry(topic: TrackedTopic): void {
        clearTimeout(topic.timer);
        topic.timer = undefined;

        if (!topic.users.length) {
            return;
        }

        const nextExpiry = Math.min(...topic.users.items.values());
        topic.timer = setTimeout(() => this.expire(topic), Math.max(0, nextExpiry - Date.now()));
    }

    private expire(topic: TrackedTopic): void {
        const now = Date.now();
        const expiredIds: string[] = [];

        for (const [userId, expiresAt] of topic.users.items.entries()) {
            if (expiresAt <= now) {
                expiredIds.push(userId);
            }
        }

        topic.users.delete(...expiredIds);
        this.scheduleExpiry(topic);
    }
}
