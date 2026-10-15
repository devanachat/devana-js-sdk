import {RoomType} from "../Room";

export interface CreateRoom {
    type: RoomType;
    spaceId?: string;
    name?: string;
    description?: string;
    recipientIds?: string[];
    flags?: number;
}
