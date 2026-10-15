import {ChatLocation} from "../ChatLocation";
import {BanType} from "../BanObject";

export interface Ban {
    userId: string;
    location: ChatLocation;
    reason: string;
    expiresAt?: string;
    notify?: boolean;
    type?: BanType;
}