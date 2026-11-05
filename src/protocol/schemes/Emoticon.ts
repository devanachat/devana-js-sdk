import {User} from "./User";

export interface Emoticon {
    id: string;
    /**
     * Absent for an emoticon of a space the user does not belong to.
     */
    spaceId?: string;
    name: string;
    fileId: string;
    user: User;
}