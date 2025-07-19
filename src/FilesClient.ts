import {AbstractRestClient, RestClientResponse} from "./AbstractRestClient";

export interface File {
    id: string;
    url: string;
    name: string;
    mime: string;
    size: number;
    width?: number;
    height?: number;
}

export class FilesClient extends AbstractRestClient {
    protected defaultUrl: string = 'https://files.devana.pl';

    public async uploadFile(file: globalThis.File | Blob): Promise<RestClientResponse<File>> {
        const name = encodeURIComponent((file as globalThis.File).name ?? '');
        let headers = {
            ...this.getAuthHeaders(),
            Accept: 'application/json',
            'Content-Disposition': `attachment; filename="${name}"`,
            'Content-Length': file.size
        };

        const response = await fetch(this.getUrl('files'), {
            method: 'POST',
            body: file,
            headers
        });

        return this.convertFetchResponse<File>(response);
    }

    public async getFileMeta(id: string): Promise<RestClientResponse<File>> {
        return this.send('GET', 'files/' + id);
    }

    public async getFileMetaBulk(ids: string[]): Promise<RestClientResponse<File[]>> {
        const searchParams = new URLSearchParams();
        ids.forEach(id => searchParams.append('id[]', id));
        return this.send('GET', 'files?' + searchParams);
    }
}