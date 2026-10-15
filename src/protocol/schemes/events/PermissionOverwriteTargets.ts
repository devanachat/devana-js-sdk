import {ChatLocation} from "../ChatLocation";
import {SpaceMember} from "../SpaceMember";
import {RoomMember} from "../RoomMember";
import {Role} from "../Role";

export interface PermissionOverwriteTargets {
    location: ChatLocation;
    spaceMembers: SpaceMember[] | null;
    roomMembers: RoomMember[] | null;
    roles: Role[] | null;
}