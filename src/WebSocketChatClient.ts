import {ObservableInterface} from "./EventTarget";
import {AbstractChatClient, CommandRequest, CommandResult, CommandResponse, CommandsMap, EventsMap} from "./AbstractChatClient";
import {ChatStateTracker} from "./state-tracker/ChatStateTracker";
import {Bye, Envelope} from "./protocol";

export interface WebSocketClientOptions {
    url: string;
    token: string;
    /**
     * Time an attempt may take until the socket opens. Default is 10 seconds.
     */
    connectingTimeoutMs?: number;
    /**
     * Time to wait for `Session` once the socket is open. The server may hold a connection in a queue before
     * authenticating it when many clients connect at once, so this is longer than `connectingTimeoutMs`.
     * Default is 60 seconds.
     */
    sessionTimeoutMs?: number;
    awaitQueueSendDelayMs?: number;
    stateTracking?: boolean;
    queryParams?: Record<string, string>;
    /**
     * Ping/pong configuration, enabled by default.
     */
    ping?: {
        enabled?: boolean;
        /**
         * Time without activity after which a ping will be sent. Default is 15 seconds.
         */
        noActivityTimeoutMs?: number;
        /**
         * Time to wait for a pong response before considering the connection dead. Default is 5 seconds.
         */
        pongBackTimeoutMs?: number;
    },
    /**
     * Automatic reconnection. After the connection is lost (error, connecting timeout, missing pong
     * or closure with a code other than 1000) the client retries indefinitely, waiting between attempts
     * a random time up to an exponentially growing limit. Calling `disconnect()` stops retrying until
     * the next `connect()`.
     */
    reconnect?: {
        /**
         * Limit of the first delay after a lost connection; each subsequent one doubles it. Default is 1 second.
         */
        minDelayMs?: number;
        /**
         * Limit of the first delay when the server closed the connection (close code 1001, 1012 or 1013, or after
         * a `Bye`); each subsequent one doubles it. Default is 5 seconds. It wins over a lower `maxDelayMs`.
         */
        serverCloseMinDelayMs?: number;
        /**
         * Upper limit of the delay between retries. Default is 30 seconds.
         */
        maxDelayMs?: number;
        /**
         * Time an authenticated connection has to last for the next loss to start the backoff over.
         * Default is 30 seconds.
         */
        stableConnectionMs?: number;
    },
}

const MAX_RETRY_AFTER_MS = 60000;
// Going Away, Service Restart, Try Again Later
const SERVER_CLOSE_CODES = [1001, 1012, 1013];

function normalizeRetryAfter(retryAfterMs: unknown): number | undefined {
    return typeof retryAfterMs === 'number' && Number.isFinite(retryAfterMs) && retryAfterMs > 0
        ? Math.min(retryAfterMs, MAX_RETRY_AFTER_MS)
        : undefined;
}

enum WebSocketChatClientEvent {
    connect = 'connect',
    disconnect = 'disconnect',
    message = 'message',
    error = 'error',
}

type WebSocketEventMap = EventsMap & {
    [WebSocketChatClientEvent.connect]: void;
    [WebSocketChatClientEvent.disconnect]: boolean;
    [WebSocketChatClientEvent.message]: Envelope;
    [WebSocketChatClientEvent.error]: Error;
};

export class WebSocketChatClient extends AbstractChatClient<Pick<WebSocketEventMap, keyof WebSocketEventMap>> implements ObservableInterface {
    public readonly Event = WebSocketChatClientEvent;
    public readonly state?: ChatStateTracker;

    protected ws: WebSocket|null = null;
    protected sendQueue: Envelope[] = [];
    protected connectingTimeoutId: any;
    protected authenticated: boolean;
    protected authenticatedResolvers: [() => void, (error: Error) => void] | null = null;
    protected connectPromise: Promise<void> | null = null;
    protected pingMonitorInterval?: NodeJS.Timeout;
    protected inFlightPingTimeout: NodeJS.Timeout;
    protected lastReceivedMessageAt?: number;
    protected reconnectEnabled: boolean = false;
    protected reconnectTimeoutId?: any;
    protected reconnectAttempts: number = 0;
    protected serverClosedSinceStable: boolean = false;
    protected byeReceived: boolean = false;
    protected byeRetryAfterMs?: number;
    protected stableConnectionTimeoutId?: any;

    public constructor(private readonly options: WebSocketClientOptions) {
        super();
        if (this.options.stateTracking ?? true) {
            this.state = new ChatStateTracker(this);
        }

        options.ping ??= {};
        options.ping.enabled ??= true;
        options.ping.noActivityTimeoutMs ??= 15000;
        options.ping.pongBackTimeoutMs ??= 5000;
    }

    public async connect(): Promise<void> {
        this.reconnectEnabled = true;
        // A manual call does not wait for a scheduled retry.
        this.cancelScheduledReconnect();

        if (this.isOpenWsState() || this.isConnectingWsState()) {
            return this.connectPromise ?? undefined;
        }

        // Reuse the promise of an attempt that has not settled yet (an
        // automatic reconnect), so the caller that started connecting is
        // resolved by whichever attempt eventually authenticates.
        if (! this.connectPromise) {
            this.connectPromise = new Promise<void>((...args) => this.authenticatedResolvers = args);
            // Automatic reconnects create this promise with no one awaiting it,
            // so its rejection must not surface as an unhandled one. Callers
            // awaiting it still receive the rejection.
            this.connectPromise.catch(() => undefined);
        }

        const connectPromise = this.connectPromise;
        this.openSocket();

        return connectPromise;
    }

    public disconnect(): void {
        const wasActive = this.ws !== null || this.reconnectTimeoutId !== undefined;

        this.reconnectEnabled = false;
        this.resetBackoff();
        this.cancelScheduledReconnect();
        this.releaseSocket(1000); // Normal closure
        this.failPendingCommands(new Error('Client disconnected before the command was answered'));
        this.settleConnect(new Error('Client disconnected before authentication'));

        if (wasActive) {
            this.emit(this.Event.disconnect, false);
        }
    }

    public async send<CommandType extends keyof CommandsMap>(commandType: CommandType, commandData: CommandRequest<CommandType>):
       Promise<CommandResult<CommandResponse<CommandType>>> {
        const envelope = this.createEnvelope<CommandRequest<CommandType>>(commandType, commandData);
        const promise = this.createPromiseFromCommandEnvelope<CommandType>(envelope);

        if (this.isConnectingWsState() || !this.authenticated && this.isOpenWsState()) {
            this.sendQueue.push(envelope);
            return promise;
        }

        this.sendEnvelope(envelope);
        return promise;
    }

    public get isReady(): boolean {
        return this.isOpenWsState() && this.authenticated;
    }

    private openSocket(): void {
        // Never leave a previous socket attached (e.g. one still closing).
        this.releaseSocket(1000);

        const params = new URLSearchParams(this.options.queryParams ?? {});
        params.set('token', this.options.token);

        let ws: WebSocket;
        try {
            ws = new WebSocket(`${this.options.url}?${params}`);
        } catch (error) {
            // Invalid URL - no retry can fix that.
            this.settleConnect(error);
            return;
        }

        // Events of an abandoned socket must not touch the current connection.
        ws.onmessage = ev => ws === this.ws && this.onMessage(ev);
        ws.onclose = ev => ws === this.ws && this.onClose(ev);
        // Not every implementation follows a failed handshake with a close
        // event (e.g. Node.js), so an error alone means the connection is lost.
        ws.onerror = () => ws === this.ws && this.handleConnectionLoss(true);
        ws.onopen = () => ws === this.ws && this.startConnectingTimeout(this.options.sessionTimeoutMs ?? 60000);

        this.ws = ws;
        this.authenticated = false;
        this.byeReceived = false;
        this.byeRetryAfterMs = undefined;
        this.startConnectingTimeout(this.options.connectingTimeoutMs ?? 10000);
    }

    private startConnectingTimeout(timeoutMs: number): void {
        clearTimeout(this.connectingTimeoutId);
        this.connectingTimeoutId = setTimeout(() => this.triggerConnectionTimeout(), timeoutMs);
    }

    private sendEnvelope(envelope: Envelope): void {
        if (this.isReady) {
            this.ws.send(JSON.stringify(envelope));
            return;
        }

        this.handleEnvelopeSendError(
            envelope,
            new Error(`Cannot send - client is not ready (state=${this.ws?.readyState ?? '[no connection]'}; authenticated=${this.authenticated})`)
        );
    }

    private onMessage(event: MessageEvent): void {
        this.lastReceivedMessageAt = Date.now();
        const envelope: Envelope = JSON.parse(event.data);
        const ws = this.ws;
        this.handleIncomingEnvelope(envelope);
        this.emit(envelope.type, envelope.data);
        this.emit(this.Event.message, envelope);

        // A listener has called disconnect() or connect(), which settled this socket already.
        if (ws !== this.ws) {
            return;
        }

        if (envelope.type === 'Bye') {
            this.onBye(envelope.data as Bye);
            return;
        }

        // Login successfully
        if (!this.authenticated) {
            this.authenticated = true;
            this.stableConnectionTimeoutId = setTimeout(
                () => this.resetBackoff(),
                this.options.reconnect?.stableConnectionMs ?? 30000
            );
            this.startConnectionMonitor();
            this.settleConnect();
            this.emit(this.Event.connect);
            this.sendFromQueue();
        }
    }

    private onBye(bye: Bye): void {
        this.byeReceived = true;
        this.byeRetryAfterMs = normalizeRetryAfter(bye?.retryAfterMs);

        if (bye?.reason?.type === 'Service' || bye?.reason?.error?.code === 'ServiceUnavailableException') {
            // Not left to the close code: the server may close with 1000 and some platforms rewrite the code.
            this.handleConnectionLoss(true, true);
            return;
        }

        if (this.authenticated) {
            return;
        }

        this.settleConnect(bye);

        const error = bye?.reason?.error;
        if (error?.code === 'AuthenticationException') {
            // Invalid token - retrying would be rejected the same way.
            this.handleConnectionLoss(false);
            this.emit(this.Event.error, new Error(`Authentication rejected: ${error.message}`));
        }
    }

    private onClose(event: CloseEvent): void {
        // Connection was closed because of error
        this.handleConnectionLoss(event.code !== 1000, this.byeReceived || SERVER_CLOSE_CODES.includes(event.code));
    }

    /**
     * Abandon the current socket without waiting for its close event (which
     * may never come, or take minutes on a dead TCP connection), settle
     * everything that depended on it and schedule a retry when requested.
     */
    private handleConnectionLoss(reconnect: boolean, closedByServer: boolean = false): void {
        this.releaseSocket(reconnect ? 3000 : 1000);

        // The server can no longer answer anything that was queued or in
        // flight, so settle those promises instead of leaving them pending.
        this.failPendingCommands(new Error('Connection closed before the command was answered'));

        reconnect &&= this.reconnectEnabled;

        if (reconnect) {
            // Keep a pending connect() promise unsettled - the retry below is
            // expected to authenticate and will resolve it.
            this.scheduleReconnect(closedByServer);
        } else {
            this.reconnectEnabled = false;
            this.settleConnect(new Error('Connection closed before authentication'));
        }

        this.emit(this.Event.disconnect, reconnect);
    }

    /**
     * Detach the current socket from the client and close it if it is still
     * alive, together with all timers bound to it.
     */
    private releaseSocket(closeCode: number): void {
        this.stopConnectionMonitor();
        clearTimeout(this.connectingTimeoutId);
        this.connectingTimeoutId = undefined;
        clearTimeout(this.stableConnectionTimeoutId);
        this.stableConnectionTimeoutId = undefined;
        this.authenticated = false;

        const ws = this.ws;
        this.ws = null;

        if (! ws) {
            return;
        }

        ws.onmessage = ws.onclose = ws.onerror = ws.onopen = null;

        if (ws.readyState === ws.CONNECTING || ws.readyState === ws.OPEN) {
            try {
                ws.close(closeCode);
            } catch {
                // Nothing more can be done with a broken socket.
            }
        }
    }

    private scheduleReconnect(closedByServer: boolean): void {
        this.cancelScheduledReconnect();

        // Once the server has closed a connection, the attempts that fail while it is still down
        // keep the longer backoff.
        this.serverClosedSinceStable ||= closedByServer;

        const reconnectOptions = this.options.reconnect;
        const minDelay = Math.max(0, this.serverClosedSinceStable
            ? reconnectOptions?.serverCloseMinDelayMs ?? 5000
            : reconnectOptions?.minDelayMs ?? 1000);
        const maxDelay = Math.max(minDelay, reconnectOptions?.maxDelayMs ?? 30000);
        const delay = Math.min(maxDelay, minDelay * 2 ** Math.min(this.reconnectAttempts, 30));
        this.reconnectAttempts++;

        // Full jitter spreads the clients dropped together over the whole delay; the server jitters its own hint.
        this.reconnectTimeoutId = setTimeout(() => {
            this.reconnectTimeoutId = undefined;
            this.connect().catch(() => undefined);
        }, this.byeRetryAfterMs ?? Math.random() * delay);
    }

    private resetBackoff(): void {
        this.reconnectAttempts = 0;
        this.serverClosedSinceStable = false;
    }

    private cancelScheduledReconnect(): void {
        clearTimeout(this.reconnectTimeoutId);
        this.reconnectTimeoutId = undefined;
    }

    /**
     * Resolve (or reject, when an error is given) a pending connect() promise.
     * No-op when there is nothing pending.
     */
    private settleConnect(error?: any): void {
        const resolvers = this.authenticatedResolvers;

        this.authenticatedResolvers = null;
        this.connectPromise = null;

        if (! resolvers) {
            return;
        }

        error ? resolvers[1](error) : resolvers[0]();
    }

    /**
     * Reject every command that has not been answered yet - both the ones still
     * waiting in the send queue and the ones already sent to the server.
     */
    private failPendingCommands(error: Error): void {
        const queued = this.sendQueue;
        this.sendQueue = [];

        for (const envelope of queued) {
            this.handleEnvelopeSendError(envelope, error);
        }

        this.failAwaitingResponses(error);
    }

    private sendFromQueue(): void {
        // Send awaiting data to server
        let lastDelay = 0;
        for (const dataIndex in this.sendQueue) {
            const envelope = this.sendQueue[dataIndex];
            setTimeout(() => this.sendEnvelope(envelope), lastDelay);
            lastDelay += this.options.awaitQueueSendDelayMs ?? 500;
        }
        this.sendQueue = [];
        clearTimeout(this.connectingTimeoutId);
    }

    private triggerConnectionTimeout(): void {
        this.handleConnectionLoss(true);
        this.emit(this.Event.error, new Error('Connection timeout'));
    }

    private isConnectingWsState(): boolean {
        return this.ws && this.ws.readyState === this.ws.CONNECTING;
    }

    private isOpenWsState(): boolean {
        return this.ws && this.ws.readyState === this.ws.OPEN;
    }

    private startConnectionMonitor(): void {
        this.stopConnectionMonitor();

        if (!this.options.ping!.enabled) {
            return;
        }

        this.lastReceivedMessageAt = Date.now();

        this.pingMonitorInterval = setInterval(async () => {
            if (!this.isReady || this.inFlightPingTimeout) {
                return;
            }

            if ((Date.now() - this.lastReceivedMessageAt) < this.options.ping!.noActivityTimeoutMs) {
                return;
            }

            this.inFlightPingTimeout = setTimeout(() => {
                this.inFlightPingTimeout = undefined;
                // Closing a dead connection can hang in CLOSING for minutes,
                // so drop it right away instead of waiting for the close event.
                this.handleConnectionLoss(true);
            }, this.options.ping.pongBackTimeoutMs);

            // A rejection here means the connection dropped while the ping was
            // in flight; the loss is already handled, so just stop waiting.
            this.send('Ping', {}).catch(() => undefined).then(() => {
                clearTimeout(this.inFlightPingTimeout);
                this.inFlightPingTimeout = undefined;
            });
        }, 1000);
    }

    private stopConnectionMonitor(): void {
        if (this.inFlightPingTimeout) {
            clearTimeout(this.inFlightPingTimeout);
            this.inFlightPingTimeout = undefined;
        }
        if (this.pingMonitorInterval) {
            clearInterval(this.pingMonitorInterval);
            this.pingMonitorInterval = undefined;
        }
    }
}
