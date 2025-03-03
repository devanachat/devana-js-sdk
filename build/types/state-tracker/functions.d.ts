import { Role, RoomMember, SpaceMember, User } from "../types/src";
export declare function reorderRolesOnPriorityUpdate(allRoles: Role[], oldRole: Role, updatedRole: Role): Role[];
export declare function extractUserFromMember(member: RoomMember | SpaceMember): User | null;
