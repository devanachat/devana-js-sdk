import {EventTarget} from "../src/EventTarget";
import {ActivitiesManager} from "../src/state-tracker/ActivitiesManager";
import {Activity} from "../src/protocol";

class FakeClient extends EventTarget {
    public readonly sent: [string, any][] = [];

    public async send(type: string, data: any): Promise<{ data: any; error: any }> {
        this.sent.push([type, data]);
        return { data: {}, error: null };
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

const ack = (client: FakeClient, topicId: string, lastAckMessageId: string) => client.emit('FollowedTopicUpdated', {
    followedTopic: { location: { roomId: 'r1', topicId }, lastAckMessageId, notificationLevel: 'All', missed: 0, isUnread: false, mentionCount: 0 },
});

const createManager = async (initial: Activity[] = [], seenAt: string | null = null) => {
    const client = new FakeClient();
    const manager = new ActivitiesManager({ client } as any);
    const loading = manager.load();
    client.emit('Activities', { seenAt, activities: initial, messages: initial.map(a => ({ id: a.messageId })), users: [] });
    await loading;
    return { client, manager };
};

describe('activities', () => {
    test('counts the activities newer than the seen time', async () => {
        const older = activity();
        const newer = activity();
        const { manager } = await createManager([newer, older], older.createdAt);

        expect(manager.unreadCount).toBe(1);
    });

    test('a reaction joins the unseen activity of its group as the server does', async () => {
        const first = activity({ type: 'Reaction', groupKey: 'R:m1', messageId: 'm1', actorIds: ['u1'] });
        const { client, manager } = await createManager([first]);

        client.emit('NewActivity', { activity: activity({ type: 'Reaction', groupKey: 'R:m1', messageId: 'm1', actorIds: ['u2'] }) });

        expect(manager.activities).toHaveLength(1);
        expect(manager.activities[0]).toMatchObject({ id: first.id, count: 2, actorIds: ['u2', 'u1'] });
    });

    test('an activity of a seen group starts a new one', async () => {
        const first = activity({ type: 'Thread', groupKey: 'T:t1' });
        const { client, manager } = await createManager([first], first.createdAt);

        client.emit('NewActivity', { activity: activity({ type: 'Thread', groupKey: 'T:t1' }) });

        expect(manager.activities).toHaveLength(2);
        expect(manager.activities[0].count).toBe(1);
    });

    test('a live activity without its message asks for a refresh', async () => {
        const { client, manager } = await createManager();

        client.emit('NewActivity', { activity: activity() });

        expect(manager.isIncomplete).toBe(true);
    });

    test('marking as seen sends the time of the newest activity once', async () => {
        const newest = activity();
        const { client, manager } = await createManager([newest]);

        await manager.markSeen();
        await manager.markSeen();

        expect(client.sent.filter(([type]) => type === 'UpdateActivity')).toEqual([['UpdateActivity', { seenAt: newest.createdAt }]]);
        expect(manager.unreadCount).toBe(0);
    });

    test('another session clears the list and deletes an activity', async () => {
        const kept = activity();
        const deleted = activity({ type: 'Custom', messageId: null, title: 'News' });
        const { client, manager } = await createManager([deleted, kept]);

        client.emit('ActivityDeleted', { id: deleted.id });
        expect(manager.activities).toEqual([kept]);

        client.emit('ActivityUpdated', { seenAt: null, cleared: true });
        expect(manager.activities).toEqual([]);
    });

    test('acknowledging the message reads the activity and takes it out of the count', async () => {
        const mention = activity({ messageId: '1ChPoZQhRAdUHRytvAA83c' });
        const { client, manager } = await createManager([mention]);

        ack(client, 't1', '1ChPoZQhRAdUHRytvAA83c');

        expect(manager.activities[0].isRead).toBe(true);
        expect(manager.unreadCount).toBe(0);
    });

    test('an acknowledgement that came first reads the live activity of its message', async () => {
        const { client, manager } = await createManager();

        ack(client, 't1', '1ChPoZQhRAdUHRytvAA83c');
        client.emit('NewActivity', { activity: activity({ messageId: '1ChPoZQhRAdUHRytvAA83b' }) });

        expect(manager.unreadCount).toBe(0);
    });

    test('a reaction stays unread when its message is acknowledged', async () => {
        const reaction = activity({ type: 'Reaction', groupKey: 'R:m1', messageId: '1ChPoZQhRAdUHRytvAA83c' });
        const { client, manager } = await createManager([reaction]);

        ack(client, 't1', '1ChPoZQhRAdUHRytvAA83c');

        expect(manager.unreadCount).toBe(1);
    });

    test('a load that failed before the connection was ready is retried with the session', async () => {
        const client = new FakeClient();
        let fail = true;
        client.send = async (type: string, data: any) => {
            client.sent.push([type, data]);
            return fail ? { data: null, error: new Error('Cannot send - client is not ready') } : { data: {}, error: null };
        };
        const manager = new ActivitiesManager({ client } as any);

        await expect(manager.load()).rejects.toThrow();
        expect(manager.loaded).toBe(false);

        fail = false;
        client.emit('Session', {});
        client.emit('Activities', { seenAt: null, activities: [], messages: [], users: [] });

        expect(client.sent.filter(([type]) => type === 'GetActivities')).toHaveLength(2);
        expect(manager.loaded).toBe(true);
    });

    test('a loaded list is fetched again after a reconnect', async () => {
        const { client } = await createManager();

        client.emit('Session', {});

        expect(client.sent.filter(([type]) => type === 'GetActivities')).toHaveLength(2);
    });
});
