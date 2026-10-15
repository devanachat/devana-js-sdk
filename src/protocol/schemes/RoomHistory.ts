export type RoomHistoryMode = 'Full' | 'Ephemeral' | 'MaxAge';

export interface RoomHistory {
    mode: RoomHistoryMode;
    maxAge?: number;
}