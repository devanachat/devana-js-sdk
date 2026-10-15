import {RoomMember} from "../RoomMember";

export interface RoomMemberUpdated {
    roomId: string;
    userId: string;
    member: RoomMember;
}