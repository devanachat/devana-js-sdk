import {EventTarget} from "../src/EventTarget";
import {ChatStateTracker} from "../src/state-tracker/ChatStateTracker";
import {WindowState} from "../src/state-tracker/TopicHistoryWindow";
import {ErrorCode, Layer, Permissions} from "../src";

const JOINED = 'joined';
const ROOM = 'r1';
const TOPIC = 't1';
const id = (n: number) => `m${String(n).padStart(3, '0')}`;

const createRoom = (roomId: string): any => ({
    id: roomId,
    spaceId: null,
    name: roomId,
    description: '',
    type: 'Text',
    defaultTopic: {id: `topic-${roomId}`, name: '', messageCount: 0},
    recipients: null,
    flags: 0,
    stream: null,
    history: {mode: 'Full'},
});

class FakeClient extends EventTarget {
    public readonly sent: {type: string, data: any}[] = [];
    public all: {id: string, location: any}[] = [];
    public permissions = 0;
    public error: {code: string, message: string} | null = null;

    public async send(type: string, data: any): Promise<any> {
        this.sent.push({type, data});

        if (this.error) {
            return {data: null, error: this.error};
        }

        const index = (messageId?: string) => this.all.findIndex(message => message.id === messageId);

        switch (type) {
            case 'GetComputedPermissions':
                return {data: {permissions: this.permissions, location: data.location, userId: 'me'}, error: null};
            case 'GetTopics':
                return {data: {location: {roomId: data.roomId}, topics: data.topicIds.map((topicId: string) => ({
                    id: topicId, name: '', messageCount: this.all.length, lastMessage: this.all[this.all.length - 1],
                }))}, error: null};
            case 'GetMessages': {
                let messages;
                if (data.before) {
                    const end = index(data.before);
                    messages = this.all.slice(Math.max(0, end - data.limit), end);
                } else if (data.after) {
                    messages = this.all.slice(index(data.after) + 1, index(data.after) + 1 + data.limit);
                } else if (data.around) {
                    const center = index(data.around);
                    messages = this.all.slice(Math.max(0, center - data.limit / 2), center + data.limit / 2);
                } else {
                    messages = this.all.slice(-data.limit);
                }
                return {data: {location: data.location, messages}, error: null};
            }
        }

        return {data: null, error: {code: 'UnknownCommand', message: type}};
    }

    public fill(total: number): void {
        this.all = Array.from({length: total}, (_, index) => ({id: id(index + 1), location: {roomId: ROOM, topicId: TOPIC}}));
    }

    public count(type: string): number {
        return this.sent.filter(entry => entry.type === type).length;
    }
}

function setup(total: number) {
    const client = new FakeClient();
    client.fill(total);
    const tracker = new ChatStateTracker(client as any);
    client.emit('Session', {user: {id: 'me'}, state: {rooms: [createRoom(JOINED)], spaces: [], spaceMembers: []}} as any);
    return {client, tracker};
}

async function previewWindow(tracker: ChatStateTracker, topicId: string = TOPIC) {
    const history = await tracker.rooms.messages.getRoomHistory(ROOM);
    return (await history!.getMessagesWindow(topicId))!;
}

describe('room history preview', () => {
    test('is given for a room you have not joined, and the joined rooms keep their regular history', async () => {
        const {tracker} = setup(0);
        const messages = tracker.rooms.messages;

        const preview = await messages.getRoomHistory(ROOM);
        expect(preview?.isPreview).toBe(true);
        expect(await messages.getRoomHistory(ROOM)).toBe(preview);

        expect((await messages.getRoomHistory(JOINED)).isPreview).toBe(false);
        expect((await tracker.rooms.get()).has(ROOM)).toBe(false);
    });

    test('gives a regular window over the history, reading only', async () => {
        const {client, tracker} = setup(120);
        const window = await previewWindow(tracker);

        expect(window.isPreview).toBe(true);
        expect(window.includeMyReactions).toBe(false);
        expect(window.state).toBe(WindowState.LIVE);

        await window.resetToLatest();
        expect(window.state).toBe(WindowState.LATEST);
        expect(window.getAt(window.length - 1)?.id).toBe('m120');

        await window.fetchPrevious();
        await window.fetchPrevious();
        await window.fetchPrevious();
        expect(window.length).toBe(120);
        expect(window.hasOldest).toBe(true);

        expect(client.sent.every(entry => ['GetTopics', 'GetMessages'].includes(entry.type))).toBe(true);
        expect(client.sent.find(entry => entry.type === 'GetMessages')?.data.location).toEqual({roomId: ROOM, topicId: TOPIC});
    });

    test('opens around a message and walks forward to the latest', async () => {
        const {tracker} = setup(300);
        const window = await previewWindow(tracker);

        await window.jumpTo('m100');
        expect(window.has('m100')).toBe(true);
        expect(window.state).toBe(WindowState.PAST);

        while (! window.hasLatest) {
            await window.fetchNext();
        }

        expect(window.getAt(window.length - 1)?.id).toBe('m300');
    });

    test('fetchNext at the latest messages takes the newer ones, as no events come', async () => {
        const {client, tracker} = setup(60);
        const window = await previewWindow(tracker);
        await window.resetToLatest();
        const changes: unknown[] = [];
        window.on('change', ev => changes.push(ev));

        await window.fetchNext();
        expect(changes.length).toBe(0); // Nothing new

        client.fill(65);
        await window.fetchNext();

        expect(window.getAt(window.length - 1)?.id).toBe('m065');
        expect(window.state).toBe(WindowState.LATEST);
        expect(changes.length).toBe(1);
        expect(client.sent.filter(entry => entry.type === 'GetMessages').pop()?.data.after).toBe('m060');
    });

    test('ignores the live events of the room', async () => {
        const {client, tracker} = setup(10);
        const window = await previewWindow(tracker);
        await window.resetToLatest();

        client.emit('NewMessage', {message: {id: 'live', author: {user: {id: 'u'}}, location: {roomId: ROOM, topicId: TOPIC}, reactions: []}} as any);

        expect(window.has('live')).toBe(false);
    });

    test('reads any topic of the room, a thread included', async () => {
        const {client, tracker} = setup(10);
        const window = await previewWindow(tracker, 'thread-1');

        await window.resetToLatest();

        expect(client.sent.find(entry => entry.type === 'GetMessages')?.data.location.topicId).toBe('thread-1');
    });

    test('fetches the topic only in the window, which fails without access', async () => {
        const {client, tracker} = setup(10);
        const history = await tracker.rooms.messages.getRoomHistory(ROOM);
        const window = await history.getMessagesWindow(TOPIC);

        expect(window).toBeDefined();
        expect(client.sent.length).toBe(0);

        client.error = {code: ErrorCode.UserNotFound, message: 'denied'};
        await expect(window!.resetToLatest()).rejects.toThrow('denied');
    });

    test('mirrors keep the preview mode', async () => {
        const {tracker} = setup(10);
        const window = await previewWindow(tracker);
        await window.resetToLatest();

        const mirror = window.createMirror();

        expect(mirror.isPreview).toBe(true);
        expect(mirror.length).toBe(10);
    });

    test('is dropped when forgotten, and when the room is joined', async () => {
        const {client, tracker} = setup(10);
        const messages = tracker.rooms.messages;

        const first = await messages.getRoomHistory(ROOM);
        messages.forgetRoomPreview(ROOM);
        expect(await messages.getRoomHistory(ROOM)).not.toBe(first);

        client.emit('RoomJoined', {room: createRoom(ROOM)} as any);
        const regular = await messages.getRoomHistory(ROOM);

        expect(regular?.isPreview).toBe(false);
        expect(regular).toBe(await messages.getRoomHistory(ROOM));
    });
});

describe('PreviewRooms and SearchMessages permissions', () => {
    test('are defined with the bits of the server, on the space and room layers', () => {
        expect(Permissions.getByName('PreviewRooms')?.value).toBe(1 << 24);
        expect(Permissions.getByName('SearchMessages')?.value).toBe(1 << 25);

        for (const name of ['PreviewRooms', 'SearchMessages'] as const) {
            expect(Permissions.canBeDefinedOnLayer(name, Layer.Space)).toBe(true);
            expect(Permissions.canBeDefinedOnLayer(name, Layer.Room)).toBe(true);
            expect(Permissions.canBeDefinedOnLayer(name, Layer.Topic)).toBe(false);
        }
    });

    test('of a room you have not joined are asked from the server', async () => {
        const {client, tracker} = setup(0);
        client.permissions = Permissions.list.PreviewRooms.value;

        const result = await tracker.permissions.check(['PreviewRooms', 'SearchMessages'], {roomId: ROOM});

        expect(result).toEqual({ok: false, hasAll: false, hasAny: true, missing: ['SearchMessages']});
        expect(client.sent.find(entry => entry.type === 'GetComputedPermissions')?.data).toEqual({location: {spaceId: undefined, roomId: ROOM, topicId: undefined}});
    });

    test('a refusal of the server is thrown', async () => {
        const {client, tracker} = setup(0);
        client.error = {code: ErrorCode.UserNotFound, message: 'denied'};

        await expect(tracker.permissions.calculatePermissions({roomId: ROOM})).rejects.toMatchObject({code: 'UserNotFoundException'});
    });
});
