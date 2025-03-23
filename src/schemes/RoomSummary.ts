import {RoomType} from "./Room";

export interface RoomSummaryExtras {
    isPrivate: boolean;
}

export interface RoomSummary {
    id: string;
    name: string;
    description: string;
    type: RoomType;
    extras?: RoomSummaryExtras;
}