import {User} from "./User";
import {ChatLocation} from "./ChatLocation";

export type BanType = 'Ban' | 'Mute';

export interface BanObject {
    id: string;
    bannedUser: User;
    banningUser?: User;
    location: ChatLocation;
    reason: string;
    expiresAt?: string;
    createdAt: string;
    type: BanType;
    parentId?: string;
}