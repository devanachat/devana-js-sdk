import {RoomStream} from "../RoomStream";

export interface UpdateRoom {
    id: string;
    name?: string;
    description?: string;
    flags?: number;
    stream?: RoomStream | null;
}