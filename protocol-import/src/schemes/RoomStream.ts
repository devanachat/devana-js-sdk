export type RoomStreamType = 'Direct' | 'Shoutcast';

export interface RoomStream {
    type: RoomStreamType;
    url: string;
}