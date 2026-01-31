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
export declare class WebApiChatClient extends AbstractChatClient<Pick<WebApiEventMap, keyof WebApiEventMap>> implements ObservableInterface {
    private readonly options;
    readonly Event: typeof WebApiChatClientEvent;
    protected sendStack: {
        data: any;
        attempts: number;
        lastTimeoutId: any;
    }[];
    constructor(options: WebApiChatClientOptions);
    send<CommandType extends keyof CommandsMap>(commandType: CommandType, commandData: CommandRequest<CommandType>): Promise<CommandResult<CommandResponse<CommandType>>>;
    destroy(): void;
    protected onMessage(reqId: number, response: Response): Promise<void>;
    protected onError(reqId: number, body: string): void;
    protected makeApiCall(reqId: number): void;
}
export {};
