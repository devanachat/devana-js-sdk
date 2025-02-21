import {ChatLocation} from "../ChatLocation";

export interface Ban {
    userId: string;
    location: ChatLocation;
    reason: string;
    expiresAt?: string;
    notify?: boolean;
}