import {User} from "./User";

export interface Emoticon {
    id: string;
    spaceId?: string | null;
    name: string;
    fileId: string;
    user: User | null;
}