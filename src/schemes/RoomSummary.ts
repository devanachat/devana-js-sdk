export interface RoomSummaryExtras {
    isPrivate: boolean;
}

export interface RoomSummary {
    id: string;
    name: string;
    description: string;
    extras?: RoomSummaryExtras;
}