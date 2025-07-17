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

    public async uploadFile(file: Parameters<typeof FormData.prototype.append>[1]): Promise<RestClientResponse<File>> {
        const formData = new FormData();
        formData.append('file', file);

        let headers = {...this.getAuthHeaders(), Accept: 'application/json'};

        const response = await fetch(this.getUrl('files'), {method: 'POST', body: formData, headers});

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