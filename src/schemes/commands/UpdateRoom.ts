import {RoomStream} from "../RoomStream";
import {RoomHistory} from "../RoomHistory";

export interface UpdateRoom {
    id: string;
    name?: string;
    description?: string;
    flags?: number;
    stream?: RoomStream | null;
    history?: RoomHistory;
}