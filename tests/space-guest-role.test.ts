import {EventTarget} from "../src/EventTarget";
import {ChatStateTracker} from "../src/state-tracker/ChatStateTracker";

class FakeClient extends EventTarget {
    public async send(): Promise<any> {
        return {data: null, error: {code: 'UnknownCommand', message: ''}};
    }
}

const space = (guestRole: string | null): any => ({
    id: 's1',
    name: 'space',
    description: '',
    roles: [
        {id: 's1', name: 'everyone', priority: 0, color: null, flags: 0},
        {id: 'guests', name: 'guests', priority: 1, color: null, flags: 0},
        {id: 'other', name: 'other', priority: 2, color: null, flags: 0},
    ],
    systemRoom: null,
    defaultRooms: [],
    icon: null,
    banner: null,
    discoverable: 'NotRequested',
    flags: 0,
    guestRole,
});

async function setup(guestRole: string | null) {
    const client = new FakeClient();
    const tracker = new ChatStateTracker(client as any);
    client.emit('Session', {user: {id: 'me'}, state: {rooms: [], spaces: [space(guestRole)], spaceMembers: []}} as any);
    return {client, spaces: await tracker.spaces.get()};
}

test('deleting the guest role clears it on the space', async () => {
    const {client, spaces} = await setup('guests');

    client.emit('RoleDeleted', {spaceId: 's1', id: 'guests'} as any);

    expect(spaces.get('s1').guestRole).toBeNull();
    expect(spaces.get('s1').roles.map(role => role.id)).toEqual(['s1', 'other']);
});

test('deleting another role keeps the guest role', async () => {
    const {client, spaces} = await setup('guests');

    client.emit('RoleDeleted', {spaceId: 's1', id: 'other'} as any);

    expect(spaces.get('s1').guestRole).toBe('guests');
});
