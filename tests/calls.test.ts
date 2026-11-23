import {EventTarget} from "../src/EventTarget";
import {CallsManager} from "../src/state-tracker/CallsManager";

class FakeClient extends EventTarget {
    public readonly sent: [string, any][] = [];
    public response: { data: any; error: any } = { data: {}, error: null };

    public async send(type: string, data: any): Promise<{ data: any; error: any }> {
        this.sent.push([type, data]);
        return this.response;
    }
}

const createCalls = () => {
    const client = new FakeClient();
    const leftRoomIds = new Set<string>();
    const rooms = { _getRoom: (id: string) => (leftRoomIds.has(id) ? undefined : { id }) };
    const tracker: any = { client, rooms, me: { id: 'me' }, getMe: async () => ({ id: 'me' }) };
    return { client, calls: new CallsManager(tracker), leftRoomIds };
};

const member = (id: string, handRaisedAt: string | null = null): any => ({
    user: { id },
    joinedAt: '2026-11-16T14:32:00Z',
    flags: 0,
    handRaisedAt,
});

const call = (roomId: string, spaceId: string | null = null, memberIds: string[] = ['u1']): any => ({
    location: { spaceId, roomId, topicId: `${roomId}-topic` },
    messageId: `${roomId}-message`,
    startedAt: '2026-11-16T14:32:00Z',
    members: memberIds.map(id => member(id)),
});

const memberIds = (call: any): string[] => call.members.map((item: any) => item.user.id);

const incoming = (roomId: string, spaceId: string | null = null): any => ({
    call: call(roomId, spaceId),
    caller: { id: 'u1' },
});

const session = (client: FakeClient, calls: any[] = [], incomingCalls: any[] = []) =>
    client.emit('Session', { user: { id: 'me' }, state: { spaces: [], rooms: [], calls, incomingCalls } });

const ringing = (client: FakeClient, roomId: string, spaceId: string | null = null) =>
    client.emit('IncomingCallUpdated', { roomId, incomingCall: incoming(roomId, spaceId) });

const roomIds = (collection: any): string[] =>
    collection.items.map((item: any) => (item.location ?? item.call.location).roomId);

describe('ongoing calls', () => {
    test('are seeded from the session and replaced by the next one', async () => {
        const { client, calls } = createCalls();
        session(client, [call('r1'), call('r2')]);
        const list = await calls.get();
        expect(roomIds(list)).toEqual(['r1', 'r2']);

        const changes: any[] = [];
        list.on('change', ev => changes.push(ev));
        session(client, [call('r2', null, ['u1', 'u2']), call('r3')]);

        expect(roomIds(list)).toEqual(['r2', 'r3']);
        expect(list.get('r2').members).toHaveLength(2);
        expect(changes).toEqual([{ setItems: ['r2', 'r3'], deletedItems: ['r1'] }]);
    });

    test('follow CallUpdated', async () => {
        const { client, calls, leftRoomIds } = createCalls();
        const list = await calls.get();

        client.emit('CallUpdated', { roomId: 'r1', call: call('r1') });
        client.emit('CallUpdated', { roomId: 'r1', call: call('r1', null, ['u1', 'me']) });
        expect(memberIds(list.get('r1'))).toEqual(['u1', 'me']);

        client.emit('CallUpdated', { roomId: 'r1', call: null });
        expect(list.has('r1')).toBe(false);

        leftRoomIds.add('r2');
        client.emit('CallUpdated', { roomId: 'r2', call: call('r2') });
        expect(list.has('r2')).toBe(false);
    });

    test('apply member deltas by replacing the call', async () => {
        const { client, calls } = createCalls();
        session(client, [call('r1', null, ['u1', 'u2'])]);
        const list = await calls.get();
        const before = list.get('r1');

        client.emit('CallMemberJoined', { roomId: 'r1', member: member('u3') });
        client.emit('CallMemberUpdated', { roomId: 'r1', userId: 'u1', member: { ...member('u1'), flags: 4 } });
        client.emit('CallMemberLeft', { roomId: 'r1', userId: 'u2' });
        client.emit('CallMemberJoined', { roomId: 'r9', member: member('u3') });

        const after = list.get('r1');
        expect(memberIds(after)).toEqual(['u1', 'u3']);
        expect(after.members[0].flags).toBe(4);
        expect(memberIds(before)).toEqual(['u1', 'u2']);
        expect(before.members[0].flags).toBe(0);
        expect(list.has('r9')).toBe(false);
    });

    test('queue members by the time they raised the hand', () => {
        const { calls } = createCalls();
        const queued = {
            ...call('r1'),
            members: [
                member('u1', '2026-11-16T14:35:00+00:00'),
                member('u2'),
                member('2', '2026-11-16T14:33:00+00:00'),
                member('10', '2026-11-16T14:33:00+00:00'),
            ],
        };

        expect(calls.getQueue(queued).map(item => item.user.id)).toEqual(['10', '2', 'u1']);
        expect(memberIds(queued)).toEqual(['u1', 'u2', '2', '10']);
    });

    test('are dropped with their room or space', async () => {
        const { client, calls } = createCalls();
        session(client, [call('r1', 's1'), call('r2', 's1'), call('r3', 's2'), call('r4')]);
        const list = await calls.get();

        client.emit('RoomLeft', { id: 'r4', reason: 'Leave' });
        client.emit('SpaceLeft', { id: 's1', reason: 'Leave' });
        expect(roomIds(list)).toEqual(['r3']);

        client.emit('RoomDeleted', { id: 'r3' });
        expect(list.length).toBe(0);
    });
});

describe('ringing calls', () => {
    test('follow IncomingCallUpdated and stop with the call', async () => {
        const { client, calls } = createCalls();
        const list = await calls.getRinging();

        ringing(client, 'r1');
        ringing(client, 'r2');
        ringing(client, 'r3');
        expect(list.get('r1').caller.id).toBe('u1');

        client.emit('IncomingCallUpdated', { roomId: 'r1', incomingCall: null });
        client.emit('CallUpdated', { roomId: 'r3', call: null });
        expect(roomIds(list)).toEqual(['r2']);
    });

    test('are replaced by the session and cleared with their room or space', async () => {
        const { client, calls } = createCalls();
        const list = await calls.getRinging();

        ringing(client, 'r1');
        ringing(client, 'r2', 's1');
        session(client, [call('r2', 's1'), call('r3')], [incoming('r3')]);
        expect(roomIds(list)).toEqual(['r3']);

        session(client, [call('r2', 's1')]);
        expect(list.length).toBe(0);

        ringing(client, 'r1');
        ringing(client, 'r2', 's1');
        client.emit('RoomDeleted', { id: 'r1' });
        client.emit('SpaceDeleted', { id: 's1' });
        expect(list.length).toBe(0);
    });

    test('are cleared with their space when their call is not tracked', async () => {
        const { client, calls } = createCalls();
        const list = await calls.getRinging();

        ringing(client, 'r1', 's1');
        ringing(client, 'r2', 's2');
        client.emit('SpaceLeft', { id: 's1', reason: 'Leave' });

        expect(roomIds(list)).toEqual(['r2']);
    });

    test('follow the changes of their call with new objects', async () => {
        const { client, calls } = createCalls();
        session(client, [call('r1')], [incoming('r1')]);
        const list = await calls.getRinging();
        const before = list.get('r1');

        client.emit('CallUpdated', { roomId: 'r1', call: { ...call('r1'), mode: 'Stage' } });
        expect(list.get('r1').call.mode).toBe('Stage');

        client.emit('CallMemberJoined', { roomId: 'r1', member: member('u2') });
        const after = list.get('r1');
        expect(memberIds(after.call)).toEqual(['u1', 'u2']);
        expect(after.call).toBe((await calls.get()).get('r1'));
        expect(after.caller).toBe(before.caller);
        expect(memberIds(before.call)).toEqual(['u1']);
        expect(before.call.mode).toBeUndefined();
    });
});

describe('commands', () => {
    test('join resolves with the access', async () => {
        const { client, calls } = createCalls();
        const access = { roomId: 'r1', url: 'wss://rtc', token: 'jwt', quality: {} };
        client.response = { data: access, error: null };

        await expect(calls.join('r1')).resolves.toBe(access);
        expect(client.sent).toEqual([['JoinCall', { roomId: 'r1' }]]);
    });

    test('send their requests', async () => {
        const { client, calls } = createCalls();

        await calls.decline('r1');
        await calls.invite('r1', { roleIds: ['role'] });
        await calls.muteMember('r1', 'u1');
        await calls.kickMember('r1', 'u2');
        await calls.updateMember('r1', 'u3', { speaker: true, handRaised: false });
        await calls.join('r1', 'Q&A');

        expect(client.sent).toEqual([
            ['DeclineCall', { roomId: 'r1' }],
            ['InviteToCall', { roomId: 'r1', roleIds: ['role'] }],
            ['MuteCallMember', { roomId: 'r1', userId: 'u1' }],
            ['KickCallMember', { roomId: 'r1', userId: 'u2' }],
            ['UpdateCallMember', { roomId: 'r1', userId: 'u3', speaker: true, handRaised: false }],
            ['JoinCall', { roomId: 'r1', title: 'Q&A' }],
        ]);
    });

    test('getMembers resolves with the page of members', async () => {
        const { client, calls } = createCalls();
        const members = [member('u1'), member('u2')];
        client.response = { data: { messageId: 'm1', members }, error: null };

        await expect(calls.getMembers('m1', { limit: 2, offset: 4 })).resolves.toBe(members);
        await calls.getMembers('m1');
        expect(client.sent).toEqual([
            ['GetCallMembers', { messageId: 'm1', limit: 2, offset: 4 }],
            ['GetCallMembers', { messageId: 'm1' }],
        ]);
    });

    test('reject with the server error', async () => {
        const { client, calls } = createCalls();
        const error = { code: 403, message: 'Call is full' };
        client.response = { data: null, error };

        await expect(calls.join('r1')).rejects.toBe(error);
        await expect(calls.invite('r1', { userIds: ['u1'] })).rejects.toBe(error);
    });
});
