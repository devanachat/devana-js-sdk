export interface UpdateRoomMember {
    roomId: string;
    userId: string;
    customNick?: string | null;
    customColor?: string | null;
    customAvatar?: string | null;
    extras?: string | null;
}
