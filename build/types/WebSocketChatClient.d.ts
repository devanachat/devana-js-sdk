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
         * Time without activity after which a ping will be sent. Default is 10 seconds.
         */
        noActivityTimeoutMs?: number;
        /**
         * Time to wait for a pong response before considering the connection dead. Default is 2 seconds.
         */
        pongBackTimeoutMs?: number;
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
    protected authenticatedResolvers: [() => void, (error: Error) => void];
    protected pingMonitorInterval?: NodeJS.Timeout;
    protected inFlightPingTimeout: NodeJS.Timeout;
    protected lastReceivedMessageAt?: number;
    constructor(options: WebSocketClientOptions);
    connect(): Promise<void>;
    disconnect(): void;
    send<CommandType extends keyof CommandsMap>(commandType: CommandType, commandData: CommandRequest<CommandType>): Promise<CommandResult<CommandResponse<CommandType>>>;
    get isReady(): boolean;
    private sendEnvelope;
    private onMessage;
    private onClose;
    private sendFromQueue;
    private triggerConnectionTimeout;
    private isConnectingWsState;
    private isOpenWsState;
    private startConnectionMonitor;
    private stopConnectionMonitor;
}
export {};
