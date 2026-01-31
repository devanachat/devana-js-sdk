import {AbstractChatClient, CommandRequest, CommandResult, CommandResponse, CommandsMap, EventsMap} from "./AbstractChatClient";
import {ObservableInterface} from "./EventTarget";
import {Envelope} from "./types/src";

export interface WebApiChatClientOptions {
    url: string;
    token: string;
    attemptsToSend?: number;
    attemptDelayMs?: number;
    queryParams?: Record<string, string>;
}

enum WebApiChatClientEvent {
    message = 'message',
    error = 'error',
    destroy = 'destroy',
}

type WebApiEventMap = EventsMap & {
    [WebApiChatClientEvent.message]: Envelope;
    [WebApiChatClientEvent.error]: Error;
    [WebApiChatClientEvent.destroy]: boolean;
};

export class WebApiChatClient extends AbstractChatClient<Pick<WebApiEventMap, keyof WebApiEventMap>> implements ObservableInterface {
    public readonly Event = WebApiChatClientEvent;

    protected sendStack: {data: any, attempts: number, lastTimeoutId: any}[];

    public constructor(private readonly options: WebApiChatClientOptions) {
        super();
    }

    public async send<CommandType extends keyof CommandsMap>(commandType: CommandType, commandData: CommandRequest<CommandType>):
        Promise<CommandResult<CommandResponse<CommandType>>> {
        const envelope = this.createEnvelope(commandType, commandData);
        this.sendStack.push({data: envelope, attempts: 0, lastTimeoutId: null});
        this.makeApiCall(this.sendStack.length - 1);
        return this.createPromiseFromCommandEnvelope(envelope);
    }

    public destroy(): void {
        // Cancel all awaiting requests
        this.sendStack.forEach(item => {
            if (item.lastTimeoutId) {
                clearTimeout(item.lastTimeoutId);
            }
            this.awaitingResponse.delete(item.data.ref);
        });
        this.sendStack = [];
        this.emit(this.Event.destroy, false);
    }

    protected async onMessage(reqId: number, response: Response): Promise<void> {
        this.sendStack.splice(reqId, 1);
        const envelope: Envelope = await response.json();
        this.handleIncomingEnvelope(envelope);
        this.emit(envelope.type, envelope.data);
        this.emit(this.Event.message, envelope);
    }

    protected onError(reqId: number, body: string): void {
        if (this.sendStack[reqId].attempts >= (this.options.attemptsToSend ?? 10)) {
            this.sendStack.splice(reqId, 1);
            this.handleEnvelopeSendError(this.sendStack[reqId].data, new Error(
                `Cannot send ${body}; aborting after reaching the maximum connection errors`
            ));
            return;
        }
        this.sendStack[reqId].lastTimeoutId = setTimeout(
            () => this.makeApiCall(reqId),
            this.options.attemptDelayMs ?? 3000
        );
    }

    protected makeApiCall(reqId: number): void {
        this.sendStack[reqId].attempts++;
        const bodyJson = JSON.stringify(this.sendStack[reqId].data);
        const headers: any = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };

        headers.Authorization = `Bearer ${this.options.token}`;

        const params = new URLSearchParams(this.options.queryParams ?? {});
        const url = `${this.options.url}${params ? '?' + params : ''}`;

        fetch(url, {
            headers,
            body: bodyJson,
            method: 'POST',
        })
            .then(response => this.onMessage(reqId, response))
            .catch(() => this.onError(reqId, bodyJson));
    }
}