import {RoomType} from "./Room";

export interface RoomSummaryExtras {
    isPrivate: boolean;
}

export interface RoomSummary {
    id: string;
    spaceId?: string;
    name: string;
    description: string;
    memberCount: number;
    type: RoomType;
    extras?: RoomSummaryExtras;
}