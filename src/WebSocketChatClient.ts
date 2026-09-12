import {ObservableInterface} from "./EventTarget";
import {AbstractChatClient, CommandRequest, CommandResult, CommandResponse, CommandsMap, EventsMap} from "./AbstractChatClient";
import {ChatStateTracker} from "./state-tracker/ChatStateTracker";
import {Bye, Envelope} from "./types/src";

export interface WebSocketClientOptions {
    url: string;
    token: string;
    connectingTimeoutMs?: number;
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
     * with an exponential backoff. Calling `disconnect()` stops retrying until the next `connect()`.
     */
    reconnect?: {
        /**
         * Delay before the first retry; each subsequent one doubles it. Default is 1 second.
         */
        minDelayMs?: number;
        /**
         * Upper limit of the delay between retries. Default is 30 seconds.
         */
        maxDelayMs?: number;
    },
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
        this.reconnectAttempts = 0;
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

        this.ws = ws;
        this.authenticated = false;
        this.connectingTimeoutId = setTimeout(
            () => this.triggerConnectionTimeout(),
            this.options.connectingTimeoutMs ?? 10000
        );
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
        this.handleIncomingEnvelope(envelope);
        this.emit(envelope.type, envelope.data);
        this.emit(this.Event.message, envelope);

        // Login successfully
        if (!this.authenticated) {
            const isAuthenticated = envelope.type !== 'Bye';
            this.authenticated = isAuthenticated;
            if (isAuthenticated) {
                this.reconnectAttempts = 0;
                this.startConnectionMonitor();
                this.settleConnect();
                this.emit(this.Event.connect);
                this.sendFromQueue();
            } else {
                this.settleConnect(envelope.data);

                const error = (envelope.data as Bye)?.reason?.error;
                if (error?.code === 'AuthenticationException') {
                    // Invalid token - retrying would be rejected the same way.
                    this.handleConnectionLoss(false);
                    this.emit(this.Event.error, new Error(`Authentication rejected: ${error.message}`));
                }
            }
        }
    }

    private onClose(event: CloseEvent): void {
        // Connection was closed because of error
        this.handleConnectionLoss(event.code !== 1000);
    }

    /**
     * Abandon the current socket without waiting for its close event (which
     * may never come, or take minutes on a dead TCP connection), settle
     * everything that depended on it and schedule a retry when requested.
     */
    private handleConnectionLoss(reconnect: boolean): void {
        this.releaseSocket(reconnect ? 3000 : 1000);

        // The server can no longer answer anything that was queued or in
        // flight, so settle those promises instead of leaving them pending.
        this.failPendingCommands(new Error('Connection closed before the command was answered'));

        reconnect &&= this.reconnectEnabled;

        if (reconnect) {
            // Keep a pending connect() promise unsettled - the retry below is
            // expected to authenticate and will resolve it.
            this.scheduleReconnect();
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
        this.authenticated = false;

        const ws = this.ws;
        this.ws = null;

        if (! ws) {
            return;
        }

        ws.onmessage = ws.onclose = ws.onerror = null;

        if (ws.readyState === ws.CONNECTING || ws.readyState === ws.OPEN) {
            try {
                ws.close(closeCode);
            } catch {
                // Nothing more can be done with a broken socket.
            }
        }
    }

    private scheduleReconnect(): void {
        this.cancelScheduledReconnect();

        const minDelay = Math.max(0, this.options.reconnect?.minDelayMs ?? 1000);
        const maxDelay = Math.max(minDelay, this.options.reconnect?.maxDelayMs ?? 30000);
        const delay = Math.min(maxDelay, minDelay * 2 ** Math.min(this.reconnectAttempts, 30));
        this.reconnectAttempts++;

        // Random jitter (50-100% of the delay) keeps clients from reconnecting
        // in lockstep after a server restart.
        this.reconnectTimeoutId = setTimeout(() => {
            this.reconnectTimeoutId = undefined;
            this.connect().catch(() => undefined);
        }, delay / 2 + Math.random() * delay / 2);
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
