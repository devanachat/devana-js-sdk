import {RoomType} from "./Room";

export interface RoomSummaryExtras {
    isPrivate: boolean;
    isInvitationOnly: boolean;
}

export interface RoomSummary {
    id: string;
    spaceId?: string;
    name: string;
    description: string;
    memberCount: number;
    type: RoomType;
    extras?: RoomSummaryExtras;
    /**
     * The default topic of the room - what the history of a room is addressed with. Given to everyone who may read
     * the room, also without joining it (`PreviewRooms`); `null` for those who may not.
     */
    defaultTopicId?: string | null;
}
