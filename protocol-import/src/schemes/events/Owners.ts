import {ChatLocation} from "../ChatLocation";
import {RoomMember} from "../RoomMember";
import {SpaceMember} from "../SpaceMember";

export interface Owners {
    location: ChatLocation;
    spaceMembers: SpaceMember[] | null;
    roomMembers: RoomMember[] | null;
}