import {EventTarget} from "../src/EventTarget";
import {RoomsManager} from "../src/state-tracker/RoomsManager";
import {SpacesManager} from "../src/state-tracker/SpacesManager";
import {WindowState} from "../src/state-tracker/TopicHistoryWindow";

/**
 * These tests exercise the reconnect (second `Session`) reconciliation path of
 * the state tracker: collections must keep their identity, surviving rooms and
 * spaces must not be wiped and rebuilt, ephemeral message history must be
 * preserved, and only the entities actually removed on the server may be
 * dropped. See ChatStateTracker managers `handleSession`.
 */

type Responder = (data: any) => any;

class FakeClient extends EventTarget {
    public readonly sent: { type: string; data: any }[] = [];
    /**
     * When set, commands reject the way the real client rejects them once the
     * connection is gone, instead of hanging forever.
     */
    public offline = false;
    private readonly responders: Record<string, Responder> = {};

    public respondTo(type: string, responder: Responder): void {
        this.responders[type] = responder;
    }

    public async send(type: string, data: any): Promise<{ data: any; error: any }> {
        this.sent.push({ type, data });

        if (this.offline) {
            throw new Error('Connection closed before the command was answered');
        }

        const responder = this.responders[type];
        return { data: responder ? responder(data) : undefined, error: null };
    }

    public countSent(type: string): number {
        return this.sent.filter(entry => entry.type === type).length;
    }
}

const flush = async (): Promise<void> => {
    // Drain microtasks scheduled by the fire-and-forget resync chain.
    await new Promise(resolve => setTimeout(resolve, 0));
    await new Promise(resolve => setTimeout(resolve, 0));
};

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

const createSpace = (id: string, roles: any[] = []): any => ({
    id,
    name: id,
    roles,
    defaultRooms: [],
    systemRoom: null,
});

const emitSession = (client: FakeClient, rooms: any[], spaces: any[] = []): void => {
    client.emit('Session', {
        serverVersion: '1.0.0',
        protoVersion: '1.0.0',
        user: { id: 'me' },
        state: { rooms, spaces },
    } as any);
};

const createTracker = () => {
    const client = new FakeClient();
    const tracker: any = { client, getMe: async () => ({ id: 'me' }) };
    tracker.rooms = new RoomsManager(tracker);
    tracker.spaces = new SpacesManager(tracker);
    return { client, tracker };
};

describe('reconnect - RoomsManager', () => {
    test('preserves the rooms list identity and reconciles membership', async () => {
        const { client, tracker } = createTracker();

        emitSession(client, [createRoom('A'), createRoom('B')]);
        const list = await tracker.rooms.get();

        expect(list.items.map((r: any) => r.id).sort()).toEqual(['A', 'B']);

        // Reconnect: B is gone, C joined, A survived (renamed).
        emitSession(client, [createRoom('A', { name: 'A-renamed' }), createRoom('C')]);
        const listAfter = await tracker.rooms.get();

        expect(listAfter).toBe(list); // same object -> bindings intact
        expect(listAfter.items.map((r: any) => r.id).sort()).toEqual(['A', 'C']);
        expect(listAfter.get('A').name).toBe('A-renamed');
        expect(listAfter.get('B')).toBeUndefined();
    });

    test('keeps a member collection object across reconnect and refetches it', async () => {
        const { client, tracker } = createTracker();
        client.respondTo('GetRoomMembers', (data: any) => ({
            id: data.id,
            members: [
                { user: { id: 'me' }, spaceMember: null, roles: null, customColor: null, customNick: null, extras: '' },
                { user: { id: 'u1' }, spaceMember: null, roles: null, customColor: null, customNick: null, extras: '' },
            ],
        }));

        emitSession(client, [createRoom('A')]);
        const membersBefore = await tracker.rooms.getMembers('A');
        expect(membersBefore.items.map((m: any) => m.user.id).sort()).toEqual(['me', 'u1']);
        expect(client.countSent('GetRoomMembers')).toBe(1);

        // After reconnect u1 has left; the refetch must reconcile in place.
        client.respondTo('GetRoomMembers', (data: any) => ({
            id: data.id,
            members: [
                { user: { id: 'me' }, spaceMember: null, roles: null, customColor: null, customNick: null, extras: '' },
            ],
        }));

        emitSession(client, [createRoom('A')]);
        const membersAfter = await tracker.rooms.getMembers('A');

        expect(membersAfter).toBe(membersBefore); // same object -> no blank
        expect(client.countSent('GetRoomMembers')).toBe(2); // guard was dropped -> refetched
        expect(membersAfter.items.map((m: any) => m.user.id)).toEqual(['me']);
    });
});

describe('reconnect - MessagesManager', () => {
    const emitNewMessage = (client: FakeClient, roomId: string, topicId: string, id: string): void => {
        client.emit('NewMessage', {
            message: {
                id,
                type: 'Text',
                content: '',
                location: { roomId, topicId },
                author: { user: { id: 'other' } },
            },
        } as any);
    };

    test('preserves ephemeral live history across reconnect (no refetch, no loss)', async () => {
        const { client, tracker } = createTracker();

        emitSession(client, [createRoom('E', { history: { mode: 'Ephemeral' } })]);

        const history = await tracker.rooms.messages.getRoomHistory('E');
        const window = await history.getMessagesWindow('topic-E');
        expect(window.state).toBe(WindowState.LIVE);

        emitNewMessage(client, 'E', 'topic-E', 'm1');
        emitNewMessage(client, 'E', 'topic-E', 'm2');
        expect(window.items.map((m: any) => m.id)).toEqual(['m1', 'm2']);

        client.sent.length = 0;

        // Reconnect - the whole point: ephemeral context must survive.
        emitSession(client, [createRoom('E', { history: { mode: 'Ephemeral' } })]);
        await flush();

        const historyAfter = await tracker.rooms.messages.getRoomHistory('E');
        const windowAfter = await historyAfter.getMessagesWindow('topic-E');

        expect(historyAfter).toBe(history); // history object preserved
        expect(windowAfter).toBe(window);   // window object preserved
        expect(windowAfter.items.map((m: any) => m.id)).toEqual(['m1', 'm2']);
        expect(client.countSent('GetMessages')).toBe(0); // never refetched
    });

    test('refreshes a LATEST window but leaves an untouched LIVE window alone', async () => {
        const { client, tracker } = createTracker();
        client.respondTo('GetMessages', () => ({ messages: [{ id: 'x1' }, { id: 'x2' }] }));

        // R was opened (pulled to LATEST); L was only ever created (LIVE).
        emitSession(client, [createRoom('R'), createRoom('L')]);

        const rHistory = await tracker.rooms.messages.getRoomHistory('R');
        const rWindow = await rHistory.getMessagesWindow('topic-R');
        await rWindow.resetToLatest();
        expect(rWindow.state).toBe(WindowState.LATEST);

        const lHistory = await tracker.rooms.messages.getRoomHistory('L');
        const lWindow = await lHistory.getMessagesWindow('topic-L');
        expect(lWindow.state).toBe(WindowState.LIVE);

        client.sent.length = 0;

        emitSession(client, [createRoom('R'), createRoom('L')]);
        await flush();

        // LATEST window was refreshed with exactly one request; identity kept.
        expect((await tracker.rooms.messages.getRoomHistory('R'))).toBe(rHistory);
        expect(client.sent.filter(e => e.type === 'GetMessages'
            && e.data.location.roomId === 'R').length).toBe(1);
        // LIVE window (never pulled by the app) was left untouched.
        expect(client.sent.filter(e => e.type === 'GetMessages'
            && e.data.location.roomId === 'L').length).toBe(0);
    });
});

describe('reconnect - SpacesManager', () => {
    test('reconciles roles in place and drops only removed spaces', async () => {
        const { client, tracker } = createTracker();

        const s1Roles = [
            { id: 'r1', name: 'everyone', priority: 0, color: '#fff' },
            { id: 'r2', name: 'mod', priority: 1, color: '#fff' },
        ];
        emitSession(client, [], [createSpace('S1', s1Roles), createSpace('S2')]);

        const spaces = await tracker.spaces.get();
        const rolesS1 = await tracker.spaces.getRoles('S1');
        expect(spaces.items.map((s: any) => s.id).sort()).toEqual(['S1', 'S2']);
        expect(rolesS1.items.map((r: any) => r.id).sort()).toEqual(['r1', 'r2']);

        // Reconnect: S2 removed, S3 joined; S1 roles changed (r2 removed, r3 added).
        const s1RolesNew = [
            { id: 'r1', name: 'everyone', priority: 0, color: '#fff' },
            { id: 'r3', name: 'vip', priority: 2, color: '#fff' },
        ];
        emitSession(client, [], [createSpace('S1', s1RolesNew), createSpace('S3')]);

        const spacesAfter = await tracker.spaces.get();
        const rolesS1After = await tracker.spaces.getRoles('S1');

        expect(spacesAfter).toBe(spaces);
        expect(spacesAfter.items.map((s: any) => s.id).sort()).toEqual(['S1', 'S3']);
        expect(rolesS1After).toBe(rolesS1); // roles collection identity preserved
        expect(rolesS1After.items.map((r: any) => r.id).sort()).toEqual(['r1', 'r3']);
    });

    test('keeps a space member collection across reconnect and refetches it', async () => {
        const { client, tracker } = createTracker();
        client.respondTo('GetSpaceMembers', (data: any) => ({
            id: data.id,
            members: [{ user: { id: 'me' } }, { user: { id: 'u1' } }],
        }));

        emitSession(client, [], [createSpace('S1')]);
        const membersBefore = await tracker.spaces.getMembers('S1');
        expect(client.countSent('GetSpaceMembers')).toBe(1);

        client.respondTo('GetSpaceMembers', (data: any) => ({
            id: data.id,
            members: [{ user: { id: 'me' } }],
        }));

        emitSession(client, [], [createSpace('S1')]);
        const membersAfter = await tracker.spaces.getMembers('S1');

        expect(membersAfter).toBe(membersBefore);
        expect(client.countSent('GetSpaceMembers')).toBe(2);
        expect(membersAfter.items.map((m: any) => m.user.id)).toEqual(['me']);
    });
});

describe('recovery after a request issued while the client was offline', () => {
    const member = (id: string): any => ({
        user: { id }, spaceMember: null, roles: null, customColor: null, customNick: null, extras: '',
    });

    test('room member list fills in on the next access instead of staying empty', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createRoom('A')]);

        // Opening the room while offline: the command rejects (it must never
        // hang) and the caller sees the failure.
        client.offline = true;
        await expect(tracker.rooms.getMembers('A')).rejects.toThrow('Connection closed');

        // The failed lookup must not be cached - otherwise every later access
        // would replay the same rejection and the list would stay empty for the
        // rest of the session, even after a successful reconnect.
        client.offline = false;
        client.respondTo('GetRoomMembers', (data: any) => ({
            id: data.id,
            members: [member('me'), member('u1')],
        }));

        const members = await tracker.rooms.getMembers('A');

        expect(members.items.map((m: any) => m.user.id).sort()).toEqual(['me', 'u1']);
    });

    test('a lazy space collection recovers the same way', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [], [createSpace('S1')]);

        client.offline = true;
        await expect(tracker.spaces.getRooms('S1')).rejects.toThrow('Connection closed');

        client.offline = false;
        client.respondTo('GetSpaceRooms', (data: any) => ({
            id: data.id,
            summaries: [{ id: 'R1', name: 'R1', description: '' }],
        }));

        const rooms = await tracker.spaces.getRooms('S1');

        expect(rooms.items.map((r: any) => r.id)).toEqual(['R1']);
    });

    test('a reconnect refetch reconciles a list that changed while offline', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createRoom('A')]);

        client.respondTo('GetRoomMembers', (data: any) => ({
            id: data.id,
            members: [member('me'), member('u1'), member('u2')],
        }));
        const members = await tracker.rooms.getMembers('A');
        expect(members.length).toBe(3);

        // While disconnected u1 left and u3 joined.
        client.respondTo('GetRoomMembers', (data: any) => ({
            id: data.id,
            members: [member('me'), member('u2'), member('u3')],
        }));
        emitSession(client, [createRoom('A')]);

        const refreshed = await tracker.rooms.getMembers('A');

        // Same object (bindings intact) reconciled to the fresh membership.
        expect(refreshed).toBe(members);
        expect(refreshed.items.map((m: any) => m.user.id).sort()).toEqual(['me', 'u2', 'u3']);
    });
});
