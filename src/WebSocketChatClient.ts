import {ObservableInterface} from "./EventTarget";
import {AbstractChatClient, CommandResult, CommandsMap, EventsMap} from "./AbstractChatClient";
import {ChatStateTracker} from "./state-tracker/ChatStateTracker";
import {Envelope} from "./types/src";

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
         * Time without activity after which a ping will be sent. Default is 10 seconds.
         */
        noActivityTimeoutMs?: number;
        /**
         * Time to wait for a pong response before considering the connection dead. Default is 2 seconds.
         */
        pongBackTimeoutMs?: number;
    },
}

enum WebSocketChatClientEvent {
    connect = 'connect',
    disconnect = 'disconnect',
    message = 'message',
    error = 'error',
}

export class WebSocketChatClient extends AbstractChatClient implements ObservableInterface {
    public readonly Event = WebSocketChatClientEvent;
    public readonly state?: ChatStateTracker;

    protected ws: WebSocket|null = null;
    protected sendQueue: Envelope[] = [];
    protected connectingTimeoutId: any;
    protected authenticated: boolean;
    protected authenticatedResolvers: [() => void, (error: Error) => void];
    protected pingIntervalId?: NodeJS.Timeout;
    protected lastReceivedMessageAt?: number;
    protected pingInFlight: boolean;

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
        if (this.isOpenWsState() || this.isConnectingWsState()) {
            return;
        }

        const params = new URLSearchParams(this.options.queryParams ?? {});
        params.set('token', this.options.token);

        this.ws = new WebSocket(`${this.options.url}?${params}`);
        this.ws.onclose = ev => this.onClose(ev);
        this.ws.onmessage = ev => this.onMessage(ev);
        this.connectingTimeoutId = setTimeout(
            () => this.triggerConnectionTimeout(),
            this.options.connectingTimeoutMs ?? 10000
        );
        this.authenticated = false;
        return new Promise((...args) => this.authenticatedResolvers = args);
    }

    public disconnect(): void {
        this.sendQueue = [];
        this.ws?.close(1000); // Normal closure
        this.ws = null;
    }

    public async send<CommandType extends keyof CommandsMap>(commandType: CommandType, commandData: CommandsMap[CommandType][0]):
       Promise<CommandResult<CommandsMap[CommandType][1]>> {
        const envelope = this.createEnvelope<CommandsMap[CommandType][0]>(commandType, commandData);
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
                this.startConnectionMonitor();
                this.authenticatedResolvers[0]();
                this.emit(this.Event.connect);
                this.sendFromQueue();
            } else {
                this.authenticatedResolvers[1](envelope.data);
            }
        }
    }

    private onClose(event: CloseEvent): void {
        this.stopConnectionMonitor();
        clearTimeout(this.connectingTimeoutId);
        const reconnect = event.code !== 1000; // Connection was closed because of error
        if (reconnect) {
            void this.connect();
        }
        this.emit(this.Event.disconnect, reconnect);
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
        this.disconnect();
        this.emit(this.Event.error, new Error('Connection timeout'));
    }

    private isConnectingWsState(): boolean {
        return this.ws && this.ws.readyState === this.ws.CONNECTING;
    }

    private isOpenWsState(): boolean {
        return this.ws && this.ws.readyState === this.ws.OPEN;
    }

    private startConnectionMonitor(): void {
        if (!this.options.ping!.enabled) {
            return;
        }

        this.lastReceivedMessageAt = Date.now();

        this.pingIntervalId = setInterval(async () => {
            if (!this.isReady || this.pingInFlight) {
                return;
            }

            if ((Date.now() - this.lastReceivedMessageAt) < this.options.ping!.noActivityTimeoutMs) {
                return;
            }

            const timeout = setTimeout(() => {
                this.pingInFlight = false;
                this.disconnect();
                void this.connect();
            }, this.options.ping.pongBackTimeoutMs);

            this.pingInFlight = true;

            this.send('Ping', {}).then(() => {
                this.pingInFlight = false;
                clearTimeout(timeout);
            });
        }, 1000);
    }

    private stopConnectionMonitor(): void {
        if (this.pingIntervalId) {
            clearInterval(this.pingIntervalId);
            this.pingIntervalId = undefined;
        }
        this.pingInFlight = false;
    }
}