import {CallMember, CallMode} from "./Call";

export type MessageCallStatus = 'Ongoing' | 'Ended' | 'Missed' | 'Declined';

export interface MessageCall {
    status: MessageCallStatus;
    mode: CallMode;
    duration: number | null;
    partialMembers: CallMember[];
    memberCount: number;
}
