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
    public onopen: ((ev: any) => void) | null = null;
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

    public open(): void {
        this.readyState = this.OPEN;
        this.onopen?.({});
    }

    public authenticate(): void {
        this.open();
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
        // Nothing answers pings here; the ping tests pass their own settings.
        ping: { enabled: false },
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

    test('the backoff starts over only after the connection has been stable', () => {
        const { client } = createClient();
        client.connect();

        sockets()[0].serverClose(1006);
        jest.advanceTimersByTime(1000);
        sockets()[1].serverClose(1006);
        jest.advanceTimersByTime(2000);

        // Authenticated, then dropped soon after: the backoff goes on.
        sockets()[2].authenticate();
        jest.advanceTimersByTime(29999);
        sockets()[2].serverClose(1006);
        jest.advanceTimersByTime(3999);
        expect(sockets().length).toBe(3);
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(4);

        sockets()[3].authenticate();
        jest.advanceTimersByTime(30000);
        sockets()[3].serverClose(1006);
        jest.advanceTimersByTime(1000);
        expect(sockets().length).toBe(5);
    });

    test('the stable connection period can be configured', () => {
        const { client } = createClient({ reconnect: { minDelayMs: 1000, maxDelayMs: 8000, stableConnectionMs: 5000 } });
        client.connect();

        sockets()[0].serverClose(1006);
        jest.advanceTimersByTime(1000);
        sockets()[1].authenticate();
        jest.advanceTimersByTime(5000);
        sockets()[1].serverClose(1006);
        jest.advanceTimersByTime(1000);
        expect(sockets().length).toBe(3);
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

    test.each([
        [0, 0],
        [0.25, 2000],
        [0.999, 7992],
    ])('a delay is spread over the whole backoff (random %p -> %p ms)', (random, expected) => {
        (Math.random as jest.Mock).mockReturnValue(random);
        const { client } = createClient();
        client.connect();
        for (let i = 0; i < 3; i++) {
            lastSocket().serverClose(1006);
            jest.advanceTimersToNextTimer();
        }
        lastSocket().serverClose(1006);

        if (expected > 0) {
            jest.advanceTimersByTime(expected - 1);
            expect(sockets().length).toBe(4);
        }
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(5);
    });

    test.each([1001, 1012])('a closure by the server (%p) starts with the longer delay', code => {
        const { client } = createClient({ reconnect: { minDelayMs: 1000, serverCloseMinDelayMs: 4000, maxDelayMs: 30000 } });
        client.connect();
        sockets()[0].authenticate();

        sockets()[0].serverClose(code);
        jest.advanceTimersByTime(3999);
        expect(sockets().length).toBe(1);
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(2);

        // The server is still down - a refused attempt keeps the longer backoff.
        sockets()[1].fail();
        jest.advanceTimersByTime(7999);
        expect(sockets().length).toBe(2);
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(3);
    });

    test('a closure after a Bye starts with the longer delay', () => {
        const { client } = createClient();
        client.connect();
        sockets()[0].authenticate();

        sockets()[0].receive('Bye', { reason: { type: 'Kick', kick: 'x' } });
        sockets()[0].serverClose(4000);
        jest.advanceTimersByTime(4999);
        expect(sockets().length).toBe(1);
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(2);
    });

    test('a lost connection keeps the fast first retry, with a 5 s default after a server closure', () => {
        const { client } = createClient({ reconnect: undefined });
        client.connect();
        sockets()[0].authenticate();

        sockets()[0].serverClose(1006);
        jest.advanceTimersByTime(1000);
        expect(sockets().length).toBe(2);

        sockets()[1].authenticate();
        jest.advanceTimersByTime(30000);
        sockets()[1].serverClose(1012);
        jest.advanceTimersByTime(4999);
        expect(sockets().length).toBe(2);
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(3);
        client.disconnect();
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

    test('an open socket waits for Session longer than for opening', async () => {
        const { client, errors } = createClient({ connectingTimeoutMs: 5000, sessionTimeoutMs: 60000 });
        const promise = client.connect();

        jest.advanceTimersByTime(4000);
        sockets()[0].open();
        jest.advanceTimersByTime(59999);
        expect(errors).toEqual([]);
        expect(sockets().length).toBe(1);

        sockets()[0].receive('Session', {});
        await expect(promise).resolves.toBeUndefined();
        jest.advanceTimersByTime(120000);
        expect(errors).toEqual([]);
    });

    test('a server that never sends Session times out after the session timeout', () => {
        const { client, errors } = createClient({ connectingTimeoutMs: 5000 });
        client.connect();
        sockets()[0].open();

        jest.advanceTimersByTime(59999);
        expect(errors).toEqual([]);
        jest.advanceTimersByTime(1);
        expect(errors).toEqual(['Connection timeout']);
        expect(sockets()[0].closedWith).toBe(3000);

        jest.advanceTimersByTime(1000);
        expect(sockets().length).toBe(2);
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

describe('a listener disconnecting', () => {
    test('from a Service Bye ends with a single disconnect(false) and no retry', () => {
        const { client, disconnects } = createClient();
        client.on('Bye', () => client.disconnect());
        client.connect();
        sockets()[0].authenticate();

        sockets()[0].receive('Bye', { reason: { type: 'Service', service: 'Server termination' }, retryAfterMs: 1000 });
        jest.advanceTimersByTime(60000);

        expect(disconnects).toEqual([false]);
        expect(sockets().length).toBe(1);
    });

    test('from Session leaves the client disconnected, without a connect event', () => {
        const { client, disconnects } = createClient({ ping: { enabled: true } });
        const connects: number[] = [];
        client.on('connect', () => connects.push(1));
        client.on('Session', () => client.disconnect());
        client.connect().catch(() => undefined);

        sockets()[0].authenticate();
        jest.advanceTimersByTime(60000);

        expect(connects).toEqual([]);
        expect(disconnects).toEqual([false]);
        expect(client.isReady).toBeFalsy();
        expect(sockets().length).toBe(1);
        expect(sockets()[0].sent).toEqual([]);
    });
});

describe('Bye', () => {
    const serviceBye = (retryAfterMs?: unknown) => ({ reason: { type: 'Service', service: 'Server termination' }, retryAfterMs });

    test('a Service Bye reconnects even when the server closes with 1000, after Bye and disconnect(true) in that order', () => {
        const { client } = createClient();
        const events: string[] = [];
        client.on('Bye', () => events.push('Bye'));
        client.on('disconnect', reconnect => events.push(`disconnect(${reconnect})`));
        client.connect();
        sockets()[0].authenticate();

        sockets()[0].receive('Bye', serviceBye());
        sockets()[0].serverClose(1000);

        expect(events).toEqual(['Bye', 'disconnect(true)']);
        expect(client.isReady).toBeFalsy();
        jest.advanceTimersByTime(4999);
        expect(sockets().length).toBe(1);
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(2);
    });

    test('the retry waits retryAfterMs exactly, with no jitter of its own', () => {
        (Math.random as jest.Mock).mockReturnValue(0);
        const { client } = createClient();
        client.connect();
        sockets()[0].authenticate();

        sockets()[0].receive('Bye', serviceBye(7300));
        sockets()[0].serverClose(1012);

        jest.advanceTimersByTime(7299);
        expect(sockets().length).toBe(1);
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(2);
    });

    test('retryAfterMs is capped at 60 s', () => {
        const { client } = createClient();
        client.connect();
        sockets()[0].authenticate();

        sockets()[0].receive('Bye', serviceBye(3600000));

        jest.advanceTimersByTime(59999);
        expect(sockets().length).toBe(1);
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(2);
    });

    test.each([0, -5, '5000', null, 1e400])('an invalid retryAfterMs (%p) falls back to the server closure backoff', retryAfterMs => {
        const { client } = createClient();
        client.connect();
        sockets()[0].authenticate();

        sockets()[0].receive('Bye', serviceBye(retryAfterMs));

        jest.advanceTimersByTime(4999);
        expect(sockets().length).toBe(1);
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(2);
    });

    test('the hint applies only to the next retry; a failed one continues the server closure backoff', () => {
        const { client } = createClient({ reconnect: { minDelayMs: 1000, maxDelayMs: 30000 } });
        client.connect();
        sockets()[0].authenticate();

        sockets()[0].receive('Bye', serviceBye(2000));
        jest.advanceTimersByTime(2000);
        expect(sockets().length).toBe(2);

        sockets()[1].fail();
        jest.advanceTimersByTime(9999);
        expect(sockets().length).toBe(2);
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(3);
    });

    test('a Bye with retryAfterMs followed by an abnormal closure waits retryAfterMs', () => {
        const { client } = createClient();
        client.connect();
        sockets()[0].authenticate();

        sockets()[0].receive('Bye', { reason: { type: 'Error', error: { code: 'SomeException', message: 'x' } }, retryAfterMs: 3000 });
        sockets()[0].serverClose(1006);

        jest.advanceTimersByTime(2999);
        expect(sockets().length).toBe(1);
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(2);
    });

    test('a Service Bye rejects pending commands', async () => {
        const { client } = createClient();
        client.connect();
        sockets()[0].authenticate();
        const command = client.send('GetSession', {});

        sockets()[0].receive('Bye', serviceBye(1000));

        await expect(command).rejects.toThrow('Connection closed before the command was answered');
    });

    test('a Service Bye to a connection waiting for Session keeps connect() pending until a retry authenticates', async () => {
        const { client } = createClient();
        const promise = client.connect();
        const command = client.send('GetSession', {});
        sockets()[0].open();

        sockets()[0].receive('Bye', serviceBye(1500));
        await expect(command).rejects.toThrow('Connection closed before the command was answered');

        jest.advanceTimersByTime(1500);
        sockets()[1].authenticate();
        await expect(promise).resolves.toBeUndefined();
    });

    test('disconnect() during the wait cancels the retry', () => {
        const { client, disconnects } = createClient();
        client.connect();
        sockets()[0].authenticate();

        sockets()[0].receive('Bye', serviceBye(5000));
        client.disconnect();

        expect(disconnects).toEqual([true, false]);
        jest.advanceTimersByTime(60000);
        expect(sockets().length).toBe(1);
    });

    test.each([
        ['Kick', { type: 'Kick', kick: 'x' }],
        ['Ban', { type: 'Ban', ban: {} }],
        ['Leave', { type: 'Leave' }],
    ])('a %s Bye followed by a normal closure does not reconnect', (_, reason) => {
        const { client, disconnects } = createClient();
        client.connect();
        sockets()[0].authenticate();

        sockets()[0].receive('Bye', { reason });
        sockets()[0].serverClose(1000);

        expect(disconnects).toEqual([false]);
        jest.advanceTimersByTime(60000);
        expect(sockets().length).toBe(1);
    });

    test('an AuthenticationException Bye stops reconnecting even with retryAfterMs', async () => {
        const { client, disconnects, errors } = createClient();
        const promise = client.connect();
        const bye = { reason: { type: 'Error', error: { code: 'AuthenticationException', message: 'Unauthorized' } }, retryAfterMs: 3000 };
        sockets()[0].open();

        sockets()[0].receive('Bye', bye);

        await expect(promise).rejects.toEqual(bye);
        expect(disconnects).toEqual([false]);
        expect(errors).toEqual(['Authentication rejected: Unauthorized']);
        jest.advanceTimersByTime(60000);
        expect(sockets().length).toBe(1);
    });
});

describe('ServiceUnavailableException Bye', () => {
    const unavailableBye = (retryAfterMs?: number) => ({
        reason: { type: 'Error', error: { code: 'ServiceUnavailableException', message: 'Service is temporary unavailable, please try again later' } },
        retryAfterMs,
    });

    test.each([1013, 1000])('reconnects after retryAfterMs whatever the close code (%p), Bye before disconnect(true), no error', code => {
        (Math.random as jest.Mock).mockReturnValue(0);
        const { client, errors } = createClient();
        const events: string[] = [];
        client.on('Bye', () => events.push('Bye'));
        client.on('disconnect', reconnect => events.push(`disconnect(${reconnect})`));
        client.connect();
        sockets()[0].open();

        sockets()[0].receive('Bye', unavailableBye(4200));
        sockets()[0].serverClose(code);

        expect(events).toEqual(['Bye', 'disconnect(true)']);
        expect(errors).toEqual([]);
        jest.advanceTimersByTime(4199);
        expect(sockets().length).toBe(1);
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(2);
    });

    test('a pending connect() stays pending until the retry authenticates', async () => {
        const { client } = createClient();
        const promise = client.connect();
        let settled = false;
        promise.then(() => settled = true, () => settled = true);
        sockets()[0].open();

        sockets()[0].receive('Bye', unavailableBye(2000));
        await Promise.resolve();
        expect(settled).toBe(false);

        jest.advanceTimersByTime(2000);
        sockets()[1].authenticate();
        await expect(promise).resolves.toBeUndefined();
    });

    test('without retryAfterMs it uses the server closure backoff', () => {
        const { client } = createClient();
        client.connect();
        sockets()[0].open();

        sockets()[0].receive('Bye', unavailableBye());

        jest.advanceTimersByTime(4999);
        expect(sockets().length).toBe(1);
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(2);
    });

    test('a close with 1013 alone starts with the longer delay', () => {
        const { client } = createClient();
        client.connect();
        sockets()[0].authenticate();

        sockets()[0].serverClose(1013);

        jest.advanceTimersByTime(4999);
        expect(sockets().length).toBe(1);
        jest.advanceTimersByTime(1);
        expect(sockets().length).toBe(2);
    });
});
