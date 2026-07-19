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

interface SendStackItem {
    data: Envelope;
    attempts: number;
    lastTimeoutId: any;
}

export class WebApiChatClient extends AbstractChatClient<Pick<WebApiEventMap, keyof WebApiEventMap>> implements ObservableInterface {
    public readonly Event = WebApiChatClientEvent;

    protected sendStack: SendStackItem[] = [];

    public constructor(private readonly options: WebApiChatClientOptions) {
        super();
    }

    public async send<CommandType extends keyof CommandsMap>(commandType: CommandType, commandData: CommandRequest<CommandType>):
        Promise<CommandResult<CommandResponse<CommandType>>> {
        const envelope = this.createEnvelope(commandType, commandData);
        const item: SendStackItem = {data: envelope, attempts: 0, lastTimeoutId: null};
        this.sendStack.push(item);
        this.makeApiCall(item);
        return this.createPromiseFromCommandEnvelope(envelope);
    }

    public destroy(): void {
        // Cancel all awaiting requests, rejecting their promises so no caller
        // is left awaiting forever
        const pending = this.sendStack;
        this.sendStack = [];
        pending.forEach(item => {
            if (item.lastTimeoutId) {
                clearTimeout(item.lastTimeoutId);
            }
            this.handleEnvelopeSendError(item.data, new Error('Client destroyed'));
        });
        this.emit(this.Event.destroy, false);
    }

    protected async onMessage(item: SendStackItem, response: Response): Promise<void> {
        let envelope: Envelope;
        try {
            envelope = await response.json();
        } catch (e) {
            // Non-envelope response (e.g. a proxy error page) - failed attempt
            this.onError(item, `envelope ${item.data.ref} (HTTP ${response.status}, unparsable body)`);
            return;
        }

        if (!this.removeFromStack(item)) {
            return; // Destroyed in the meantime - the promise is already rejected
        }

        this.handleIncomingEnvelope(envelope);
        this.emit(envelope.type, envelope.data);
        this.emit(this.Event.message, envelope);
    }

    protected onError(item: SendStackItem, body: string): void {
        if (!this.sendStack.includes(item)) {
            return; // Destroyed in the meantime
        }

        if (item.attempts >= (this.options.attemptsToSend ?? 10)) {
            this.removeFromStack(item);
            this.handleEnvelopeSendError(item.data, new Error(
                `Cannot send ${body}; aborting after reaching the maximum connection errors`
            ));
            return;
        }

        item.lastTimeoutId = setTimeout(
            () => this.makeApiCall(item),
            this.options.attemptDelayMs ?? 3000
        );
    }

    protected makeApiCall(item: SendStackItem): void {
        if (!this.sendStack.includes(item)) {
            return; // Destroyed before this (re)try fired
        }

        item.attempts++;
        item.lastTimeoutId = null;
        const bodyJson = JSON.stringify(item.data);
        const headers: any = {
            'Content-Type': 'application/json',
            Accept: 'application/json'
        };

        headers.Authorization = `Bearer ${this.options.token}`;

        const query = new URLSearchParams(this.options.queryParams ?? {}).toString();
        const url = query ? `${this.options.url}?${query}` : this.options.url;

        fetch(url, {
            headers,
            body: bodyJson,
            method: 'POST',
        })
            .then(response => this.onMessage(item, response))
            .catch(() => this.onError(item, bodyJson));
    }

    private removeFromStack(item: SendStackItem): boolean {
        const index = this.sendStack.indexOf(item);
        if (index === -1) {
            return false;
        }
        this.sendStack.splice(index, 1);
        return true;
    }
}