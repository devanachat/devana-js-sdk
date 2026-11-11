import {EventTarget} from "../src/EventTarget";
import {TypingManager} from "../src/state-tracker/TypingManager";
import {TYPING_INTERVAL_MS, TYPING_TIMEOUT_MS} from "../src";

class FakeClient extends EventTarget {
    public readonly sent: [string, any][] = [];

    public async send(type: string, data: any): Promise<{ data: any; error: any }> {
        this.sent.push([type, data]);
        return { data: {}, error: null };
    }
}

const createTyping = () => {
    const client = new FakeClient();
    const tracker: any = { client, me: { id: 'me' }, getMe: async () => ({ id: 'me' }) };
    return { client, typing: new TypingManager(tracker) };
};

const typing = (client: FakeClient, userId: string, topicId = 't1', roomId = 'r1') =>
    client.emit('Typing', { location: { roomId, topicId }, userId });

const message = (client: FakeClient, userId: string, topicId = 't1', roomId = 'r1') =>
    client.emit('NewMessage', { message: { location: { roomId, topicId }, author: { user: { id: userId } } } });

const ids = (users: any): string[] => Array.from(users.items.keys());

beforeEach(() => jest.useFakeTimers());
afterEach(() => jest.useRealTimers());

describe('typing users', () => {
    test('only a tracked topic collects typing', () => {
        const { client, typing: manager } = createTyping();
        typing(client, 'u1');

        const users = manager.get('r1', 't1');
        expect(ids(users)).toEqual([]);

        typing(client, 'u1');
        typing(client, 'u2', 't2');
        expect(ids(users)).toEqual(['u1']);
    });

    test('a user expires after the timeout from their last notification', () => {
        const { client, typing: manager } = createTyping();
        const users = manager.get('r1', 't1');

        typing(client, 'u1');
        jest.advanceTimersByTime(TYPING_INTERVAL_MS);
        typing(client, 'u1');
        jest.advanceTimersByTime(TYPING_TIMEOUT_MS - 1);
        expect(ids(users)).toEqual(['u1']);

        jest.advanceTimersByTime(1);
        expect(ids(users)).toEqual([]);
    });

    test('users expire one by one', () => {
        const { client, typing: manager } = createTyping();
        const users = manager.get('r1', 't1');

        typing(client, 'u1');
        jest.advanceTimersByTime(3000);
        typing(client, 'u2');
        jest.advanceTimersByTime(TYPING_TIMEOUT_MS - 3000);
        expect(ids(users)).toEqual(['u2']);

        jest.advanceTimersByTime(3000);
        expect(ids(users)).toEqual([]);
    });

    test('a message of the typing user removes them at once', () => {
        const { client, typing: manager } = createTyping();
        const users = manager.get('r1', 't1');
        typing(client, 'u1');
        typing(client, 'u2');

        message(client, 'u1');

        expect(ids(users)).toEqual(['u2']);
    });

    test('you are never on the list', () => {
        const { client, typing: manager } = createTyping();
        const users = manager.get('r1', 't1');

        typing(client, 'me');

        expect(ids(users)).toEqual([]);
    });

    test('a reconnect, a left room and a deleted topic clear the typing', () => {
        const { client, typing: manager } = createTyping();
        const first = manager.get('r1', 't1');
        const second = manager.get('r2', 't2');
        const third = manager.get('r3', 't3');
        typing(client, 'u1', 't1', 'r1');
        typing(client, 'u1', 't2', 'r2');
        typing(client, 'u1', 't3', 'r3');

        client.emit('RoomLeft', { id: 'r1', reason: 'Leave' });
        client.emit('TopicDeleted', { location: { roomId: 'r2', topicId: 't2' } });
        expect([ids(first), ids(second), ids(third)]).toEqual([[], [], ['u1']]);

        client.emit('Session', {});
        expect(ids(third)).toEqual([]);
    });
});

describe('notifying', () => {
    test('the command is sent at most once per interval for a topic', () => {
        const { client, typing: manager } = createTyping();

        manager.notify('r1', 't1');
        manager.notify('r1', 't1');
        manager.notify('r1', 't2');
        jest.advanceTimersByTime(TYPING_INTERVAL_MS - 1);
        manager.notify('r1', 't1');
        jest.advanceTimersByTime(1);
        manager.notify('r1', 't1');

        expect(client.sent).toEqual([
            ['Type', { location: { roomId: 'r1', topicId: 't1' } }],
            ['Type', { location: { roomId: 'r1', topicId: 't2' } }],
            ['Type', { location: { roomId: 'r1', topicId: 't1' } }],
        ]);
    });

    test('your message lets the next notification through at once', () => {
        const { client, typing: manager } = createTyping();

        manager.notify('r1', 't1');
        message(client, 'me');
        manager.notify('r1', 't1');

        expect(client.sent.length).toBe(2);
    });
});
