import {EventTarget} from "../src/EventTarget";
import {RoomsManager} from "../src/state-tracker/RoomsManager";
import {SpacesManager} from "../src/state-tracker/SpacesManager";
import {UsersManager} from "../src/state-tracker/UsersManager";
import {getPmPeers, isGroupPm, PmParticipantFlag} from "../src";

class FakeClient extends EventTarget {
    public async send(): Promise<{ data: any; error: any }> {
        return { data: undefined, error: null };
    }
}

const IGNORES = PmParticipantFlag.IgnoresRoom;

const createUser = (id: string, overrides: any = {}): any => ({
    id, nick: id, avatar: '', tags: [], status: 1, online: true, ...overrides,
});

const createPm = (id: string, participants: [string, number?][], overrides: any = {}): any => {
    const users = participants.map(([userId]) => createUser(userId));

    return {
        id,
        spaceId: null,
        name: '',
        description: '',
        type: 'Pm',
        defaultTopic: { id: `topic-${id}`, messageCount: 0, lastMessage: null },
        participants: participants.map(([, flags = 0], index) => ({ user: users[index], flags })),
        recipients: users,
        flags: 0,
        stream: null,
        history: { mode: 'Full' },
        ...overrides,
    };
};

const ids = (n: number): [string][] => Array.from({ length: n }, (_, i) => [i === 0 ? 'me' : `u${i}`]);

const createTracker = () => {
    const client = new FakeClient();
    const tracker: any = { client, me: { id: 'me' }, getMe: async () => ({ id: 'me' }) };
    tracker.rooms = new RoomsManager(tracker);
    tracker.spaces = new SpacesManager(tracker);
    tracker.users = new UsersManager(tracker);
    return { client, tracker };
};

const emitSession = (client: FakeClient, rooms: any[]): void => {
    client.emit('Session', { user: createUser('me'), state: { rooms, spaces: [] } } as any);
};

const memberIds = async (tracker: any, roomId: string): Promise<string[]> =>
    (await tracker.rooms.getMembers(roomId)).items.map((member: any) => member.user.id);

describe('helpers', () => {
    test.each([1, 2, 3, 10])('a conversation of %i is a group only from 3 people', count => {
        expect(isGroupPm(createPm('P', ids(count)))).toBe(count >= 3);
    });

    test('a room of a space is never a group conversation', () => {
        expect(isGroupPm({ ...createPm('R', ids(3)), type: 'Text', participants: null })).toBe(false);
        expect(getPmPeers({ ...createPm('R', ids(3)), type: 'Text', participants: null }, 'me')).toEqual([]);
    });

    test('peers are the participants taking part, without me', () => {
        const room = createPm('P', [['me'], ['u1', IGNORES], ['u2'], ['u3']]);

        expect(getPmPeers(room, 'me').map(participant => participant.user.id)).toEqual(['u2', 'u3']);
    });

    test('notes have no peers', () => {
        expect(getPmPeers(createPm('N', [['me']]), 'me')).toEqual([]);
    });
});

describe('members of private conversations', () => {
    test.each([3, 10])('every one of %i participants is a member', async count => {
        const { client, tracker } = createTracker();
        emitSession(client, [createPm('P', ids(count))]);

        expect(await memberIds(tracker, 'P')).toHaveLength(count);
    });

    test('a participant ignoring the conversation is not a member', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createPm('P', [['me'], ['u1', IGNORES], ['u2']])]);

        expect(await memberIds(tracker, 'P')).toEqual(['me', 'u2']);
    });

    test('notes have me as the only member', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createPm('N', [['me']])]);

        expect(await memberIds(tracker, 'N')).toEqual(['me']);
    });

    test('RoomUpdated with changed flags rebuilds the members in place', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createPm('P', [['me'], ['u1'], ['u2']])]);
        const members = await tracker.rooms.getMembers('P');

        client.emit('RoomUpdated', { room: createPm('P', [['me'], ['u1', IGNORES], ['u2']]) });
        expect(members.items.map((member: any) => member.user.id)).toEqual(['me', 'u2']);

        client.emit('RoomUpdated', { room: createPm('P', [['me'], ['u1'], ['u2']]) });
        expect(await tracker.rooms.getMembers('P')).toBe(members);
        expect(members.items.map((member: any) => member.user.id).sort()).toEqual(['me', 'u1', 'u2']);
    });

    test('members survive a reconnect without asking the server', async () => {
        const { client, tracker } = createTracker();
        const send = jest.spyOn(client, 'send');
        emitSession(client, [createPm('P', ids(3))]);
        const members = await tracker.rooms.getMembers('P');

        emitSession(client, [createPm('P', ids(3))]);

        expect(await tracker.rooms.getMembers('P')).toBe(members);
        expect(members.items).toHaveLength(3);
        expect(send).not.toHaveBeenCalled();
    });

    test('members imported from a snapshot survive the first session without asking the server', async () => {
        const { client, tracker } = createTracker();
        const send = jest.spyOn(client, 'send');
        tracker.rooms._importRooms([createPm('P', ids(3))]);

        emitSession(client, [createPm('P', ids(3))]);

        expect(await memberIds(tracker, 'P')).toHaveLength(3);
        expect(send).not.toHaveBeenCalled();
    });

    test('RoomUpdated with a new name replaces the room', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createPm('P', ids(3))]);

        client.emit('RoomUpdated', { room: createPm('P', ids(3), { name: 'Wycieczka' }) });

        expect((await tracker.rooms.get()).get('P').name).toBe('Wycieczka');
    });

    test('RoomUpdated leaves the members whose users did not change untouched', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createPm('P', ids(3))]);
        const members = await tracker.rooms.getMembers('P');
        const before = [...members.items];
        const change = jest.fn();
        members.on('change', change);

        client.emit('RoomUpdated', { room: createPm('P', ids(3), { name: 'Wycieczka' }) });

        members.items.forEach((member: any, index: number) => expect(member).toBe(before[index]));
        expect(change).not.toHaveBeenCalled();
    });

    test('RoomMemberUpdated of a participant ignoring the conversation is skipped', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createPm('P', [['me'], ['u1', IGNORES], ['u2']])]);
        await tracker.rooms.getMembers('P');

        expect(() => client.emit('RoomMemberUpdated', { roomId: 'P', userId: 'u1', member: {} })).not.toThrow();
    });

    test('UserUpdated replaces the user of the participant and of the recipients', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createPm('P', ids(3))]);

        client.emit('UserUpdated', { user: createUser('u2', { nick: 'renamed' }) });
        const room = (await tracker.rooms.get()).get('P');

        expect(room.participants[2].user.nick).toBe('renamed');
        expect(room.recipients[2].nick).toBe('renamed');
        expect(room.participants[1].user.nick).toBe('u1');
    });
});

describe('users of private conversations', () => {
    test('a user taking part in several conversations is reported once', () => {
        const { client, tracker } = createTracker();
        const away = (room: any) => ({
            ...room,
            participants: room.participants.map((participant: any) => ({ ...participant, user: { ...participant.user, status: 2 } })),
        });
        emitSession(client, [createPm('P', ids(3)), createPm('Q', ids(3))]);
        const change = jest.fn();
        tracker.users.onlineStatus.on('change', change);

        emitSession(client, [away(createPm('P', ids(3))), away(createPm('Q', ids(3)))]);

        expect(change.mock.calls.map(([user]) => user.id).sort()).toEqual(['me', 'u1', 'u2']);
    });

    test('participants of joined and ignored conversations are cached', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createPm('P', ids(3))]);
        client.emit('RoomJoined', { room: createPm('Q', [['me'], ['u7']]) });
        client.emit('IgnoredRooms', { rooms: [createPm('R', [['me', IGNORES], ['u8'], ['u9']])] });

        const users = await tracker.users.getAvailable();

        expect(['me', 'u1', 'u2', 'u7', 'u8', 'u9'].every(id => users.has(id))).toBe(true);
    });
});
