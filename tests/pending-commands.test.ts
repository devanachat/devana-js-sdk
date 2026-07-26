import {PromiseRegistry} from "../src/state-tracker/AsyncUtils";
import {AbstractChatClient} from "../src/AbstractChatClient";
import {TraversableRemoteCollection, WindowState} from "../src/state-tracker/TopicHistoryWindow";
import {Envelope} from "../src/types/src";

/**
 * A command issued while the client is offline (or one that is still in flight
 * when the socket drops) must always settle. Leaving it pending strands every
 * caller awaiting it - including the state tracker's cached lookups and the
 * history window's `ongoing` guard, which would keep a view stuck on a loader
 * (or permanently empty) even after a successful reconnect.
 */

class TestableChatClient extends AbstractChatClient {
    public async send(type: any, data: any): Promise<any> {
        const envelope = this.createEnvelope(type, data);
        return this.createPromiseFromCommandEnvelope(envelope as any);
    }

    public respond(ref: string, type: string, data: any): void {
        this.handleIncomingEnvelope({ ref, type, data } as Envelope);
    }

    public dropConnection(error: Error): void {
        this.failAwaitingResponses(error);
    }

    public get pendingCount(): number {
        return this.awaitingResponse.size;
    }
}

describe('pending commands settle on connection loss', () => {
    test('in-flight commands reject instead of hanging forever', async () => {
        const client = new TestableChatClient();

        const first = client.send('GetMessages', {});
        const second = client.send('GetRoomMembers', {});

        expect(client.pendingCount).toBe(2);

        client.dropConnection(new Error('Connection closed'));

        await expect(first).rejects.toThrow('Connection closed');
        await expect(second).rejects.toThrow('Connection closed');
        expect(client.pendingCount).toBe(0);
    });

    test('commands answered before the drop are unaffected', async () => {
        const client = new TestableChatClient();

        const answered = client.send('GetMessages', {});
        client.respond('1', 'Messages', { messages: [] });

        const inFlight = client.send('GetRoomMembers', {});
        client.dropConnection(new Error('Connection closed'));

        await expect(answered).resolves.toEqual({ data: { messages: [] }, error: null });
        await expect(inFlight).rejects.toThrow('Connection closed');
    });
});

describe('PromiseRegistry does not cache failures', () => {
    test('a rejected lookup is forgotten so the next access retries', async () => {
        const registry = new PromiseRegistry();
        let attempts = 0;

        const run = async () => {
            registry.registerByFunction(async () => {
                attempts++;
                if (attempts === 1) {
                    throw new Error('offline');
                }
                return 'ok';
            }, 'key');

            return registry.get('key');
        };

        // First attempt fails while "offline".
        await expect(run()).rejects.toThrow('offline');

        // The failed entry must not be cached, otherwise every later access
        // would replay the same rejection forever.
        expect(registry.notExist('key')).toBe(true);

        await expect(run()).resolves.toBe('ok');
        expect(attempts).toBe(2);
    });

    test('a successful lookup stays cached', async () => {
        const registry = new PromiseRegistry();
        let attempts = 0;

        registry.registerByFunction(async () => {
            attempts++;
            return 'ok';
        }, 'key');

        await registry.get('key');

        expect(registry.has('key')).toBe(true);
        expect(attempts).toBe(1);
    });

    test('a newer entry for the same key is not dropped by an older failure', async () => {
        const registry = new PromiseRegistry();

        const failing = Promise.reject(new Error('offline'));
        registry.register(failing, 'key');
        await expect(registry.get('key')).rejects.toThrow('offline');

        const succeeding = Promise.resolve('ok');
        registry.register(succeeding, 'key');

        // Let the older rejection's cleanup handler run.
        await new Promise(resolve => setTimeout(resolve, 0));

        expect(registry.has('key')).toBe(true);
        await expect(registry.get('key')).resolves.toBe('ok');
    });
});

describe('history window survives a failed fetch', () => {
    interface SimpleMessage { id: number }

    class FlakyWindow extends TraversableRemoteCollection<SimpleMessage> {
        public shouldFail = false;

        public constructor() {
            super('id');
        }

        public createMirror(): TraversableRemoteCollection<SimpleMessage> {
            throw new Error('Method not implemented.');
        }

        protected async fetchLatestItems(): Promise<SimpleMessage[]> {
            if (this.shouldFail) {
                throw new Error('Connection closed before the command was answered');
            }
            return [{ id: 1 }, { id: 2 }];
        }

        protected async fetchItemsBefore(): Promise<SimpleMessage[] | null> { return []; }
        protected async fetchItemsAfter(): Promise<SimpleMessage[] | null> { return []; }
        protected async fetchItemsAround(): Promise<SimpleMessage[] | null> { return []; }
        protected async isLatestItemLoaded(): Promise<boolean> { return true; }
    }

    test('a rejected fetch leaves the window reusable, not permanently blocked', async () => {
        const window = new FlakyWindow();

        // Simulates opening a room while the client is offline.
        window.shouldFail = true;
        await expect(window.resetToLatest()).rejects.toThrow('Connection closed');

        // The failure must not leave the internal `ongoing` guard set, which
        // would make every later fetch a silent no-op and strand the view on an
        // empty window after the reconnect.
        expect(window.state).toBe(WindowState.LIVE);
        expect(window.length).toBe(0);

        // Retry after reconnecting must actually fetch.
        window.shouldFail = false;
        await window.resetToLatest();

        expect(window.state).toBe(WindowState.LATEST);
        expect(window.items.map(item => item.id)).toEqual([1, 2]);
    });
})
