import {EventTarget} from "../src/EventTarget";
import {PermissionsManager} from "../src/state-tracker/PermissionsManager";
import {ChatLocation, GetPermissionOverwritesQuery, PermissionOverwrites, Permissions} from "../src";

const SPACE = 's1';
const ROOM = 'r1';
const TOPIC = 't1';
const TOPIC_LOCATION: ChatLocation = {spaceId: SPACE, roomId: ROOM, topicId: TOPIC};
const {CreateMessages, SendAttachments, React} = Permissions.list;

type Values = Record<string, {allow?: number, deny?: number}>;

const keyOf = ({location, target}: GetPermissionOverwritesQuery) =>
    [location.spaceId, location.roomId, location.topicId, target.type, target.userId, target.roleId].filter(Boolean).join('/');

class FakeClient extends EventTarget<any> {
    public readonly requests: GetPermissionOverwritesQuery[][] = [];
    public values: Values = {};
    public failNext = false;
    public answerShort = false;

    public async send(type: string, data: any): Promise<any> {
        if (type !== 'GetPermissionOverwrites' || !Array.isArray(data.queries)) {
            throw new Error(`Unexpected command ${type} ${JSON.stringify(data)}`);
        }

        this.requests.push(data.queries);
        await Promise.resolve();

        if (this.failNext) {
            this.failNext = false;
            return {data: null, error: {code: 'UserNotFoundException', message: 'nope'}};
        }

        const results: PermissionOverwrites[] = data.queries.map((query: GetPermissionOverwritesQuery) => ({
            ...query,
            overwrites: {allow: 0, deny: 0, ...this.values[keyOf(query)]},
        }));

        return {data: {results: this.answerShort ? results.slice(1) : results}, error: null};
    }
}

const setup = (spaceRoles: string[] = [SPACE, 'mod'], roomRoles: string[] = []) => {
    const client = new FakeClient();
    const state = {spaceRoles, roomRoles};
    const tracker: any = {
        client,
        me: {id: 'me'},
        getMe: async () => ({id: 'me'}),
        rooms: {
            get: async () => new Map([[ROOM, {id: ROOM, spaceId: SPACE}]]),
            getTopics: async () => new Map([[TOPIC, {id: TOPIC}]]),
            getMe: async () => ({userId: 'me', roles: state.roomRoles}),
        },
        spaces: {
            get: async () => new Map([[SPACE, {id: SPACE}]]),
            getMe: async () => ({userId: 'me', roles: state.spaceRoles}),
        },
    };

    return {client, state, manager: new PermissionsManager(tracker)};
};

test('a topic is calculated from one request for every layer', async () => {
    const {client, manager} = setup();
    client.values = {
        [`${SPACE}/Role/${SPACE}`]: {allow: CreateMessages.value | SendAttachments.value},
        [`${SPACE}/${ROOM}/Role/mod`]: {deny: SendAttachments.value},
        [`${SPACE}/${ROOM}/${TOPIC}/User/me`]: {allow: React.value},
    };

    expect(await manager.calculatePermissions(TOPIC_LOCATION)).toBe(CreateMessages.value | React.value);
    expect(client.requests).toHaveLength(1);
    expect(client.requests[0].map(keyOf)).toEqual([
        'User/me',
        `${SPACE}/Role/${SPACE}`, `${SPACE}/Role/mod`, `${SPACE}/User/me`,
        `${SPACE}/${ROOM}/Role/${SPACE}`, `${SPACE}/${ROOM}/Role/mod`, `${SPACE}/${ROOM}/User/me`,
        `${SPACE}/${ROOM}/${TOPIC}/Role/${SPACE}`, `${SPACE}/${ROOM}/${TOPIC}/Role/mod`, `${SPACE}/${ROOM}/${TOPIC}/User/me`,
    ]);
});

test('layers already fetched for a topic answer the room and the space without requests', async () => {
    const {client, manager} = setup();

    await manager.calculatePermissions(TOPIC_LOCATION);
    await manager.calculatePermissions({spaceId: SPACE, roomId: ROOM});
    await manager.calculatePermissions({spaceId: SPACE});
    await manager.check(['CreateMessages'], TOPIC_LOCATION);

    expect(client.requests).toHaveLength(1);
});

test('calculations started together share one request', async () => {
    const {client, manager} = setup();

    await Promise.all([
        manager.calculatePermissions(TOPIC_LOCATION),
        manager.calculatePermissions(TOPIC_LOCATION),
        manager.check(['React'], TOPIC_LOCATION),
    ]);

    expect(client.requests).toHaveLength(1);
});

test('a room after the space asks only for what the space did not have', async () => {
    const {client, manager} = setup();

    await manager.calculatePermissions({spaceId: SPACE});
    await manager.calculatePermissions({spaceId: SPACE, roomId: ROOM});

    expect(client.requests.map(queries => queries.map(keyOf))).toEqual([
        ['User/me', `${SPACE}/Role/${SPACE}`, `${SPACE}/Role/mod`, `${SPACE}/User/me`],
        [`${SPACE}/${ROOM}/Role/${SPACE}`, `${SPACE}/${ROOM}/Role/mod`, `${SPACE}/${ROOM}/User/me`],
    ]);
});

test('a role held both in the space and in the room is asked for once', async () => {
    const {client, manager} = setup([SPACE, 'mod'], ['mod']);

    await manager.calculatePermissions({spaceId: SPACE, roomId: ROOM});

    const keys = client.requests[0].map(keyOf);
    expect(keys).toHaveLength(new Set(keys).size);
    expect(keys.filter(key => key === `${SPACE}/${ROOM}/Role/mod`)).toHaveLength(1);
});

test('a new role is fetched alone on the next calculation', async () => {
    const {client, state, manager} = setup();

    await manager.calculatePermissions(TOPIC_LOCATION);
    state.spaceRoles = [SPACE, 'mod', 'vip'];
    await manager.calculatePermissions(TOPIC_LOCATION);

    expect(client.requests[1].map(keyOf)).toEqual([
        `${SPACE}/Role/vip`, `${SPACE}/${ROOM}/Role/vip`, `${SPACE}/${ROOM}/${TOPIC}/Role/vip`,
    ]);
});

test('more queries than one request takes are split into requests of at most 50', async () => {
    const roles = [SPACE, ...Array.from({length: 20}, (_, i) => `role${i}`)];
    const {client, manager} = setup(roles);

    await manager.calculatePermissions(TOPIC_LOCATION);

    expect(client.requests.map(queries => queries.length)).toEqual([50, 17]);
    for (const queries of client.requests) {
        expect(new Set(queries.map(query => JSON.stringify(query.location))).size).toBeLessThanOrEqual(4);
    }
});

test('a failed request rejects the calculation and the next one asks again', async () => {
    const {client, manager} = setup();
    client.failNext = true;

    await expect(manager.calculatePermissions(TOPIC_LOCATION)).rejects.toMatchObject({code: 'UserNotFoundException'});
    expect(await manager.calculatePermissions(TOPIC_LOCATION)).toBe(0);
    expect(client.requests).toHaveLength(2);
    expect(client.requests[1]).toEqual(client.requests[0]);
});

test('an answer with missing results rejects the calculation', async () => {
    const {client, manager} = setup();
    client.answerShort = true;

    await expect(manager.calculatePermissions(TOPIC_LOCATION)).rejects.toThrow('Expected 10 permission overwrites, received 9');
});

test('a new session asks again with one request', async () => {
    const {client, manager} = setup();
    let changes = 0;
    manager.on('change', () => changes++);

    await manager.calculatePermissions(TOPIC_LOCATION);
    client.emit('Session', {});
    client.values = {[`${SPACE}/User/me`]: {allow: React.value}};

    expect(await manager.calculatePermissions(TOPIC_LOCATION)).toBe(React.value);
    expect(client.requests).toHaveLength(2);
    expect(client.requests[1]).toHaveLength(10);
    expect(changes).toBe(2);
});

test('an updated overwrite changes the result without a request', async () => {
    const {client, manager} = setup();
    let changes = 0;
    manager.on('change', () => changes++);

    expect(await manager.calculatePermissions(TOPIC_LOCATION)).toBe(0);
    client.emit('PermissionOverwritesUpdated', {
        location: {spaceId: SPACE, roomId: ROOM},
        target: {type: 'Role', roleId: 'mod'},
        overwrites: {allow: CreateMessages.value, deny: 0},
    });

    expect(changes).toBe(1);
    expect(await manager.calculatePermissions(TOPIC_LOCATION)).toBe(CreateMessages.value);
    expect(client.requests).toHaveLength(1);
});

test('getOverwrites asks for one item and reuses what a calculation fetched', async () => {
    const {client, manager} = setup();
    client.values = {[`${SPACE}/${ROOM}/User/other`]: {deny: React.value}};

    const other = await manager.getOverwrites({spaceId: SPACE, roomId: ROOM}, {type: 'User', userId: 'other'});
    expect(other?.overwrites).toEqual({allow: 0, deny: React.value});
    expect(client.requests.map(queries => queries.map(keyOf))).toEqual([[`${SPACE}/${ROOM}/User/other`]]);

    await manager.calculatePermissions(TOPIC_LOCATION);
    await manager.getOverwrites({spaceId: SPACE}, {type: 'Role', roleId: 'mod'});
    expect(client.requests).toHaveLength(2);
});

test('a left room is asked for again after rejoining', async () => {
    const {client, manager} = setup();

    await manager.calculatePermissions({spaceId: SPACE, roomId: ROOM});
    client.emit('RoomLeft', {id: ROOM});
    await new Promise(resolve => setTimeout(resolve));
    await manager.calculatePermissions({spaceId: SPACE, roomId: ROOM});

    expect(client.requests[1].map(keyOf)).toEqual([
        `${SPACE}/${ROOM}/Role/${SPACE}`, `${SPACE}/${ROOM}/Role/mod`, `${SPACE}/${ROOM}/User/me`,
    ]);
});
