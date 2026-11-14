import {EventTarget} from "../src/EventTarget";
import {RoomsManager} from "../src/state-tracker/RoomsManager";
import {SpacesManager} from "../src/state-tracker/SpacesManager";

class FakeClient extends EventTarget {
    public async send(): Promise<{ data: any; error: any }> {
        return {data: undefined, error: null};
    }
}

const ROOM = 'E';
const TOPIC = 'topic-E';

const message = (id: string, overrides: any = {}): any => ({
    id,
    type: 'Text',
    content: id,
    location: {roomId: ROOM, topicId: TOPIC},
    author: {user: {id: 'other'}},
    reactions: [],
    ...overrides,
});

const setup = async () => {
    const client = new FakeClient();
    const tracker: any = {client, getMe: async () => ({id: 'me'})};
    tracker.rooms = new RoomsManager(tracker);
    tracker.spaces = new SpacesManager(tracker);

    // An ephemeral room keeps a live window without fetching history
    client.emit('Session', {
        serverVersion: '1.0.0',
        protoVersion: '1.0.0',
        user: {id: 'me'},
        state: {
            rooms: [{
                id: ROOM, spaceId: null, name: ROOM, description: '', type: 'Text',
                defaultTopic: {id: TOPIC, messageCount: 0, lastMessage: null},
                participants: null, recipients: null, flags: 0, stream: null, history: {mode: 'Ephemeral'},
            }],
            spaces: [],
        },
    } as any);

    const history = await tracker.rooms.messages.getRoomHistory(ROOM);
    const window = await history.getMessagesWindow(TOPIC);

    return {client, tracker, window};
};

describe('Replied messages', () => {
    test('a replied message fetched in the same page outlives its place in the window', async () => {
        const {window} = await setup();

        (window as any).storeRepliedMessages([message('m1'), message('m2', {replyTo: 'm1'})], []);
        (window as any).addItems([message('m2', {replyTo: 'm1'})], 'tail', null);

        expect(window.has('m1')).toBe(false);
        expect(window.getRepliedMessage(window.get('m2')).id).toBe('m1');
    });

    test('a fetched page drops a replied message deleted while its redaction was missed', async () => {
        const {client, window} = await setup();

        client.emit('NewMessage', {message: message('m2', {replyTo: 'm1'}), repliedMessage: message('m1')} as any);
        (window as any).storeRepliedMessages([message('m2', {replyTo: 'm1'})], []);

        expect(window.getRepliedMessage(window.get('m2'))).toBeNull();
    });
});

describe('MessageUpdated', () => {
    test('replaces the loaded message and the replied one kept beside a reply', async () => {
        const {client, window} = await setup();

        client.emit('NewMessage', {message: message('m1')} as any);
        client.emit('NewMessage', {message: message('m2', {replyTo: 'm1'}), repliedMessage: message('m1')} as any);
        client.emit('NewMessage', {message: message('m3', {replyTo: 'old'}), repliedMessage: message('old')} as any);

        client.emit('MessageUpdated', {message: message('m1', {content: 'poprawione', editedAt: '2026-11-12T10:00:00+00:00'})} as any);
        client.emit('MessageUpdated', {message: message('old', {content: 'stare poprawione'})} as any);

        expect(window.get('m1').content).toBe('poprawione');
        expect(window.getRepliedMessage(window.get('m2')).content).toBe('poprawione');
        expect(window.getRepliedMessage(window.get('m3')).content).toBe('stare poprawione');
        expect(window.has('old')).toBe(false);
        expect(window.items.map((m: any) => m.id)).toEqual(['m1', 'm2', 'm3']);
    });

    test('updates the last message of the topic', async () => {
        const {client, tracker} = await setup();

        client.emit('NewMessage', {message: message('m1')} as any);
        client.emit('MessageUpdated', {message: message('m1', {embed: {type: 'Link', root: [], flags: 0}})} as any);

        const topics = await tracker.rooms.getTopics(ROOM);
        expect(topics.get(TOPIC).lastMessage.embed.type).toBe('Link');
    });

    test('an edit of a loaded original refreshes its replies', async () => {
        const {client, window} = await setup();
        const changed: string[][] = [];

        client.emit('NewMessage', {message: message('m1')} as any);
        client.emit('NewMessage', {message: message('m2', {replyTo: 'm1'})} as any);
        window.on('change', (ev: any) => changed.push(ev.setItems));
        client.emit('MessageUpdated', {message: message('m1', {content: 'poprawione'})} as any);

        expect(changed.flat()).toContain('m2');
    });

    test('updates the original message of a side topic', async () => {
        const {client, tracker} = await setup();
        const topics = await tracker.rooms.getTopics(ROOM);
        topics.set({id: 'side', messageCount: 0, lastMessage: null, refMessage: message('m1', {topicRef: 'side'})});

        client.emit('MessageUpdated', {message: message('m1', {topicRef: 'side', content: 'poprawione'})} as any);

        expect(topics.get('side').refMessage.content).toBe('poprawione');
    });

    test('a restored window keeps the saved replied messages', async () => {
        const {window} = await setup();

        window._restoreLatest([message('m2', {replyTo: 'm1'})], {}, [message('m1')]);

        expect(window.getRepliedMessage(window.get('m2')).id).toBe('m1');
    });

    test('a deleted message leaves its replies without the replied one', async () => {
        const {client, window} = await setup();

        client.emit('NewMessage', {message: message('m1')} as any);
        client.emit('NewMessage', {message: message('m2', {replyTo: 'old'}), repliedMessage: message('old')} as any);
        client.emit('NewMessage', {message: message('m3', {replyTo: 'm1'}), repliedMessage: message('m1')} as any);
        client.emit('MessagesRedacted', {location: {roomId: ROOM, topicId: TOPIC}, ids: ['old', 'm1']} as any);
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(window.getRepliedMessage(window.get('m2'))).toBeNull();
        expect(window.getRepliedMessage(window.get('m3'))).toBeNull();
    });
});

describe('Ephemeral messages', () => {
    test('show in the window without counting or becoming the last message of the topic', async () => {
        const {client, tracker, window} = await setup();

        client.emit('NewMessage', {message: message('m1')} as any);
        client.emit('NewMessage', {message: message('e1', {type: 'Ephemeral', author: {user: {id: 'bot', tags: ['bot']}}})} as any);

        const topic = (await tracker.rooms.getTopics(ROOM)).get(TOPIC);
        expect(window.has('e1')).toBe(true);
        expect(topic.messageCount).toBe(1);
        expect(topic.lastMessage.id).toBe('m1');
    });
});
