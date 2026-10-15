import {LeaveReason} from "../LeaveReason";

export interface RoomLeft {
    id: string;
    reason: LeaveReason;
}
