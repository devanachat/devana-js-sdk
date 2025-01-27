import { ObservableInterface } from "./EventTarget";
import { AbstractChatClient, CommandResult, CommandsMap } from "./AbstractChatClient";
import { ChatStateTracker } from "./state-tracker/ChatStateTracker";
import { Envelope } from "./types/src";
export interface WebSocketClientOptions {
    url: string;
    token?: string;
    temporaryNick?: string;
    connectingTimeoutMs?: number;
    awaitQueueSendDelayMs?: number;
    stateTracking?: boolean;
}
declare enum WebSocketChatClientEvent {
    connect = "connect",
    disconnect = "disconnect",
    message = "message",
    error = "error"
}
export declare class WebSocketChatClient extends AbstractChatClient implements ObservableInterface {
    private readonly options;
    readonly Event: typeof WebSocketChatClientEvent;
    readonly state?: ChatStateTracker;
    protected ws: WebSocket | null;
    protected sendQueue: Envelope[];
    protected connectingTimeoutId: any;
    protected authenticated: boolean;
    protected authenticatedResolvers: [() => void, (error: Error) => void];
    constructor(options: WebSocketClientOptions);
    connect(): Promise<void>;
    disconnect(): void;
    send<CommandType extends keyof CommandsMap>(commandType: CommandType, commandData: CommandsMap[CommandType][0]): Promise<CommandResult<CommandsMap[CommandType][1]>>;
    private sendEnvelope;
    private onMessage;
    private onClose;
    private sendFromQueue;
    private triggerConnectionTimeout;
}
export {};
