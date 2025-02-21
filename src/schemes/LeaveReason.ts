import {BanObject} from "./BanObject";

export interface LeaveReason {
    type: 'Leave' | 'Ban' | 'Kick';
    ban?: BanObject;
    kick?: string;
}