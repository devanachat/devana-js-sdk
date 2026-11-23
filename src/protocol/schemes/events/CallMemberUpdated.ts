import {CallMember} from "../Call";

export interface CallMemberUpdated {
    roomId: string;
    userId: string;
    member: CallMember;
}
