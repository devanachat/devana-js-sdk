import { AbstractChatClient, CommandRequest, CommandResult, CommandResponse, CommandsMap, EventsMap } from "./AbstractChatClient";
import { ObservableInterface } from "./EventTarget";
import { Envelope } from "./types/src";
export interface WebApiChatClientOptions {
    url: string;
    token: string;
    attemptsToSend?: number;
    attemptDelayMs?: number;
    queryParams?: Record<string, string>;
}
declare enum WebApiChatClientEvent {
    message = "message",
    error = "error",
    destroy = "destroy"
}
type WebApiEventMap = EventsMap & {
    [WebApiChatClientEvent.message]: Envelope;
    [WebApiChatClientEvent.error]: Error;
    [WebApiChatClientEvent.destroy]: boolean;
};
interface SendStackItem {
    data: Envelope;
    attempts: number;
    lastTimeoutId: any;
}
export declare class WebApiChatClient extends AbstractChatClient<Pick<WebApiEventMap, keyof WebApiEventMap>> implements ObservableInterface {
    private readonly options;
    readonly Event: typeof WebApiChatClientEvent;
    protected sendStack: SendStackItem[];
    constructor(options: WebApiChatClientOptions);
    send<CommandType extends keyof CommandsMap>(commandType: CommandType, commandData: CommandRequest<CommandType>): Promise<CommandResult<CommandResponse<CommandType>>>;
    destroy(): void;
    protected onMessage(item: SendStackItem, response: Response): Promise<void>;
    protected onError(item: SendStackItem, body: string): void;
    protected makeApiCall(item: SendStackItem): void;
    private removeFromStack;
}
export {};
