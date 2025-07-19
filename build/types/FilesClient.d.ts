import { AbstractRestClient, RestClientResponse } from "./AbstractRestClient";
export interface File {
    id: string;
    url: string;
    name: string;
    mime: string;
    size: number;
    width?: number;
    height?: number;
}
export declare class FilesClient extends AbstractRestClient {
    protected defaultUrl: string;
    uploadFile(file: globalThis.File | Blob): Promise<RestClientResponse<File>>;
    getFileMeta(id: string): Promise<RestClientResponse<File>>;
    getFileMetaBulk(ids: string[]): Promise<RestClientResponse<File[]>>;
}
