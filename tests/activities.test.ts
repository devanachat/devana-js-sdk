import {EventTarget} from "../src/EventTarget";
import {ActivitiesManager} from "../src/state-tracker/ActivitiesManager";
import {Activity, Message, User} from "../src/protocol";

interface Server {
    seenAt: string | null;
    activities: Activity[];
    messages: Message[];
    users: User[];
    error?: { code: string } | null;
}

class FakeClient extends EventTarget {
    public readonly sent: [string, any][] = [];

    public constructor(public server: Server) {
        super();
    }

    public async send(type: string, data: any): Promise<{ data: any; error: any }> {
        this.sent.push([type, data]);
        await Promise.resolve();

        if (this.server.error) {
            return { data: null, error: this.server.error };
        }

        return {
            data: {
                seenAt: this.server.seenAt,
                activities: this.server.activities,
                messages: data.withMessages ? this.server.messages : [],
                users: data.withMessages ? this.server.users : [],
            },
            error: null,
        };
    }
}

let clock = Date.parse('2026-11-25T12:00:00Z');

const activity = (overrides: Partial<Activity> = {}): Activity => ({
    id: `a${clock}`,
    type: 'Mention',
    groupKey: null,
    location: { roomId: 'r1', topicId: 't1' },
    messageId: `m${clock}`,
    actorIds: ['u1'],
    count: 1,
    createdAt: new Date(clock += 1000).toISOString(),
    title: null,
    description: null,
    link: null,
    isRead: false,
    ...overrides,
});

const message = (id: string, content = 'hello'): Message => ({ id, content } as Message);
const user = (id: string): User => ({ id } as User);

const ack = (client: FakeClient, topicId: string, lastAckMessageId: string) => client.emit('FollowedTopicUpdated', {
    followedTopic: { location: { roomId: 'r1', topicId }, lastAckMessageId, notificationLevel: 'All', missed: 0, isUnread: false, mentionCount: 0 },
});

const createManager = (server: Partial<Server> = {}) => {
    const client = new FakeClient({ seenAt: null, activities: [], messages: [], users: [], ...server });
    const manager = new ActivitiesManager({ client } as any);
    return { client, manager };
};

const fetches = (client: FakeClient) => client.sent.filter(([type]) => type === 'GetActivities').map(([, data]) => data);

describe('activities', () => {
    test('the list is fetched once, without messages, and keeps the seen time', async () => {
        const seen = activity();
        const { client, manager } = createManager({ activities: [seen], seenAt: seen.createdAt });

        const activities = await manager.get();

        expect(await manager.get()).toBe(activities);
        expect(activities.items).toEqual([seen]);
        expect(manager.seenAt).toBe(seen.createdAt);
        expect(fetches(client)).toEqual([{ withMessages: false }]);
    });

    test('messages and users come with one request together with the list', async () => {
        const mention = activity();
        const { client, manager } = createManager({
            activities: [mention], messages: [message(mention.messageId!)], users: [user('u1')],
        });

        const activities = await manager.get(true);

        expect(activities.items).toEqual([mention]);
        expect((await manager.getMessages()).has(mention.messageId)).toBe(true);
        expect((await manager.getUsers()).has('u1')).toBe(true);
        expect(fetches(client)).toEqual([{ withMessages: true }]);
    });

    test('a live activity brings its message and actor', async () => {
        const { client, manager } = createManager();
        const messages = await manager.getMessages();
        const users = await manager.getUsers();
        const live = activity({ actorIds: ['u2'] });

        client.emit('NewActivity', { activity: live, message: message(live.messageId!), users: [user('u2')] });

        expect((await manager.get()).has(live.id)).toBe(true);
        expect(messages.has(live.messageId)).toBe(true);
        expect(users.has('u2')).toBe(true);
    });

    test('a reaction joins the unseen activity of its group as the server does', async () => {
        const first = activity({ type: 'Reaction', groupKey: 'R:m1', messageId: 'm1', actorIds: ['u1'] });
        const { client, manager } = createManager({ activities: [first] });
        const activities = await manager.get();

        client.emit('NewActivity', { activity: activity({ type: 'Reaction', groupKey: 'R:m1', messageId: 'm1', actorIds: ['u2'] }), message: null, users: [] });

        expect(activities.items).toHaveLength(1);
        expect(activities.get(first.id)).toMatchObject({ count: 2, actorIds: ['u2', 'u1'] });
    });

    test('an activity of a seen group starts a new one', async () => {
        const first = activity({ type: 'Thread', groupKey: 'T:t1' });
        const { client, manager } = createManager({ activities: [first], seenAt: first.createdAt });
        const activities = await manager.get();

        client.emit('NewActivity', { activity: activity({ type: 'Thread', groupKey: 'T:t1' }), message: null, users: [] });

        expect(activities.items).toHaveLength(2);
    });

    test('the list keeps the newest activities', async () => {
        const initial = Array.from({ length: 20 }, () => activity());
        const { client, manager } = createManager({ activities: initial });
        const activities = await manager.get();

        client.emit('NewActivity', { activity: activity(), message: null, users: [] });

        expect(activities.items).toHaveLength(20);
        expect(activities.has(initial[0].id)).toBe(false);
    });

    test('another session marks the list seen, clears it and deletes an activity', async () => {
        const kept = activity();
        const deleted = activity({ type: 'Custom', messageId: null, location: null, title: 'News' });
        const { client, manager } = createManager({ activities: [deleted, kept] });
        const activities = await manager.get();
        const seenChanges: string[] = [];
        manager.on('seenAtChange', () => seenChanges.push(manager.seenAt!));

        client.emit('ActivityDeleted', { id: deleted.id });
        expect(activities.items).toEqual([kept]);

        client.emit('ActivityUpdated', { seenAt: kept.createdAt, cleared: false });
        expect(seenChanges).toEqual([kept.createdAt]);

        client.emit('ActivityUpdated', { seenAt: null, cleared: true });
        expect(activities.items).toEqual([]);
    });

    test('acknowledging the message reads the activity', async () => {
        const mention = activity({ messageId: '1ChPoZQhRAdUHRytvAA83c' });
        const { client, manager } = createManager({ activities: [mention] });
        const activities = await manager.get();

        ack(client, 't1', '1ChPoZQhRAdUHRytvAA83c');

        expect(activities.get(mention.id)!.isRead).toBe(true);
    });

    test('an acknowledgement that came first reads the live activity of its message', async () => {
        const { client, manager } = createManager();
        const activities = await manager.get();
        const live = activity({ messageId: '1ChPoZQhRAdUHRytvAA83b' });

        ack(client, 't1', '1ChPoZQhRAdUHRytvAA83c');
        client.emit('NewActivity', { activity: live, message: null, users: [] });

        expect(activities.get(live.id)!.isRead).toBe(true);
    });

    test('a reaction stays unread when its message is acknowledged', async () => {
        const reaction = activity({ type: 'Reaction', groupKey: 'R:m1', messageId: '1ChPoZQhRAdUHRytvAA83c' });
        const { client, manager } = createManager({ activities: [reaction] });
        const activities = await manager.get();

        ack(client, 't1', '1ChPoZQhRAdUHRytvAA83c');

        expect(activities.get(reaction.id)!.isRead).toBe(false);
    });

    test('a deleted message takes its activity along', async () => {
        const mention = activity();
        const { client, manager } = createManager({ activities: [mention], messages: [message(mention.messageId!)] });
        const activities = await manager.get(true);
        const messages = await manager.getMessages();

        client.emit('MessagesRedacted', { location: mention.location, ids: [mention.messageId] });

        expect(activities.items).toEqual([]);
        expect(messages.items).toEqual([]);
    });

    test('leaving a room hides its activities and rejoining fetches them again', async () => {
        const mention = activity();
        const { client, manager } = createManager({ activities: [mention] });
        const activities = await manager.get();

        client.emit('RoomLeft', { id: 'r1' });
        expect(activities.items).toEqual([]);

        client.emit('RoomJoined', { room: { id: 'r1' } });
        await new Promise(resolve => setTimeout(resolve, 0));
        await manager.get();

        expect(activities.items).toEqual([mention]);
    });

    test('a fetch that failed before the connection was ready is repeated with the session', async () => {
        const mention = activity();
        const { client, manager } = createManager({ activities: [mention], error: { code: 'NotReady' } });

        await expect(manager.get()).rejects.toEqual({ code: 'NotReady' });

        client.server.error = null;
        client.emit('Session', {});

        expect((await manager.get()).items).toEqual([mention]);
    });

    test('a reconnect fetches again what was fetched, with one request', async () => {
        const { client, manager } = createManager();
        await manager.get(true);

        client.emit('Session', {});
        await manager.get();

        expect(fetches(client)).toEqual([{ withMessages: true }, { withMessages: true }]);
    });
});
