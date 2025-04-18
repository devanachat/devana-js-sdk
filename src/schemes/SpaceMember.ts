import {User} from "./User";

export interface SpaceMember {
    user: User | null;
    roles: string[];
    customNick: string | null;
}