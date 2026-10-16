import {EventTarget} from "../src/EventTarget";
import {ChatStateTracker} from "../src/state-tracker/ChatStateTracker";
import {PreviewHistoryWindow, RoomPreviewError} from "../src/state-tracker/PreviewHistoryWindow";
import {WindowState} from "../src/state-tracker/TopicHistoryWindow";
import {ErrorCode, Layer, Permissions} from "../src";

const ROOM = 'r1';
const TOPIC = 't-default';
const id = (n: number) => `m${String(n).padStart(3, '0')}`;

type Responder = (data: any) => {data?: any, error?: {code: string, message: string}};

class FakeClient extends EventTarget {
    public readonly sent: {type: string, data: any}[] = [];
    public all: {id: string}[] = [];
    public summary: any = {id: ROOM, spaceId: 's1', name: 'general', defaultTopicId: TOPIC};
    public permissions = 0;
    public error: {code: string, message: string} | null = null;

    public async send(type: string, data: any): Promise<any> {
        this.sent.push({type, data});

        if (this.error) {
            return {data: null, error: this.error};
        }

        const index = (messageId?: string) => this.all.findIndex(message => message.id === messageId);

        switch (type) {
            case 'GetRoomSummary':
                return {data: {summary: this.summary}, error: null};
            case 'GetComputedPermissions':
                return {data: {permissions: this.permissions, location: data.location, userId: 'me'}, error: null};
            case 'GetTopics':
                return {data: {location: {roomId: data.roomId}, topics: [{id: data.topicIds[0], lastMessage: this.all[this.all.length - 1]}]}, error: null};
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

        throw new Error(`Unexpected command ${type}`);
    }

    public fill(total: number): void {
        this.all = Array.from({length: total}, (_, index) => ({id: id(index + 1)}));
    }

    public count(type: string): number {
        return this.sent.filter(entry => entry.type === type).length;
    }
}

function setup(total: number) {
    const client = new FakeClient();
    client.fill(total);
    const tracker = new ChatStateTracker(client as any);
    return {client, tracker};
}

describe('previewRoom', () => {
    test('loads the latest messages of the default topic and sends only reads', async () => {
        const {client, tracker} = setup(120);

        const window = await tracker.previewRoom(ROOM);

        expect(window.topicId).toBe(TOPIC);
        expect(window.summary?.name).toBe('general');
        expect(window.state).toBe(WindowState.LATEST);
        expect(window.length).toBe(50);
        expect(window.getAt(window.length - 1)?.id).toBe('m120');
        expect(client.sent[1].data.location).toEqual({roomId: ROOM, topicId: TOPIC});
        expect(client.sent.map(entry => entry.type).every(type => ['GetRoomSummary', 'GetMessages', 'GetTopics'].includes(type))).toBe(true);
    });

    test('opens around a message and walks forward to the latest', async () => {
        const {tracker} = setup(300);

        const window = await tracker.previewRoom(ROOM, {around: 'm100'});

        expect(window.has('m100')).toBe(true);
        expect(window.state).toBe(WindowState.PAST);
        expect(window.hasLatest).toBe(false);

        while (! window.hasLatest) {
            await window.fetchNext();
        }

        expect(window.getAt(window.length - 1)?.id).toBe('m300');
    });

    test('goes back until the oldest message', async () => {
        const {tracker} = setup(120);
        const window = await tracker.previewRoom(ROOM);

        await window.fetchPrevious();
        await window.fetchPrevious();
        expect(window.length).toBe(120);
        expect(window.has('m001')).toBe(true);

        await window.fetchPrevious(); // The empty page tells it is the oldest
        expect(window.hasOldest).toBe(true);
    });

    test('reads the given topic instead of the default one', async () => {
        const {client, tracker} = setup(10);

        const window = await tracker.previewRoom(ROOM, {topicId: 'thread-1', spaceId: 's1'});

        expect(window.topicId).toBe('thread-1');
        expect(client.sent[0].data.location).toEqual({roomId: ROOM, spaceId: 's1'});
        expect(client.sent[1].data.location.topicId).toBe('thread-1');
    });

    test('refresh takes only the newer messages, and not more often than the interval', async () => {
        const {client, tracker} = setup(60);
        const window = await tracker.previewRoom(ROOM);
        const changes: unknown[] = [];
        window.on('change', ev => changes.push(ev));

        client.fill(65);
        await window.refresh();
        expect(window.getAt(window.length - 1)?.id).toBe('m060'); // Too soon

        window.refreshInterval = 0;
        await window.refresh();
        expect(window.getAt(window.length - 1)?.id).toBe('m065');
        expect(window.state).toBe(WindowState.LATEST);
        expect(changes.length).toBe(1);
        expect(client.sent.filter(entry => entry.type === 'GetMessages').pop()?.data.after).toBe('m060');
    });

    test('does not refresh a window that is not at the latest message', async () => {
        const {client, tracker} = setup(300);
        const window = await tracker.previewRoom(ROOM, {around: 'm100'});
        window.refreshInterval = 0;
        const before = client.count('GetMessages');

        await window.refresh();

        expect(client.count('GetMessages')).toBe(before);
    });

    test('mirrors share the data and the change events', async () => {
        const {tracker} = setup(10);
        const window = await tracker.previewRoom(ROOM);
        const mirror = window.createMirror();

        expect(mirror).not.toBe(window);
        expect(mirror).toBeInstanceOf(PreviewHistoryWindow);
        expect(mirror.length).toBe(10);
        expect(mirror.topicId).toBe(TOPIC);
    });

    test('a disposed window is empty and does nothing', async () => {
        const {client, tracker} = setup(60);
        const window = await tracker.previewRoom(ROOM);
        const before = client.sent.length;

        window.dispose();
        await window.resetToLatest(true);
        await window.fetchPrevious();
        await window.jumpTo('m010');
        await window.refresh();

        expect(window.isDisposed).toBe(true);
        expect(window.length).toBe(0);
        expect(client.sent.length).toBe(before);
    });

    test('does not fill a window disposed while the request was on', async () => {
        const {tracker} = setup(60);
        const window = new PreviewHistoryWindow(ROOM, TOPIC, tracker);

        const loading = window.load();
        window.dispose();
        await loading;

        expect(window.length).toBe(0);
    });

    test('fails with the code of the server error', async () => {
        const {client, tracker} = setup(10);
        client.error = {code: ErrorCode.UserNotFound, message: 'denied'};

        await expect(tracker.previewRoom(ROOM)).rejects.toMatchObject({name: 'RoomPreviewError', code: 'UserNotFoundException'});
    });

    test('fails when the server gives no topic to address the history with', async () => {
        const {client, tracker} = setup(10);
        client.summary = {...client.summary, defaultTopicId: null};

        const error = await tracker.previewRoom(ROOM).catch(e => e);
        expect(error).toBeInstanceOf(RoomPreviewError);
        expect(error.code).toBe('NoTopic');
        expect(client.count('GetMessages')).toBe(0);
    });
});

describe('PreviewRooms and SearchMessages permissions', () => {
    test('are defined with the bits of the server, on the space and room layers', () => {
        expect(Permissions.getByName('PreviewRooms')?.value).toBe(1 << 24);
        expect(Permissions.getByName('SearchMessages')?.value).toBe(1 << 25);

        for (const name of ['PreviewRooms', 'SearchMessages'] as const) {
            expect(Permissions.canBeDefinedOnLayer(name, Layer.Global)).toBe(true);
            expect(Permissions.canBeDefinedOnLayer(name, Layer.Space)).toBe(true);
            expect(Permissions.canBeDefinedOnLayer(name, Layer.Room)).toBe(true);
            expect(Permissions.canBeDefinedOnLayer(name, Layer.Topic)).toBe(false);
        }
    });

    test('Permissions.has reads a mask', () => {
        const mask = (1 << 24) | (1 << 9);
        expect(Permissions.has(mask, 'PreviewRooms')).toBe(true);
        expect(Permissions.has(mask, 'CreateMessages')).toBe(true);
        expect(Permissions.has(mask, 'SearchMessages')).toBe(false);
        expect(() => Permissions.has(mask, 'Nope' as any)).toThrow();
    });

    test('are checked on the server mask, without the membership', async () => {
        const {client, tracker} = setup(0);
        client.permissions = 1 << 24;

        expect(await tracker.permissions.canPreviewRoom(ROOM, 's1')).toBe(true);
        expect(await tracker.permissions.checkComputed(['PreviewRooms', 'SearchMessages'], {spaceId: 's1'}))
            .toEqual({ok: false, hasAll: false, hasAny: true, missing: ['SearchMessages']});
        expect(await tracker.permissions.getComputed({roomId: ROOM})).toBe(1 << 24);
    });

    test('a refusal of the server throws its error', async () => {
        const {client, tracker} = setup(0);
        client.error = {code: ErrorCode.UserNotFound, message: 'denied'};

        await expect(tracker.permissions.getComputed({roomId: ROOM})).rejects.toMatchObject({code: 'UserNotFoundException'});
    });
});

describe('rooms.isJoined', () => {
    test('is true only for a room of the session', async () => {
        const {client, tracker} = setup(0);
        client.emit('Session', {user: {id: 'me'}, state: {rooms: [{id: 'joined', history: {mode: 'Full'}}], spaces: [], spaceMembers: []}} as any);

        expect(await tracker.rooms.isJoined('joined')).toBe(true);
        expect(await tracker.rooms.isJoined(ROOM)).toBe(false);
    });
});

describe('ErrorCode', () => {
    test('carries the codes of the search and the access', () => {
        expect(ErrorCode.InvalidSearchQuery).toBe('InvalidSearchQueryException');
        expect(ErrorCode.MessageSearchUnavailable).toBe('MessageSearchUnavailableException');
        expect(ErrorCode.RoomNotFound).toBe('RoomNotFoundException');
        expect(ErrorCode.UserNotFound).toBe('UserNotFoundException');
        expect(ErrorCode.CommandRateLimitExceeded).toBe('CommandRateLimitExceededException');
    });
});
