import {SpaceMember} from "../SpaceMember";

export interface SpaceMemberUpdated {
    spaceId: string;
    userId: string;
    member: SpaceMember;
}
