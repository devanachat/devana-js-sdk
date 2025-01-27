import {User} from "./User";

export interface Emoticon {
    id: string;
    spaceId?: string;
    name: string;
    fileId: string;
    user: User;
}