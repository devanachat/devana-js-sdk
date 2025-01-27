import { AbstractChatClient, CommandResult, CommandsMap } from "./AbstractChatClient";
import { ObservableInterface } from "./EventTarget";
export interface WebApiChatClientOptions {
    url: string;
    token?: string;
    temporaryNick?: string;
    attemptsToSend?: number;
    attemptDelayMs?: number;
}
declare enum WebApiChatClientEvent {
    message = "message",
    error = "error",
    destroy = "destroy"
}
export declare class WebApiChatClient extends AbstractChatClient implements ObservableInterface {
    private readonly options;
    readonly Event: typeof WebApiChatClientEvent;
    protected sendStack: {
        data: any;
        attempts: number;
        lastTimeoutId: any;
    }[];
    constructor(options: WebApiChatClientOptions);
    send<CommandType extends keyof CommandsMap>(commandType: CommandType, commandData: CommandsMap[CommandType][0]): Promise<CommandResult<CommandsMap[CommandType][1]>>;
    destroy(): void;
    protected onMessage(reqId: number, response: Response): Promise<void>;
    protected onError(reqId: number, body: string): void;
    protected makeApiCall(reqId: number): void;
}
export {};
