import {EventTarget} from "../src/EventTarget";
import {SavedItemsManager} from "../src/state-tracker/SavedItemsManager";
import {Message, SavedItem} from "../src/protocol";

interface Server {
    items: SavedItem[];
    messages: Message[];
    error?: { code: string } | null;
}

class FakeClient extends EventTarget {
    public readonly sent: [string, any][] = [];

    public constructor(public server: Server) {
        super();
    }

    public async send(type: string, data: any): Promise<{ data: any; error: any }> {
        this.sent.push([type, data]);
        await Promise.resolve();

        if (this.server.error) {
            return { data: null, error: this.server.error };
        }

        return {
            data: {
                items: this.server.items,
                messages: data.withMessages ? this.server.messages : [],
            },
            error: null,
        };
    }
}

const room = (id: string, savedAt = '2026-11-25T10:00:00.000Z'): SavedItem => ({ type: 'Room', id, roomId: id, savedAt });
const message = (id: string, roomId = 'r1', savedAt = '2026-11-25T11:00:00.000Z'): SavedItem => ({ type: 'Message', id, roomId, savedAt });
const content = (id: string, text = 'hello'): Message => ({ id, content: text } as Message);

const createManager = (server: Server = { items: [], messages: [] }) => {
    const client = new FakeClient(server);
    const manager = new SavedItemsManager({ client } as any);
    return { client, manager };
};

const commands = (client: FakeClient) => client.sent.map(([, data]) => data);

const tick = () => new Promise(resolve => setTimeout(resolve, 0));

describe('saved items', () => {
    test('nothing is fetched until asked for, also after a session', async () => {
        const { client } = createManager();

        client.emit('Session', {});
        await tick();

        expect(client.sent).toHaveLength(0);
    });

    test('get() fetches the ids once and resolves with the same collection', async () => {
        const { client, manager } = createManager({ items: [room('r1'), message('m1')], messages: [content('m1')] });

        const [first, second] = await Promise.all([manager.get(), manager.get()]);

        expect(first).toBe(second);
        expect(commands(client)).toEqual([{ withMessages: false }]);
        expect(first.items.map(item => item.id).sort()).toEqual(['m1', 'r1']);
    });

    test('getMessages() after get() fetches the contents once and reconciles the same items', async () => {
        const server = { items: [room('r1')], messages: [] as Message[] };
        const { client, manager } = createManager(server);
        const items = await manager.get();

        server.items = [room('r1'), message('m1')];
        server.messages = [content('m1')];
        const messages = await manager.getMessages();
        await manager.getMessages();

        expect(await manager.get()).toBe(items);
        expect(items.has('Message:m1')).toBe(true);
        expect(messages.get('m1')).toEqual(content('m1'));
        expect(commands(client)).toEqual([{ withMessages: false }, { withMessages: true }]);
    });

    test('get(true) fetches the contents along, so getMessages() sends nothing', async () => {
        const { client, manager } = createManager({ items: [message('m1')], messages: [content('m1')] });

        await manager.get(true);
        const messages = await manager.getMessages();

        expect(messages.has('m1')).toBe(true);
        expect(commands(client)).toEqual([{ withMessages: true }]);
    });

    test('get(true) after get() asks once more, for the contents', async () => {
        const { client, manager } = createManager({ items: [message('m1')], messages: [content('m1')] });

        const items = await manager.get();
        expect(await manager.get(true)).toBe(items);
        await manager.get(true);

        expect(commands(client)).toEqual([{ withMessages: false }, { withMessages: true }]);
    });

    test('concurrent get() and getMessages() send one request each at most', async () => {
        const { client, manager } = createManager({ items: [message('m1')], messages: [content('m1')] });

        await Promise.all([manager.getMessages(), manager.get(), manager.get(true), manager.getMessages()]);

        expect(commands(client)).toEqual([{ withMessages: true }]);
    });

    test('a session refetches only what was fetched, in place', async () => {
        const server = { items: [room('r1'), room('r2')], messages: [] as Message[] };
        const { client, manager } = createManager(server);
        const items = await manager.get();
        const changes: any[] = [];
        items.on('change', ev => changes.push(ev));

        server.items = [room('r2'), room('r3')];
        client.emit('Session', {});
        expect(await manager.get()).toBe(items);

        expect(commands(client)).toEqual([{ withMessages: false }, { withMessages: false }]);
        expect(items.items.map(item => item.id).sort()).toEqual(['r2', 'r3']);
        expect(changes).toHaveLength(1);
        expect(changes[0].deletedItems).toEqual(['Room:r1']);
    });

    test('a session refetches the contents when they were fetched', async () => {
        const server = { items: [message('m1')], messages: [content('m1')] };
        const { client, manager } = createManager(server);
        const messages = await manager.getMessages();

        server.messages = [content('m1', 'edited')];
        client.emit('Session', {});
        await manager.get();

        expect(commands(client)).toEqual([{ withMessages: true }, { withMessages: true }]);
        expect(messages.get('m1')?.content).toBe('edited');
    });

    test('ItemSaved and ItemUnsaved change a fetched list only', async () => {
        const { client, manager } = createManager();

        client.emit('ItemSaved', { item: room('r1'), message: null });
        const items = await manager.get();
        expect(items.length).toBe(0);

        client.emit('ItemSaved', { item: message('m1'), message: content('m1') });
        expect(items.has('Message:m1')).toBe(true);

        client.emit('ItemUnsaved', { type: 'Message', id: 'm1' });
        expect(items.length).toBe(0);
    });

    test('a saved message brings its content once the contents are fetched', async () => {
        const { client, manager } = createManager();
        const messages = await manager.getMessages();

        client.emit('ItemSaved', { item: message('m1'), message: content('m1') });

        expect(messages.get('m1')).toEqual(content('m1'));
    });

    test('a failed command leaves the list as it was', async () => {
        const server: Server = { items: [room('r1')], messages: [] };
        const { client, manager } = createManager(server);
        const items = await manager.get();

        server.error = { code: 'SavedItemsLimitReachedException' };
        const result = await client.send('SaveItem', { type: 'Room', id: 'r2' });

        expect(result.error.code).toBe('SavedItemsLimitReachedException');
        expect(items.items.map(item => item.id)).toEqual(['r1']);
    });

    test('edits and deletions of saved messages are followed', async () => {
        const { client, manager } = createManager({ items: [message('m1'), message('m2')], messages: [content('m1'), content('m2')] });
        const items = await manager.get();
        const messages = await manager.getMessages();

        client.emit('MessageUpdated', { message: content('m1', 'edited') });
        client.emit('MessageUpdated', { message: content('other', 'not saved') });
        client.emit('MessagesRedacted', { location: { roomId: 'r1' }, ids: ['m2'] });

        expect(messages.get('m1')?.content).toBe('edited');
        expect(messages.has('other')).toBe(false);
        expect(items.has('Message:m2')).toBe(false);
        expect(messages.has('m2')).toBe(false);
    });

    test('leaving a room hides its items and rejoining brings them back with one request', async () => {
        const server = { items: [room('r1'), message('m1', 'r1'), room('r2'), room('r3')], messages: [] as Message[] };
        const { client, manager } = createManager(server);
        const items = await manager.get();

        client.emit('RoomLeft', { id: 'r1', reason: { type: 'Leave' } });
        client.emit('RoomLeft', { id: 'r2', reason: { type: 'Leave' } });
        expect(items.items.map(item => item.id)).toEqual(['r3']);

        client.emit('RoomJoined', { room: { id: 'other' } });
        client.emit('RoomJoined', { room: { id: 'r1' } });
        client.emit('RoomJoined', { room: { id: 'r2' } });
        await tick();
        await manager.get();

        expect(commands(client)).toEqual([{ withMessages: false }, { withMessages: false }]);
        expect(items.length).toBe(4);
    });

    test('joining a room without hidden items fetches nothing', async () => {
        const { client, manager } = createManager({ items: [room('r1')], messages: [] });
        await manager.get();

        client.emit('RoomJoined', { room: { id: 'r2' } });
        await tick();

        expect(client.sent).toHaveLength(1);
    });

    test('a deleted room takes its items away', async () => {
        const { client, manager } = createManager({ items: [room('r1'), message('m1', 'r1'), room('r2')], messages: [content('m1')] });
        const items = await manager.get();
        const messages = await manager.getMessages();

        client.emit('RoomDeleted', { id: 'r1' });

        expect(items.items.map(item => item.id)).toEqual(['r2']);
        expect(messages.length).toBe(0);
    });

    test('isSaved() answers from the fetched list', async () => {
        const { manager } = createManager({ items: [room('r1')], messages: [] });

        expect(await manager.isSaved('Room', 'r1')).toBe(true);
        expect(await manager.isSaved('Message', 'r1')).toBe(false);
    });
});
