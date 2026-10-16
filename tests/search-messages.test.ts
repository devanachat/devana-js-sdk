import {AbstractChatClient} from "../src/AbstractChatClient";
import {Envelope, FoundMessages, SearchMessages} from "../src/protocol";

class TestableChatClient extends AbstractChatClient {
    public sent: Envelope[] = [];

    public async sendRaw(type: any, data: any): Promise<any> {
        const envelope = this.createEnvelope(type, data);
        this.sent.push(envelope as any);
        return this.createPromiseFromCommandEnvelope(envelope as any);
    }

    public respond(ref: string, type: string, data: any): void {
        this.handleIncomingEnvelope({ref, type, data} as Envelope);
    }
}

describe('SearchMessages', () => {
    test('resolves to typed FoundMessages and error variants', async () => {
        const client = new TestableChatClient();
        const request: SearchMessages = {query: 'żółw "ala ma"', spaceId: 's1', during: ['2026-01-02']};

        const pending = client.sendRaw('SearchMessages', request);
        expect(client.sent[0].type).toBe('SearchMessages');
        expect(client.sent[0].data).toEqual(request);

        const found: FoundMessages = {
            results: [{message: {id: 'm1', content: 'Żółw'} as any, spaceId: 's1', ranges: [{start: 0, end: 4}]}],
            cursor: null,
        };
        client.respond('1', 'FoundMessages', found);
        const result = await pending;
        expect(result.error).toBeNull();
        const {message, ranges} = result.data.results[0];
        expect(message.content.slice(ranges[0].start, ranges[0].end)).toBe('Żółw');

        const failing = client.sendRaw('SearchMessages', {query: 'x', in: ['x']});
        client.respond('2', 'Error', {code: 'InvalidSearchQueryException', message: 'Invalid value of the in field'});
        expect((await failing).error?.code).toBe('InvalidSearchQueryException');
    });

    test('client.send is fully typed', () => {
        const check = (client: AbstractChatClient) => async () => {
            const res = await client.send('SearchMessages', {query: 'x', cursor: null});
            if (res.error === null) {
                const cursor: string | null = res.data.cursor;
                return cursor;
            }
        };
        expect(check).toBeDefined();
    });
});
