import {ChatLocation} from "../ChatLocation";
import {Role} from "../Role";
import {SpaceMember} from "../SpaceMember";

export interface Invited {
    location: ChatLocation;
    spaceMembers: SpaceMember[];
    roles: Role[];
}
