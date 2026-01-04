export interface RestClientOptions {
    url?: string;
    token: string;
}

export interface RestClientResponse<T> {
    ok: boolean;
    status: number;
    data: T;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export abstract class AbstractRestClient {
    protected abstract defaultUrl: string;

    public constructor(
        private readonly options: RestClientOptions,
    ) {}

    protected async send<ResponseT = any>(
        method: HttpMethod,
        uri: string,
        data: any = undefined,
        additionalHeaders: Record<string, string> = {},
    ): Promise<RestClientResponse<ResponseT>> {
        let url = this.getUrl(uri);
        let body = undefined;

        if (data) {
            if (['GET', 'DELETE'].includes(method)) {
                url += new URLSearchParams(data).toString()
            } else {
                body = JSON.stringify(data);
            }
        }

        const headers = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            ...additionalHeaders,
            ...this.getAuthHeaders(),
        };

        const result = await fetch(url, {method, body, headers});

        return this.convertFetchResponse(result);
    }

    protected getAuthHeaders(): any {
        const headers = {} as any;

        if (this.options.token) {
            headers.Authorization = `Bearer ${this.options.token}`;
        }

        return headers;
    }

    protected getUrl(uri: string): string {
        return this.removeEndingSlash(this.options.url ?? this.defaultUrl) + '/' + this.removeStartingSlash(uri);
    }

    protected async convertFetchResponse<T>(result: Response): Promise<RestClientResponse<T>> {
        return {
            ok: result.ok,
            status: result.status,
            data: result.headers.get('content-type')?.includes('json') ? await result.json() : await result.text(),
        };
    }

    private removeStartingSlash(text: string): string {
        return text.replace(/^\/+/, '');
    }

    private removeEndingSlash(text: string): string {
        return text.replace(/\/+$/, '');
    }
}