import {CallMode} from "./Call";

export interface RoomCall {
    mode: CallMode;
    userLimit: number | null;
    turnSeconds: number;
}
