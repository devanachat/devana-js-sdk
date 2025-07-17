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
    uploadFile(file: Parameters<typeof FormData.prototype.append>[1]): Promise<RestClientResponse<File>>;
    getFileMeta(id: string): Promise<RestClientResponse<File>>;
    getFileMetaBulk(ids: string[]): Promise<RestClientResponse<File[]>>;
}
