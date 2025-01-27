import { AbstractRestClient } from "./AbstractRestClient";
export interface TokenInterface {
    token: string;
    expiration: string;
}
export interface MyAccountInterface {
    id: string;
    nick: string;
    avatar: string;
}
export declare class AuthClient extends AbstractRestClient {
    protected defaultUrl: string;
    static createToken(login: string, password: string, clientName?: string): Promise<TokenInterface>;
    deleteToken(token: string): Promise<void>;
    getMe(): Promise<MyAccountInterface>;
}
