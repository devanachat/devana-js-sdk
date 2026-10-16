import {ChatLocation} from "../ChatLocation";
import {SpaceMember} from "../SpaceMember";
import {RoomMember} from "../RoomMember";
import {Role} from "../Role";

export interface PermissionOverwriteTargets {
    location: ChatLocation;
    spaceMembers: SpaceMember[] | null;
    /** Former members of the room are included - their overwrites still apply, and they keep their profile. */
    roomMembers: RoomMember[] | null;
    roles: Role[] | null;
}