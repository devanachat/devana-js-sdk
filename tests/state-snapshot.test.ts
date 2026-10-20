import {EventTarget} from "../src/EventTarget";
import {ChatStateTracker} from "../src/state-tracker/ChatStateTracker";
import {STATE_SNAPSHOT_VERSION, StateSnapshot} from "../src/state-tracker/StateSnapshot";
import {UserStatus} from "../src/protocol";

type Responder = (data: any) => any;

class FakeClient extends EventTarget {
    public readonly sent: { type: string; data: any }[] = [];
    public offline = false;
    private readonly responders: Record<string, Responder> = {};

    public respondTo(type: string, responder: Responder): void {
        this.responders[type] = responder;
    }

    public async send(type: string, data: any): Promise<{ data: any; error: any }> {
        this.sent.push({ type, data });

        if (this.offline) {
            throw new Error('Cannot send - client is not ready');
        }

        const responder = this.responders[type];
        return { data: responder ? responder(data) : undefined, error: null };
    }

    public countSent(type: string): number {
        return this.sent.filter(entry => entry.type === type).length;
    }

    public countListeners(eventName: string): number {
        return this.events.get(eventName)?.length ?? 0;
    }
}

const flush = async (): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, 0));
    await new Promise(resolve => setTimeout(resolve, 0));
};

const user = (id: string, status: UserStatus = UserStatus.Online): any => ({
    id,
    nick: id,
    avatar: '',
    tags: [],
    status,
    online: status === UserStatus.Online,
});

const createRoom = (id: string, overrides: any = {}): any => ({
    id,
    spaceId: null,
    name: id,
    description: '',
    type: 'Text',
    defaultTopic: { id: `topic-${id}`, name: '', messageCount: 0, lastMessage: null },
    recipients: null,
    flags: 0,
    stream: null,
    history: { mode: 'Full' },
    ...overrides,
});

const createPm = (id: string, recipients: any[]): any => createRoom(id, { type: 'Pm', recipients });

const createSpace = (id: string, roles: any[] = []): any => ({
    id,
    name: id,
    description: '',
    roles,
    defaultRooms: [],
    systemRoom: null,
    icon: null,
    banner: null,
    discoverable: 'NotRequested',
    flags: 0,
});

const role = (id: string, priority: number): any => ({ id, name: id, priority });

const followedTopic = (roomId: string, topicId: string, overrides: any = {}): any => ({
    location: { roomId, topicId },
    lastAckMessageId: null,
    notificationLevel: 'All',
    missed: 0,
    isUnread: false,
    mentionCount: 0,
    ...overrides,
});

const emitSession = (client: FakeClient, rooms: any[], spaces: any[] = [], me: any = user('me')): void => {
    client.emit('Session', {
        serverVersion: '1.0.0',
        protoVersion: '1.0.0',
        user: me,
        state: { rooms, spaces },
    } as any);
};

const createTracker = () => {
    const client = new FakeClient();
    const tracker = new ChatStateTracker(client as any);
    return { client, tracker };
};

/**
 * A tracker with a session and every lazily loaded list fetched, as the application leaves it.
 */
const createPopulatedTracker = async () => {
    const { client, tracker } = createTracker();

    client.respondTo('GetSpaceRooms', (data: any) => ({
        id: data.id,
        summaries: [{ id: 'R1', spaceId: data.id, name: 'R1', description: '', memberCount: 3, type: 'Text' }],
    }));
    client.respondTo('GetFollowedTopics', (data: any) => ({
        location: data.location,
        followedTopics: data.location.roomId === 'R1' || data.location.spaceId === 'S1'
            ? [followedTopic('R1', 'topic-R1', { isUnread: true, mentionCount: 2 })]
            : [followedTopic('PM1', 'topic-PM1')],
    }));
    client.respondTo('GetEmoticons', (data: any) => {
        const emoticons = [{ id: `e-${data.spaceId ?? 'global'}`, spaceId: data.spaceId, name: 'e', fileId: 'f', user: user('u1') }];
        client.emit('Emoticons', { location: { spaceId: data.spaceId }, emoticons });
        return { location: { spaceId: data.spaceId }, emoticons };
    });
    client.respondTo('GetRelationships', () => {
        const relationships = [{ refUser: user('u2'), type: 'Ignore' }];
        client.emit('Relationships', { relationships });
        return { relationships };
    });

    emitSession(
        client,
        [createRoom('R1', { spaceId: 'S1' }), createPm('PM1', [user('me'), user('u1')])],
        [createSpace('S1', [role('role1', 1)])],
    );

    await tracker.spaces.getRooms('S1');
    await tracker.rooms.followedTopics.cacheForSpace('S1');
    await tracker.rooms.followedTopics.cacheForSpace(null);
    await tracker.emoticons.get();
    await tracker.emoticons.get('S1');
    await tracker.relationships.get();

    return { client, tracker };
};

const exportPopulated = async (): Promise<StateSnapshot> => {
    const { tracker } = await createPopulatedTracker();
    return tracker.exportSnapshot();
};

describe('state snapshot - export', () => {
    test('returns null before any session', () => {
        const { tracker } = createTracker();
        expect(tracker.exportSnapshot()).toBeNull();
    });

    test('is plain JSON of the tracked state', async () => {
        const snapshot = await exportPopulated();

        expect(JSON.parse(JSON.stringify(snapshot))).toEqual(snapshot);
        expect(snapshot.version).toBe(STATE_SNAPSHOT_VERSION);
        expect(typeof snapshot.createdAt).toBe('number');
        expect(snapshot.user.id).toBe('me');
        expect(snapshot.spaces.map(space => space.id)).toEqual(['S1']);
        expect(snapshot.rooms.map(room => room.id)).toEqual(['R1', 'PM1']);
        expect(snapshot.spaceRooms).toEqual([{ spaceId: 'S1', summaries: [expect.objectContaining({ id: 'R1' })] }]);
        expect(snapshot.followedTopics.map(item => item.roomId).sort()).toEqual(['PM1', 'R1']);
        expect(snapshot.emoticons.map(item => item.spaceId).sort()).toEqual(['S1', null].sort());
        expect(snapshot.relationships.map(item => item.refUser.id)).toEqual(['u2']);
    });

    test('leaves out presence', async () => {
        const snapshot = await exportPopulated();
        const users = [
            snapshot.user,
            ...snapshot.rooms.flatMap(room => room.recipients ?? []),
            ...snapshot.relationships.map(relationship => relationship.refUser),
        ];

        expect(users.length).toBeGreaterThan(1);
        for (const exportedUser of users) {
            expect(exportedUser.status).toBe(UserStatus.Offline);
            expect(exportedUser.online).toBe(false);
        }
    });

    test('is detached from the live state', async () => {
        const { tracker } = await createPopulatedTracker();
        const snapshot = tracker.exportSnapshot();

        snapshot.rooms[0].name = 'changed';
        snapshot.spaces[0].roles.push(role('x', 9));

        expect((await tracker.rooms.get()).get('R1').name).toBe('R1');
        expect((await tracker.spaces.getRoles('S1')).length).toBe(1);
    });

    test('marks relationships that were never loaded with null', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createRoom('R1')]);

        const snapshot = tracker.exportSnapshot();

        expect(snapshot.relationships).toBeNull();
        expect(snapshot.spaceRooms).toEqual([]);
        expect(snapshot.followedTopics).toEqual([]);
        expect(snapshot.emoticons).toEqual([]);
    });
});

describe('state snapshot - import', () => {
    test('round trip restores the state without any request', async () => {
        const snapshot = await exportPopulated();
        const { client, tracker } = createTracker();

        expect(tracker.importSnapshot(JSON.parse(JSON.stringify(snapshot)))).toBe(true);

        expect(tracker.me.id).toBe('me');
        expect((await tracker.getMe()).id).toBe('me');
        expect((await tracker.spaces.get()).items.map(space => space.id)).toEqual(['S1']);
        expect((await tracker.spaces.getRoles('S1')).items.map(item => item.id)).toEqual(['role1']);
        expect((await tracker.spaces.getRooms('S1')).items.map(item => item.id)).toEqual(['R1']);
        expect((await tracker.rooms.get()).items.map(room => room.id)).toEqual(['R1', 'PM1']);
        expect((await tracker.rooms.getTopics('R1')).items.map(topic => topic.id)).toEqual(['topic-R1']);
        expect((await tracker.rooms.getMembers('PM1')).items.map(member => member.user.id)).toEqual(['me', 'u1']);
        expect((await tracker.rooms.followedTopics.getForRoom('R1')).items).toHaveLength(1);
        expect(await tracker.rooms.followedTopics.summarize({ spaceId: 'S1' })).toEqual({
            mentionCount: 2, unreadTopicCount: 1, unreadRoomCount: 1, isUnread: true,
        });
        expect((await tracker.emoticons.get()).items.map(item => item.id)).toEqual(['e-global']);
        expect((await tracker.emoticons.get('S1')).items.map(item => item.id)).toEqual(['e-S1']);
        expect((await tracker.relationships.get()).items).toHaveLength(1);
        expect((await tracker.users.getAvailable()).get('me')).toBeDefined();
        expect(await tracker.rooms.messages.getRoomHistory('R1')).toMatchObject({ isPreview: false });

        expect(client.sent).toEqual([]);
        expect(tracker.exportSnapshot()).toEqual({ ...snapshot, createdAt: expect.any(Number) });
    });

    test('works offline', async () => {
        const snapshot = await exportPopulated();
        const { client, tracker } = createTracker();
        client.offline = true;

        tracker.importSnapshot(snapshot);

        expect((await tracker.spaces.getRooms('S1')).length).toBe(1);
        expect((await tracker.rooms.followedTopics.summarize({})).isUnread).toBe(false);
        expect((await tracker.emoticons.get('S1')).length).toBe(1);
        // Not in the snapshot - fails like any request without a connection, and can be retried later.
        await expect(tracker.spaces.getMembers('S1')).rejects.toThrow();
    });

    test('resolves getters that were already waiting for the session', async () => {
        const snapshot = await exportPopulated();
        const { tracker } = createTracker();

        const waiting = Promise.all([tracker.spaces.get(), tracker.rooms.get(), tracker.getMe()]);
        tracker.importSnapshot(snapshot);

        const [spaces, rooms, me] = await waiting;
        expect(spaces.length).toBe(1);
        expect(rooms.length).toBe(2);
        expect(me.id).toBe('me');
    });

    test('emits change events of the collections', async () => {
        const snapshot = await exportPopulated();
        const { tracker } = createTracker();
        const followedTopicsChange = jest.fn();
        tracker.rooms.followedTopics.on('change', followedTopicsChange);

        // Collections a consumer may have bound before the import (the getters resolve them only after it).
        const spacesPromise = tracker.spaces.get();
        const roomsPromise = tracker.rooms.get();
        tracker.importSnapshot(snapshot);
        const [spaces, rooms] = await Promise.all([spacesPromise, roomsPromise]);
        expect(spaces.length).toBe(1);
        expect(rooms.length).toBe(2);
        expect(followedTopicsChange).toHaveBeenCalled();

        // A fresh tracker: bind to the collections first, through a session-less import of an empty state.
        const { tracker: other } = createTracker();
        const listChanges: string[] = [];
        (other.spaces as any).list.on('change', (ev: any) => listChanges.push(...ev.setItems.map((id: string) => `space:${id}`)));
        (other.rooms as any).list.on('change', (ev: any) => listChanges.push(...ev.setItems.map((id: string) => `room:${id}`)));
        other.importSnapshot(snapshot);
        expect(listChanges.sort()).toEqual(['room:PM1', 'room:R1', 'space:S1']);
    });

    test('is rejected for another version, leaving the state untouched', async () => {
        const snapshot = await exportPopulated();

        for (const version of [0, 2, '1', undefined]) {
            const { tracker } = createTracker();
            expect(tracker.importSnapshot({ ...snapshot, version })).toBe(false);
            expect(tracker.me).toBeNull();
            expect(tracker.exportSnapshot()).toBeNull();
        }
    });

    test('is rejected for malformed data without throwing', async () => {
        const snapshot = await exportPopulated();
        const malformed: unknown[] = [
            null,
            undefined,
            42,
            'snapshot',
            [],
            {},
            { ...snapshot, user: null },
            { ...snapshot, user: { nick: 'no id' } },
            { ...snapshot, spaces: null },
            { ...snapshot, spaces: [{ id: 'S1' }] },
            { ...snapshot, spaces: [{ ...snapshot.spaces[0], roles: [{ id: 'r' }] }] },
            { ...snapshot, rooms: {} },
            { ...snapshot, rooms: [{ ...snapshot.rooms[0], history: null }] },
            { ...snapshot, rooms: [{ ...snapshot.rooms[0], defaultTopic: { name: 'no id' } }] },
            { ...snapshot, rooms: [{ ...snapshot.rooms[1], recipients: [null] }] },
            { ...snapshot, spaceRooms: [{ spaceId: 'S1', summaries: [null] }] },
            { ...snapshot, followedTopics: [{ roomId: 'R1', followedTopics: [{ location: null }] }] },
            { ...snapshot, emoticons: [{ spaceId: 5, emoticons: [] }] },
            { ...snapshot, relationships: [{ refUser: null, type: 'Ignore' }] },
            { ...snapshot, relationships: undefined },
            { ...snapshot, createdAt: 'yesterday' },
        ];

        for (const data of malformed) {
            const { client, tracker } = createTracker();
            expect(() => tracker.importSnapshot(data)).not.toThrow();
            expect(tracker.importSnapshot(data)).toBe(false);
            expect(tracker.me).toBeNull();

            // Still works normally afterwards.
            emitSession(client, [createRoom('R1')]);
            expect((await tracker.rooms.get()).items.map(room => room.id)).toEqual(['R1']);
        }
    });

    test('is rejected after a session and when repeated', async () => {
        const snapshot = await exportPopulated();

        const { client, tracker } = createTracker();
        emitSession(client, [createRoom('X')]);
        expect(tracker.importSnapshot(snapshot)).toBe(false);
        expect((await tracker.rooms.get()).items.map(room => room.id)).toEqual(['X']);

        const { tracker: other } = createTracker();
        expect(other.importSnapshot(snapshot)).toBe(true);
        expect(other.importSnapshot({ ...snapshot, rooms: [] })).toBe(false);
        expect((await other.rooms.get()).length).toBe(2);
    });

    test('skips lists of spaces and rooms that are not in the snapshot', async () => {
        const snapshot = await exportPopulated();
        const { tracker } = createTracker();

        tracker.importSnapshot({
            ...snapshot,
            spaceRooms: [...snapshot.spaceRooms, { spaceId: 'S9', summaries: [{ id: 'R9' } as any] }],
            followedTopics: [...snapshot.followedTopics, { roomId: 'R9', followedTopics: [followedTopic('R9', 't')] }],
            emoticons: [...snapshot.emoticons, { spaceId: 'S9', emoticons: [{ id: 'e9' } as any] }],
        });

        const exported = tracker.exportSnapshot();
        expect(exported.spaceRooms.map(item => item.spaceId)).toEqual(['S1']);
        expect(exported.followedTopics.map(item => item.roomId)).not.toContain('R9');
        expect(exported.emoticons.map(item => item.spaceId)).not.toContain('S9');
    });
});

describe('state snapshot - session after import', () => {
    const importInto = async () => {
        const snapshot = await exportPopulated();
        const { client, tracker } = createTracker();
        tracker.importSnapshot(snapshot);

        client.respondTo('GetSpaceRooms', (data: any) => ({
            id: data.id,
            summaries: [{ id: 'R2', spaceId: data.id, name: 'R2', description: '', memberCount: 1, type: 'Text' }],
        }));
        client.respondTo('GetFollowedTopics', (data: any) => ({
            location: data.location,
            followedTopics: data.location.roomId === 'R2' || data.location.spaceId === 'S1'
                ? [followedTopic('R2', 'topic-R2', { isUnread: true })]
                : [],
        }));
        client.respondTo('GetEmoticons', (data: any) => ({
            location: { spaceId: data.spaceId },
            emoticons: [{ id: `new-${data.spaceId ?? 'global'}`, spaceId: data.spaceId, name: 'n', fileId: 'f', user: user('u1') }],
        }));
        client.respondTo('GetRelationships', () => {
            client.emit('Relationships', { relationships: [] });
            return { relationships: [] };
        });

        return { client, tracker, snapshot };
    };

    test('replaces the restored state in place, without duplicates', async () => {
        const { client, tracker } = await importInto();
        const spaces = await tracker.spaces.get();
        const rooms = await tracker.rooms.get();
        const spaceRooms = await tracker.spaces.getRooms('S1');
        const relationships = await tracker.relationships.get();

        // On the server: R1 and PM1 left, R2 joined, S1 renamed, its role changed.
        emitSession(
            client,
            [createRoom('R2', { spaceId: 'S1' })],
            [{ ...createSpace('S1', [role('role2', 1)]), name: 'S1-renamed' }],
            user('me'),
        );
        await flush();

        expect(await tracker.spaces.get()).toBe(spaces);
        expect(await tracker.rooms.get()).toBe(rooms);
        expect(spaces.items.map(space => space.name)).toEqual(['S1-renamed']);
        expect((await tracker.spaces.getRoles('S1')).items.map(item => item.id)).toEqual(['role2']);
        expect(rooms.items.map(room => room.id)).toEqual(['R2']);
        expect(await tracker.rooms.getTopics('R1')).toBeUndefined();
        expect((tracker.rooms as any).members.has('PM1')).toBe(false);
        expect(tracker.me.status).toBe(UserStatus.Online);

        // The lazily loaded lists are refetched on the next access and reconciled into the same objects.
        expect(await tracker.spaces.getRooms('S1')).toBe(spaceRooms);
        expect(spaceRooms.items.map(item => item.id)).toEqual(['R2']);
        expect(await tracker.relationships.get()).toBe(relationships);
        expect(relationships.length).toBe(0);
        expect((await tracker.emoticons.get('S1')).items.map(item => item.id)).toEqual(['new-S1']);
        await tracker.rooms.followedTopics.cacheForSpace('S1');
        expect(await tracker.rooms.followedTopics.summarize({ spaceId: 'S1' })).toEqual({
            mentionCount: 0, unreadTopicCount: 1, unreadRoomCount: 1, isUnread: true,
        });
        expect(client.countSent('GetSpaceRooms')).toBe(1);
        expect(client.countSent('GetRelationships')).toBe(1);
    });

    test('drops the followed topics and emoticons of rooms and spaces that are gone', async () => {
        const { client, tracker } = await importInto();

        emitSession(client, [createRoom('R2')], [], user('me'));
        await flush();

        const exported = tracker.exportSnapshot();
        expect(exported.spaces).toEqual([]);
        expect(exported.rooms.map(room => room.id)).toEqual(['R2']);
        expect(exported.spaceRooms).toEqual([]);
        expect(exported.followedTopics).toEqual([]);
        expect(exported.emoticons.map(item => item.spaceId)).toEqual([null]);
        expect((tracker.rooms.followedTopics as any).followedTopics.length).toBe(0);
        expect((tracker.emoticons as any).list.length).toBe(1);
    });

    test('keeps the message histories of the surviving rooms', async () => {
        const { client, tracker } = await importInto();
        const history = await tracker.rooms.messages.getRoomHistory('R1');

        emitSession(client, [createRoom('R1', { spaceId: 'S1' })], [createSpace('S1')], user('me'));
        await flush();

        expect(await tracker.rooms.messages.getRoomHistory('R1')).toBe(history);
    });

    test('a later session behaves as a plain reconnect', async () => {
        const { client, tracker } = await importInto();

        emitSession(client, [createRoom('R2', { spaceId: 'S1' })], [createSpace('S1')], user('me'));
        await flush();
        await tracker.emoticons.get('S1');

        const listenersBefore = client.countListeners('Session');
        emitSession(client, [createRoom('R2', { spaceId: 'S1' })], [], user('me'));
        await flush();

        expect(client.countListeners('Session')).toBe(listenersBefore);
        // A reconnect keeps emoticons of a space left meanwhile; only the first session after an import prunes.
        expect((tracker.emoticons as any).list.has('S1')).toBe(true);
    });
});

describe('state snapshot - unused', () => {
    test('a tracker without an import handles sessions exactly as before', async () => {
        const { client, tracker } = createTracker();

        emitSession(client, [createRoom('R1', { spaceId: 'S1' })], [createSpace('S1')]);
        client.respondTo('GetEmoticons', (data: any) => ({ location: { spaceId: data.spaceId }, emoticons: [] }));
        await tracker.emoticons.get('S1');

        emitSession(client, [], []);
        await flush();

        // Reconnect semantics untouched: emoticons of a space left meanwhile stay cached.
        expect((tracker.emoticons as any).list.has('S1')).toBe(true);
        expect((await tracker.rooms.get()).length).toBe(0);
    });
});

describe('state snapshot - message histories', () => {
    const message = (id: string, roomId: string, topicId: string, overrides: any = {}): any => ({
        id,
        location: { roomId, topicId },
        createdAt: '2026-01-01T00:00:00Z',
        type: 'Text',
        author: { user: user('u1') },
        content: id,
        topicRef: null,
        attachments: null,
        reactions: [],
        mentions: null,
        ...overrides,
    });
    const messages = (count: number, roomId: string, topicId: string, prefix = 'm'): any[] =>
        Array.from({ length: count }, (_, i) => message(`${prefix}${i}`, roomId, topicId));
    const member = (id: string): any => ({
        user: user(id), spaceMember: null, roles: ['role1'], customNick: null, customColor: null, customAvatar: null, extras: '',
    });
    const thread = { id: 'thread', name: 'thread', messageCount: 1, refMessage: message('m59', 'R1', 'topic-R1') };

    /**
     * R1 (space room) with a default topic window of 60 messages fetched, the last one starting a thread, which
     * is fetched too; PM1 with a window that was never fetched; members of R1 loaded.
     */
    const createTrackerWithHistory = async () => {
        const { client, tracker } = createTracker();
        let fetched = 0;
        client.respondTo('GetMessages', (data: any) => {
            fetched++;
            const { roomId, topicId } = data.location;
            const list = topicId === 'thread'
                ? messages(3, roomId, topicId, `t${fetched}-`)
                : messages(60, roomId, topicId, fetched > 1 ? `new${fetched}-` : 'm');
            if (topicId === 'topic-R1' && fetched === 1) {
                list[59] = { ...list[59], topicRef: 'thread' };
            }
            return { location: data.location, messages: list, myReactions: { m59: [{ type: 'Emoji', value: 'x' }], m1: [{ type: 'Emoji', value: 'y' }] } };
        });
        client.respondTo('GetTopics', (data: any) => ({
            location: { roomId: data.roomId },
            topics: data.topicIds.includes('thread') ? [thread] : [],
        }));
        client.respondTo('GetRoomMembers', (data: any) => ({ id: data.id, members: [member('me'), member('u1')] }));

        emitSession(
            client,
            [
                createRoom('R1', { spaceId: 'S1' }),
                createRoom('E1', { history: { mode: 'Ephemeral' } }),
                createPm('PM1', [user('me'), user('u1')]),
            ],
            [createSpace('S1', [role('role1', 1)])],
        );

        const history = await tracker.rooms.messages.getRoomHistory('R1');
        await (await history.getMessagesWindow('topic-R1')).resetToLatest();
        await (await history.getMessagesWindow('thread')).resetToLatest();
        await tracker.rooms.getMembers('R1');
        await (await (await tracker.rooms.messages.getRoomHistory('E1')).getMessagesWindow('topic-E1'));
        client.emit('NewMessage', { message: message('e1', 'E1', 'topic-E1') });

        return { client, tracker };
    };

    const fullIntent = {
        histories: [{ roomId: 'R1' }, { roomId: 'R1', topicId: 'thread' }, { roomId: 'PM1' }, { roomId: 'E1' }, { roomId: 'X' }],
        roomMembersLimit: 10,
    };

    test('exports nothing more without an intent', async () => {
        const { tracker } = await createTrackerWithHistory();
        const snapshot = tracker.exportSnapshot();

        expect(snapshot.histories).toEqual([]);
        expect(snapshot.roomMembers).toEqual([]);
    });

    test('exports the latest messages of the topics asked for, with what their display needs', async () => {
        const { tracker } = await createTrackerWithHistory();
        const snapshot = tracker.exportSnapshot(fullIntent);

        // PM1 was never fetched, E1 is ephemeral, X is unknown.
        expect(snapshot.histories.map(history => `${history.roomId}/${history.topicId}`)).toEqual(['R1/topic-R1', 'R1/thread']);

        const [main, side] = snapshot.histories;
        expect(main.messages.map(item => item.id)).toEqual(messages(60, 'R1', 'topic-R1').slice(10).map(item => item.id));
        expect(main.myReactions).toEqual({ m59: [{ type: 'Emoji', value: 'x' }] });
        expect(main.topics.map(topic => topic.id)).toEqual(['thread']);
        expect(main.messages.every(item => item.author.user.status === UserStatus.Offline)).toBe(true);
        expect(side.messages).toHaveLength(3);
        expect(side.topics.map(topic => topic.id)).toEqual(['thread']);

        expect(snapshot.roomMembers).toEqual([{ roomId: 'R1', members: expect.any(Array) }]);
        expect(snapshot.roomMembers[0].members.map(item => item.user.status)).toEqual([UserStatus.Offline, UserStatus.Offline]);
        expect(JSON.parse(JSON.stringify(snapshot))).toEqual(snapshot);
    });

    test('exports never fewer messages than the window fetches at once, and the members up to the limit', async () => {
        const { tracker } = await createTrackerWithHistory();

        expect(tracker.exportSnapshot({ ...fullIntent, historyLimit: 5 }).histories[0].messages).toHaveLength(50);
        expect(tracker.exportSnapshot({ ...fullIntent, historyLimit: 100 }).histories[0].messages).toHaveLength(60);
        expect(tracker.exportSnapshot({ ...fullIntent, roomMembersLimit: 1 }).roomMembers).toEqual([]);
    });

    test('restores the windows, topics and members without any request', async () => {
        const { tracker: source } = await createTrackerWithHistory();
        const snapshot = JSON.parse(JSON.stringify(source.exportSnapshot(fullIntent)));
        const { client, tracker } = createTracker();
        client.offline = true;

        expect(tracker.importSnapshot(snapshot)).toBe(true);

        const history = await tracker.rooms.messages.getRoomHistory('R1');
        const main = await history.getMessagesWindow('topic-R1');
        const side = await history.getMessagesWindow('thread');

        expect(main.state).toBe(main.WindowState.LATEST);
        expect(main.items.map(item => item.id)).toEqual(snapshot.histories[0].messages.map((item: any) => item.id));
        expect(main.hasOldest).toBe(false);
        expect(main.myReactions).toEqual({ m59: [{ type: 'Emoji', value: 'x' }] });
        expect(side.length).toBe(3);
        expect(side.hasOldest).toBe(true);
        expect((await tracker.rooms.getTopics('R1', ['thread'])).get('thread').name).toBe('thread');
        expect((await tracker.rooms.getMembers('R1')).items.map(item => item.user.id)).toEqual(['me', 'u1']);
        expect(client.sent).toEqual([]);

        // A restored window holds the latest messages - nothing to fetch for it while offline.
        await main.resetToLatest();
        expect(client.sent).toEqual([]);
    });

    test('a restored window emits a change', async () => {
        const { client, tracker } = createTracker();
        emitSession(client, [createRoom('R1')]);
        const window = await (await tracker.rooms.messages.getRoomHistory('R1')).getMessagesWindow('topic-R1');
        const changes: any[] = [];
        window.on('change', (ev: any) => changes.push(ev));

        window._restoreLatest(messages(2, 'R1', 'topic-R1'), {});

        expect(changes).toEqual([{ setItems: ['m0', 'm1'] }]);
    });

    test('the first session fetches the restored histories and topics anew', async () => {
        const { tracker: source } = await createTrackerWithHistory();
        const snapshot = source.exportSnapshot(fullIntent);
        const { client, tracker } = createTracker();
        tracker.importSnapshot(snapshot);

        const history = await tracker.rooms.messages.getRoomHistory('R1');
        const main = await history.getMessagesWindow('topic-R1');
        const members = await tracker.rooms.getMembers('R1');
        const updatedThread = { ...thread, name: 'thread-renamed' };
        client.respondTo('GetMessages', (data: any) => ({
            location: data.location,
            messages: messages(5, data.location.roomId, data.location.topicId, 'fresh'),
            myReactions: {},
        }));
        client.respondTo('GetTopics', () => ({ location: { roomId: 'R1' }, topics: [updatedThread] }));
        client.respondTo('GetRoomMembers', (data: any) => ({ id: data.id, members: [member('me')] }));

        emitSession(client, [createRoom('R1', { spaceId: 'S1' })], [createSpace('S1', [role('role1', 1)])]);
        await flush();

        expect(await history.getMessagesWindow('topic-R1')).toBe(main);
        expect(main.items.map(item => item.id)).toEqual(['fresh0', 'fresh1', 'fresh2', 'fresh3', 'fresh4']);
        expect((await history.getMessagesWindow('thread')).items[0].id).toBe('fresh0');
        expect(client.countSent('GetTopics')).toBe(1);
        expect((await tracker.rooms.getTopics('R1')).get('thread').name).toBe('thread-renamed');
        expect(await tracker.rooms.getMembers('R1')).toBe(members);
        expect(members.items.map(item => item.user.id)).toEqual(['me']);

        // Later sessions are plain reconnects - the topics are not fetched again.
        emitSession(client, [createRoom('R1', { spaceId: 'S1' })], [createSpace('S1', [role('role1', 1)])]);
        await flush();
        expect(client.countSent('GetTopics')).toBe(1);
    });

    test('skips histories and members of rooms that are not in the snapshot', async () => {
        const { tracker: source } = await createTrackerWithHistory();
        const snapshot = source.exportSnapshot(fullIntent);
        const { tracker } = createTracker();

        tracker.importSnapshot({
            ...snapshot,
            rooms: snapshot.rooms.filter(room => room.id !== 'R1'),
        });

        expect(tracker.exportSnapshot(fullIntent).histories).toEqual([]);
        expect((tracker.rooms as any).members.has('R1')).toBe(false);
    });

    test('rejects malformed histories and members', async () => {
        const { tracker: source } = await createTrackerWithHistory();
        const snapshot = source.exportSnapshot(fullIntent);
        const [history] = snapshot.histories;
        const malformed: unknown[] = [
            { ...snapshot, histories: undefined },
            { ...snapshot, roomMembers: undefined },
            { ...snapshot, histories: [{ ...history, messages: [{ ...history.messages[0], reactions: null }] }] },
            { ...snapshot, histories: [{ ...history, messages: [{ ...history.messages[0], author: null }] }] },
            { ...snapshot, histories: [{ ...history, messages: [{ ...history.messages[0], location: { topicId: 't' } }] }] },
            { ...snapshot, histories: [{ ...history, myReactions: { m59: 'x' } }] },
            { ...snapshot, histories: [{ ...history, topics: [null] }] },
            { ...snapshot, histories: [{ ...history, topicId: 5 }] },
            { ...snapshot, roomMembers: [{ roomId: 'R1', members: [{ user: null, spaceMember: null }] }] },
        ];

        for (const data of malformed) {
            const { tracker } = createTracker();
            expect(tracker.importSnapshot(data)).toBe(false);
            expect(tracker.me).toBeNull();
        }
    });
});
