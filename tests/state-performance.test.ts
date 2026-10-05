import {EventTarget} from "../src/EventTarget";
import {RoomsManager} from "../src/state-tracker/RoomsManager";
import {SpacesManager} from "../src/state-tracker/SpacesManager";
import {UsersManager} from "../src/state-tracker/UsersManager";
import {PermissionsManager} from "../src/state-tracker/PermissionsManager";
import {WindowState} from "../src/state-tracker/TopicHistoryWindow";

/**
 * Work done per incoming event: what is touched, what reports a change, and what keeps listening.
 */

class FakeClient extends EventTarget {
    public readonly sent: { type: string; data: any }[] = [];
    private readonly responders: Record<string, (data: any) => any> = {};

    public respondTo(type: string, responder: (data: any) => any): void {
        this.responders[type] = responder;
    }

    public async send(type: string, data: any): Promise<{ data: any; error: any }> {
        this.sent.push({ type, data });
        const responder = this.responders[type];
        return { data: responder ? responder(data) : undefined, error: null };
    }

    public listenerCount(eventName: string): number {
        return this.events.get(eventName)?.length ?? 0;
    }
}

const createRoom = (id: string, overrides: any = {}): any => ({
    id,
    spaceId: null,
    name: id,
    description: '',
    type: 'Text',
    defaultTopic: { id: `topic-${id}`, messageCount: 0, lastMessage: null },
    recipients: null,
    flags: 0,
    stream: null,
    history: { mode: 'Full' },
    ...overrides,
});

const createUser = (id: string, overrides: any = {}): any => ({
    id, nick: id, avatar: '', tags: [], status: 1, online: true, ...overrides,
});

const createMessage = (roomId: string, topicId: string, id: string, author: any = createUser('other')): any => ({
    id,
    type: 'Text',
    content: '',
    location: { roomId, topicId },
    author: { user: author },
    reactions: [],
});

const emitSession = (client: FakeClient, rooms: any[], spaces: any[] = []): void => {
    client.emit('Session', {
        serverVersion: '1.0.0',
        protoVersion: '1.0.0',
        user: createUser('me'),
        state: { rooms, spaces },
    } as any);
};

const createTracker = () => {
    const client = new FakeClient();
    const tracker: any = { client, me: { id: 'me' }, getMe: async () => ({ id: 'me' }) };
    tracker.rooms = new RoomsManager(tracker);
    tracker.spaces = new SpacesManager(tracker);
    return { client, tracker };
};

const getWindow = async (tracker: any, roomId: string, topicId: string = `topic-${roomId}`) =>
    (await tracker.rooms.messages.getRoomHistory(roomId)).getMessagesWindow(topicId);

describe('history windows', () => {
    test('a new message is appended in place and reported alone', async () => {
        const { client, tracker } = createTracker();
        client.respondTo('GetMessages', () => ({ messages: [createMessage('A', 'topic-A', 'm1')] }));
        emitSession(client, [createRoom('A'), createRoom('B')]);

        const windowA = await getWindow(tracker, 'A');
        const windowB = await getWindow(tracker, 'B');
        await windowA.resetToLatest();

        const changesA: any[] = [];
        const changesB: any[] = [];
        windowA.on('change', (ev: any) => changesA.push(ev));
        windowB.on('change', (ev: any) => changesB.push(ev));

        client.emit('NewMessage', { message: createMessage('A', 'topic-A', 'm2') });

        expect(windowA.items.map((m: any) => m.id)).toEqual(['m1', 'm2']);
        expect(changesA).toEqual([{ setItems: ['m2'] }]);
        expect(changesB).toEqual([]);
        expect(windowB.length).toBe(0);
    });

    test('a full window drops the oldest messages down to the retained part', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createRoom('A')]);

        const window = await getWindow(tracker, 'A');
        window.liveLimit = null;
        window.limit = 5;
        window.retainRatio = 0.6;

        for (let i = 1; i <= 5; i++) {
            client.emit('NewMessage', { message: createMessage('A', 'topic-A', `m${i}`) });
        }

        const changes: any[] = [];
        window.on('change', (ev: any) => changes.push(ev));
        client.emit('NewMessage', { message: createMessage('A', 'topic-A', 'm6') });

        expect(window.items.map((m: any) => m.id)).toEqual(['m4', 'm5', 'm6']);
        expect(changes).toEqual([{ setItems: ['m6'], deletedItems: ['m1', 'm2', 'm3'] }]);
        expect(window.getAt(0).id).toBe('m4');
        expect(window.getAt(2).id).toBe('m6');
        expect(window.getAt(3)).toBeUndefined();
    });

    test('a window nobody fetched collects only the live limit, unless the room is ephemeral', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createRoom('A'), createRoom('E', { history: { mode: 'Ephemeral' } })]);

        for (let i = 1; i <= 60; i++) {
            client.emit('NewMessage', { message: createMessage('A', 'topic-A', `a${i}`) });
            client.emit('NewMessage', { message: createMessage('E', 'topic-E', `e${i}`) });
        }

        const live = await getWindow(tracker, 'A');
        const ephemeral = await getWindow(tracker, 'E');

        expect(live.state).toBe(WindowState.LIVE);
        expect(live.length).toBe(50);
        expect(live.getAt(live.length - 1).id).toBe('a60');
        expect(ephemeral.length).toBe(60);
    });

    test('a fetched window is not held to the live limit', async () => {
        const { client, tracker } = createTracker();
        client.respondTo('GetMessages', () => ({ messages: [createMessage('A', 'topic-A', 'm0')] }));
        emitSession(client, [createRoom('A')]);

        const window = await getWindow(tracker, 'A');
        await window.resetToLatest();

        for (let i = 1; i <= 60; i++) {
            client.emit('NewMessage', { message: createMessage('A', 'topic-A', `m${i}`) });
        }

        expect(window.length).toBe(61);
    });

    test('lowering the limit drops the oldest messages right away', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createRoom('A')]);

        const window = await getWindow(tracker, 'A');

        for (let i = 1; i <= 10; i++) {
            client.emit('NewMessage', { message: createMessage('A', 'topic-A', `m${i}`) });
        }

        const changes: any[] = [];
        window.on('change', (ev: any) => changes.push(ev));
        window.limit = 1000;
        window.limit = 3;

        expect(window.items.map((m: any) => m.id)).toEqual(['m8', 'm9', 'm10']);
        expect(changes).toEqual([{ deletedItems: ['m1', 'm2', 'm3', 'm4', 'm5', 'm6', 'm7'] }]);
    });

    test('windows of deleted topics and left rooms stop listening', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createRoom('A'), createRoom('B')]);
        await getWindow(tracker, 'A');

        const listeners = client.listenerCount('NewMessage');

        for (let i = 0; i < 20; i++) {
            client.emit('NewTopic', { roomId: 'A', topic: { id: `thread-${i}`, messageCount: 0 } });
            client.emit('TopicDeleted', { location: { roomId: 'A', topicId: `thread-${i}` } });
        }
        client.emit('RoomLeft', { id: 'B' });
        client.emit('RoomJoined', { room: createRoom('C') });

        expect(client.listenerCount('NewMessage')).toBe(listeners);
        expect(client.listenerCount('RoomUpdated')).toBeLessThanOrEqual(listeners);
    });

    test('a thread window receives its own messages only', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createRoom('A')]);
        client.emit('NewTopic', { roomId: 'A', topic: { id: 'thread', messageCount: 0 } });

        const thread = await getWindow(tracker, 'A', 'thread');
        const main = await getWindow(tracker, 'A');

        client.emit('NewMessage', { message: createMessage('A', 'thread', 't1') });

        expect(thread.items.map((m: any) => m.id)).toEqual(['t1']);
        expect(main.length).toBe(0);
    });

    test('own reactions are replaced, not mutated', async () => {
        const { client, tracker } = createTracker();
        client.respondTo('GetMessages', () => ({ messages: [createMessage('A', 'topic-A', 'm1')], myReactions: {} }));
        emitSession(client, [createRoom('A')]);

        const window = await getWindow(tracker, 'A');
        await window.resetToLatest();

        const before = window.myReactions;
        client.emit('Reacted', { messageId: 'm1', reaction: { type: 'Emoji', value: '👍', isAdded: true } });

        expect(before).toEqual({});
        expect(window.myReactions).not.toBe(before);
        expect(window.myReactions.m1).toEqual([{ type: 'Emoji', value: '👍' }]);

        const added = window.myReactions;
        client.emit('Reacted', { messageId: 'm1', reaction: { type: 'Emoji', value: '👍', isAdded: false } });

        expect(added.m1).toHaveLength(1);
        expect(window.myReactions).toEqual({});
    });
});

describe('rooms list', () => {
    test('a message updates the topic, but not the room of a public room', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createRoom('A')]);

        const rooms = await tracker.rooms.get();
        const room = rooms.get('A');
        const roomChanges: any[] = [];
        rooms.on('change', (ev: any) => roomChanges.push(ev));

        client.emit('NewMessage', { message: createMessage('A', 'topic-A', 'm1') });

        const topic = (await tracker.rooms.getTopics('A')).get('topic-A');
        expect(topic.messageCount).toBe(1);
        expect(topic.lastMessage.id).toBe('m1');
        expect(roomChanges).toEqual([]);
        expect(rooms.get('A')).toBe(room);
    });

    test('a private conversation is listed by its last message', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createRoom('P', { type: 'Pm', recipients: [createUser('me'), createUser('other')] })]);

        const rooms = await tracker.rooms.get();
        client.emit('NewMessage', { message: createMessage('P', 'topic-P', 'm1') });

        expect(rooms.get('P').defaultTopic.lastMessage.id).toBe('m1');
    });

    test('an updated user replaces the room members and recipients instead of mutating them', async () => {
        const { client, tracker } = createTracker();
        const spaceMember = { user: createUser('u1'), roles: [], customNick: null, customAvatar: null };
        client.respondTo('GetRoomMembers', (data: any) => ({
            id: data.id,
            members: [{ user: null, spaceMember, roles: [], customNick: null, customColor: null, customAvatar: null, extras: '' }],
        }));
        emitSession(client, [
            createRoom('A'),
            createRoom('P', { type: 'Pm', recipients: [createUser('me'), createUser('u1')] }),
        ]);

        const members = await tracker.rooms.getMembers('A');
        const rooms = await tracker.rooms.get();
        const pm = rooms.get('P');
        const recipients = pm.recipients;

        client.emit('UserUpdated', { user: createUser('u1', { nick: 'renamed' }) });

        expect(spaceMember.user.nick).toBe('u1');
        expect(recipients[1].nick).toBe('u1');
        expect(members.get('u1').spaceMember.user.nick).toBe('renamed');
        expect(rooms.get('P').recipients[1].nick).toBe('renamed');
    });
});

describe('users', () => {
    test('a known, unchanged author does not report a change', async () => {
        const client = new FakeClient();
        const users = new UsersManager({ client } as any);
        const collection = await users.getAvailable();
        const changes: any[] = [];
        collection.on('change', (ev: any) => changes.push(ev));

        client.emit('NewMessage', { message: createMessage('A', 'topic-A', 'm1') });
        client.emit('NewMessage', { message: createMessage('A', 'topic-A', 'm2') });
        client.emit('NewMessage', { message: createMessage('A', 'topic-A', 'm3', createUser('other', { status: 0 })) });
        client.emit('NewMessage', { message: createMessage('A', 'topic-A', 'm4', createUser('other', { status: 0, tags: ['Bot'] })) });

        expect(changes).toEqual([{ setItems: ['other'] }, { setItems: ['other'] }, { setItems: ['other'] }]);
    });
});

describe('permissions', () => {
    test('only overwrites replacing different ones report a change', () => {
        const client = new FakeClient();
        const permissions = new PermissionsManager({ client } as any);
        let changes = 0;
        permissions.on('change', () => changes++);

        const overwrites = (allow: number) => ({ location: { spaceId: 's' }, target: { type: 'Role', roleId: 'r' }, overwrites: { allow, deny: 0 } });

        client.emit('PermissionOverwrites', overwrites(1));
        client.emit('PermissionOverwrites', overwrites(1));
        expect(changes).toBe(0);

        client.emit('PermissionOverwritesUpdated', overwrites(3));
        expect(changes).toBe(1);
    });
});

describe('spaces', () => {
    test('role changes replace the roles and keep the space in line', async () => {
        const { client, tracker } = createTracker();
        const roles = [
            { id: 'r1', name: 'a', priority: 0, color: null, flags: 0 },
            { id: 'r2', name: 'b', priority: 1, color: null, flags: 0 },
        ];
        emitSession(client, [], [{ id: 's', name: 's', roles, defaultRooms: ['A'], systemRoom: 'A' }]);

        const spaces = await tracker.spaces.get();
        const spaceBefore = spaces.get('s');

        client.emit('RoleUpdated', { spaceId: 's', role: { ...roles[1], priority: 0 } });

        expect(roles[0].priority).toBe(0);
        expect((await tracker.spaces.getRoles('s')).get('r1').priority).toBe(1);
        expect(spaces.get('s')).not.toBe(spaceBefore);
        expect(spaces.get('s').roles.find((role: any) => role.id === 'r1').priority).toBe(1);

        client.emit('NewRole', { spaceId: 's', role: { id: 'r3', name: 'c', priority: 2, color: null, flags: 0 } });
        expect(spaces.get('s').roles).toHaveLength(3);
        expect(spaceBefore.roles).toHaveLength(2);
    });
});

describe('event target', () => {
    test('off removes a handler registered with once', () => {
        const target = new EventTarget();
        const handler = jest.fn();

        target.once('x', handler);
        target.off('x', handler);
        target.emit('x', null);

        expect(handler).not.toHaveBeenCalled();
    });
});
