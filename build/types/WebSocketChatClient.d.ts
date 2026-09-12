/// <reference types="node" />
import { ObservableInterface } from "./EventTarget";
import { AbstractChatClient, CommandRequest, CommandResult, CommandResponse, CommandsMap, EventsMap } from "./AbstractChatClient";
import { ChatStateTracker } from "./state-tracker/ChatStateTracker";
import { Envelope } from "./types/src";
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
    };
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
    };
}
declare enum WebSocketChatClientEvent {
    connect = "connect",
    disconnect = "disconnect",
    message = "message",
    error = "error"
}
type WebSocketEventMap = EventsMap & {
    [WebSocketChatClientEvent.connect]: void;
    [WebSocketChatClientEvent.disconnect]: boolean;
    [WebSocketChatClientEvent.message]: Envelope;
    [WebSocketChatClientEvent.error]: Error;
};
export declare class WebSocketChatClient extends AbstractChatClient<Pick<WebSocketEventMap, keyof WebSocketEventMap>> implements ObservableInterface {
    private readonly options;
    readonly Event: typeof WebSocketChatClientEvent;
    readonly state?: ChatStateTracker;
    protected ws: WebSocket | null;
    protected sendQueue: Envelope[];
    protected connectingTimeoutId: any;
    protected authenticated: boolean;
    protected authenticatedResolvers: [() => void, (error: Error) => void] | null;
    protected connectPromise: Promise<void> | null;
    protected pingMonitorInterval?: NodeJS.Timeout;
    protected inFlightPingTimeout: NodeJS.Timeout;
    protected lastReceivedMessageAt?: number;
    protected reconnectEnabled: boolean;
    protected reconnectTimeoutId?: any;
    protected reconnectAttempts: number;
    constructor(options: WebSocketClientOptions);
    connect(): Promise<void>;
    disconnect(): void;
    send<CommandType extends keyof CommandsMap>(commandType: CommandType, commandData: CommandRequest<CommandType>): Promise<CommandResult<CommandResponse<CommandType>>>;
    get isReady(): boolean;
    private openSocket;
    private sendEnvelope;
    private onMessage;
    private onClose;
    /**
     * Abandon the current socket without waiting for its close event (which
     * may never come, or take minutes on a dead TCP connection), settle
     * everything that depended on it and schedule a retry when requested.
     */
    private handleConnectionLoss;
    /**
     * Detach the current socket from the client and close it if it is still
     * alive, together with all timers bound to it.
     */
    private releaseSocket;
    private scheduleReconnect;
    private cancelScheduledReconnect;
    /**
     * Resolve (or reject, when an error is given) a pending connect() promise.
     * No-op when there is nothing pending.
     */
    private settleConnect;
    /**
     * Reject every command that has not been answered yet - both the ones still
     * waiting in the send queue and the ones already sent to the server.
     */
    private failPendingCommands;
    private sendFromQueue;
    private triggerConnectionTimeout;
    private isConnectingWsState;
    private isOpenWsState;
    private startConnectionMonitor;
    private stopConnectionMonitor;
}
export {};
