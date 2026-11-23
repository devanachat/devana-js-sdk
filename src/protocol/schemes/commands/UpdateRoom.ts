import {RoomStream} from "../RoomStream";
import {RoomHistory} from "../RoomHistory";
import {RoomCall} from "../RoomCall";

export interface UpdateRoom {
    id: string;
    name?: string;
    description?: string;
    flags?: number;
    stream?: RoomStream | null;
    history?: RoomHistory;
    call?: RoomCall;
}