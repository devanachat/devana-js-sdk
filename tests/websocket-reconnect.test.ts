import {WebSocketChatClient, WebSocketClientOptions} from "../src/WebSocketChatClient";

/**
 * Connection lifecycle of the WebSocket client: every loss of the connection
 * (error, connecting timeout, missing pong, closure with a code other than
 * 1000) must lead to another attempt after a delay, forever, until
 * `disconnect()` is called - without leaving any promise unsettled.
 */

class FakeWebSocket {
    public static instances: FakeWebSocket[] = [];

    public readonly CONNECTING = 0;
    public readonly OPEN = 1;
    public readonly CLOSING = 2;
    public readonly CLOSED = 3;

    public readyState = 0;
    public onmessage: ((ev: any) => void) | null = null;
    public onclose: ((ev: any) => void) | null = null;
    public onerror: ((ev: any) => void) | null = null;
    public readonly sent: any[] = [];
    public closedWith?: number;

    public constructor(public readonly url: string) {
        FakeWebSocket.instances.push(this);
    }

    public send(data: string): void {
        this.sent.push(JSON.parse(data));
    }

    public close(code: number): void {
        this.closedWith = code;
        // Like a dead TCP connection: the close event does not come (soon).
        this.readyState = this.CLOSING;
    }

    public receive(type: string, data: any = {}, ref?: string): void {
        this.onmessage?.({ data: JSON.stringify({ type, data, ref }) });
    }

    public authenticate(): void {
        this.readyState = this.OPEN;
        this.receive('Session', {});
    }

    public serverClose(code: number): void {
        this.readyState = this.CLOSED;
        this.onclose?.({ code });
    }

    public fail(): void {
        this.readyState = this.CLOSED;
        this.onerror?.({});
    }
}

const sockets = () => FakeWebSocket.instances;
const lastSocket = () => sockets()[sockets().length - 1];

const createClient = (options: Partial<WebSocketClientOptions> = {}) => {
    const client = new WebSocketChatClient({
        url: 'ws://test',
        token: 'token',
        stateTracking: false,
        connectingTimeoutMs: 5000,
        reconnect: { minDelayMs: 1000, maxDelayMs: 8000 },
        ...options,
    });
    const disconnects: boolean[] = [];
    const errors: string[] = [];
    client.on('disconnect', reconnect => disconnects.push(reconnect));
    client.on('error', error => errors.push(error.message));
    return { client, disconnects, errors };
};

const originalWebSocket = (global as any).WebSocket;

beforeEach(() => {
    FakeWebSocket.instances = [];
    (global as any).WebSocket = FakeWebSocket;
    jest.useFakeTimers({ doNotFake: ['nextTick', 'setImmediate', 'queueMicrotask'] });
    // Upper bound of the jitter - makes the delays exact.
    jest.spyOn(Math, 'random').mockReturnValue(1);
});

afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
    (global as any).WebSocket = originalWebSocket;
});

describe('retries with a delay', () => {
    test('failed attempts are spaced out with a growing, capped backoff', () => {
        const { client } = createClient();
        client.connect();

        for (const delay of [1000, 2000, 4000, 8000, 8000, 8000]) {
            const count = sockets().length;
            lastSocket().serverClose(1006);

            jest.advanceTimersByTime(delay - 1);
            expect(sockets().length).toBe(count);

            jest.advanceTimersByTime(1);
            expect(sockets().length).toBe(count + 1);
        }
    });

    test('keeps retrying indefinitely', () => {
        const { client } = createClient();
        client.connect();

        for (let i = 0; i < 200; i++) {
            lastSocket().serverClose(1006);
            // The scheduled retry is the only pending timer.
            expect(jest.getTimerCount()).toBe(1);
            jest.advanceTimersToNextTimer();
        }

        expect(sockets().length).toBe(201);
    });

    test('an error without a following close event still leads to a retry', () => {
        const { client, disconnects } = createClient();
        client.connect();

        sockets()[0].fail();
        expect(disconnects).toEqual([true]);

        jest.advanceTimersByTime(1000);
        expect(sockets().length).toBe(2);
    });

    test('the backoff starts over after a successful connection', () => {
        const { client } = createClient();
        client.connect();

        sockets()[0].serverClose(1006);
        jest.advanceTimersByTime(1000);
        sockets()[1].serverClose(1006);
        jest.advanceTimersByTime(2000);
        sockets()[2].authenticate();

        sockets()[2].serverClose(1006);
        jest.advanceTimersByTime(1000);
        expect(sockets().length).toBe(4);
    });

    test('a manual connect() during the backoff connects immediately, once', async () => {
        const { client } = createClient();
        client.connect();
        sockets()[0].serverClose(1006);

        const promise = client.connect();
        expect(sockets().length).toBe(2);

        jest.advanceTimersByTime(1000);
        expect(sockets().length).toBe(2);

        sockets()[1].authenticate();
        await expect(promise).resolves.toBeUndefined();
    });

    test('a jittered delay stays within 50-100% of the backoff', () => {
        (Math.random as jest.Mock).mockReturnValue(0);
        const { client } = createClient();
        client.connect();
        sockets()[0].serverClose(1006);

        jest.advanceTimersByTime(499);
        expect(sockets().length).toBe(1);
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(2);
    });
});

describe('connecting timeout', () => {
    test('abandons the attempt, schedules a retry and connect() resolves once a later attempt succeeds', async () => {
        const { client, disconnects, errors } = createClient();
        const promise = client.connect();
        const first = sockets()[0];

        jest.advanceTimersByTime(5000);

        expect(first.closedWith).toBe(3000);
        expect(first.onclose).toBeNull();
        expect(disconnects).toEqual([true]);
        expect(errors).toEqual(['Connection timeout']);

        jest.advanceTimersByTime(1000);
        expect(sockets().length).toBe(2);

        sockets()[1].authenticate();
        await expect(promise).resolves.toBeUndefined();
        expect(client.isReady).toBe(true);
    });

    test('repeated timeouts keep retrying', () => {
        const { client, errors } = createClient();
        client.connect();

        jest.advanceTimersByTime(5000 + 1000 + 5000 + 2000 + 5000 + 4000);

        expect(errors).toEqual(['Connection timeout', 'Connection timeout', 'Connection timeout']);
        expect(sockets().length).toBe(4);
    });
});

describe('abandoned sockets', () => {
    test('late events of an old socket do not affect the current connection', async () => {
        const { client, disconnects } = createClient({ ping: { noActivityTimeoutMs: 3000, pongBackTimeoutMs: 1000 } });
        client.connect();
        const stale = sockets()[0];
        const staleClose = stale.onclose!;
        const staleMessage = stale.onmessage!;

        jest.advanceTimersByTime(5000 + 1000); // timeout + retry
        const current = sockets()[1];
        current.authenticate();
        disconnects.length = 0;

        const command = client.send('GetSession', {});
        staleClose({ code: 1006 });
        staleMessage({ data: JSON.stringify({ type: 'Bye', data: {} }) });

        expect(disconnects).toEqual([]);
        expect(client.isReady).toBe(true);

        const ref = current.sent.find(envelope => envelope.type === 'GetSession').ref;
        current.receive('Session', { ok: true }, ref);
        await expect(command).resolves.toEqual({ data: { ok: true }, error: null });

        // The ping monitor of the current connection is still running.
        jest.advanceTimersByTime(3000);
        expect(current.sent.some(envelope => envelope.type === 'Ping')).toBe(true);
    });
});

describe('ping monitor', () => {
    test('a missing pong drops the connection immediately, without waiting for the close event', () => {
        const { client, disconnects } = createClient({ ping: { noActivityTimeoutMs: 1000, pongBackTimeoutMs: 500 } });
        client.connect();
        const first = sockets()[0];
        first.authenticate();

        jest.advanceTimersByTime(1000);
        expect(first.sent.map(envelope => envelope.type)).toEqual(['Ping']);

        jest.advanceTimersByTime(500);
        expect(first.closedWith).toBe(3000);
        expect(first.readyState).toBe(first.CLOSING);
        expect(disconnects).toEqual([true]);

        jest.advanceTimersByTime(1000);
        expect(sockets().length).toBe(2);
    });

    test('a received pong keeps the connection', () => {
        const { client } = createClient({ ping: { noActivityTimeoutMs: 1000, pongBackTimeoutMs: 500 } });
        client.connect();
        const first = sockets()[0];
        first.authenticate();

        jest.advanceTimersByTime(1000);
        first.receive('Pong', {}, first.sent[0].ref);
        jest.advanceTimersByTime(400);

        expect(first.closedWith).toBeUndefined();
        expect(client.isReady).toBe(true);
    });
});

describe('disconnect()', () => {
    test('while connecting: rejects connect() and pending commands, no timeout and no retry follow', async () => {
        const { client, disconnects, errors } = createClient();
        const promise = client.connect();
        const command = client.send('GetSession', {});

        client.disconnect();

        await expect(promise).rejects.toThrow('Client disconnected before authentication');
        await expect(command).rejects.toThrow('Client disconnected before the command was answered');
        expect(sockets()[0].closedWith).toBe(1000);
        expect(disconnects).toEqual([false]);

        jest.advanceTimersByTime(60000);
        expect(errors).toEqual([]);
        expect(sockets().length).toBe(1);
        expect(jest.getTimerCount()).toBe(0);
    });

    test('during the backoff: cancels the scheduled retry', async () => {
        const { client, disconnects } = createClient();
        const promise = client.connect();
        sockets()[0].serverClose(1006);

        client.disconnect();

        await expect(promise).rejects.toThrow('Client disconnected before authentication');
        expect(disconnects).toEqual([true, false]);
        jest.advanceTimersByTime(60000);
        expect(sockets().length).toBe(1);
    });

    test('when connected: stops the ping monitor and never reconnects', () => {
        const { client, disconnects } = createClient();
        client.connect();
        sockets()[0].authenticate();

        client.disconnect();

        expect(disconnects).toEqual([false]);
        expect(client.isReady).toBeFalsy();
        expect(jest.getTimerCount()).toBe(0);
    });

    test('connect() after disconnect() enables reconnecting again', async () => {
        const { client } = createClient();
        const first = client.connect();
        client.disconnect();
        await expect(first).rejects.toThrow('Client disconnected before authentication');

        client.connect();
        sockets()[1].serverClose(1006);
        jest.advanceTimersByTime(1000);
        expect(sockets().length).toBe(3);
    });

    test('without any connection does not emit anything', () => {
        const { client, disconnects } = createClient();
        client.disconnect();
        expect(disconnects).toEqual([]);
    });
});

describe('server closure', () => {
    test('a normal closure (1000) does not reconnect and rejects a pending connect()', async () => {
        const { client, disconnects } = createClient();
        const promise = client.connect();

        sockets()[0].serverClose(1000);

        await expect(promise).rejects.toThrow('Connection closed before authentication');
        expect(disconnects).toEqual([false]);
        jest.advanceTimersByTime(60000);
        expect(sockets().length).toBe(1);
    });

    test('an invalid token rejects connect() and stops reconnecting, whatever the close code', async () => {
        const { client, disconnects, errors } = createClient();
        const promise = client.connect();
        const bye = { reason: { type: 'Error', error: { code: 'AuthenticationException', message: 'Unauthorized' } } };

        sockets()[0].readyState = 1;
        sockets()[0].receive('Bye', bye);

        await expect(promise).rejects.toEqual(bye);
        expect(sockets()[0].closedWith).toBe(1000);
        expect(disconnects).toEqual([false]);
        expect(errors).toEqual(['Authentication rejected: Unauthorized']);

        // A late close of the rejected socket (e.g. 1006 through a proxy) is ignored.
        sockets()[0].onclose?.({ code: 1006 });
        jest.advanceTimersByTime(60000);
        expect(sockets().length).toBe(1);
        expect(jest.getTimerCount()).toBe(0);
    });

    test('an invalid token during an automatic reconnect stops retrying', () => {
        const { client, disconnects } = createClient();
        client.connect();
        sockets()[0].authenticate();

        sockets()[0].serverClose(1006);
        jest.advanceTimersByTime(1000);
        sockets()[1].readyState = 1;
        sockets()[1].receive('Bye', { reason: { type: 'Error', error: { code: 'AuthenticationException', message: 'Unauthorized' } } });

        expect(disconnects).toEqual([true, false]);
        jest.advanceTimersByTime(60000);
        expect(sockets().length).toBe(2);
    });

    test('a rejected automatic attempt does not cause an unhandled rejection', async () => {
        const unhandled: any[] = [];
        const listener = (reason: any) => unhandled.push(reason);
        process.on('unhandledRejection', listener);

        try {
            const { client } = createClient();
            await Promise.all([client.connect(), sockets()[0].authenticate()]);

            sockets()[0].serverClose(1006);
            jest.advanceTimersByTime(1000);
            sockets()[1].readyState = 1;
            sockets()[1].receive('Bye', { reason: 'Unauthorized' });
            client.disconnect();

            await new Promise(resolve => setImmediate(resolve));
            await new Promise(resolve => setImmediate(resolve));
            expect(unhandled).toEqual([]);
        } finally {
            process.off('unhandledRejection', listener);
        }
    });
});
