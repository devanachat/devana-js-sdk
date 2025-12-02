export interface UpdateRoomMember {
    roomId: string;
    userId: string;
    customNick?: string|null;
    customColor?: string|null;
    extras?: string|null;
}