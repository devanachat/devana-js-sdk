import {User} from "./User";
import {ChatLocation} from "./ChatLocation";

export interface BanObject {
    bannedUser: User;
    banningUser?: User;
    location: ChatLocation;
    reason: string;
    diagnosticId: string;
    expiresAt?: string;
    createdAt: string;
}