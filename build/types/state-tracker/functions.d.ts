import { Role, RoomMember, SpaceMember, User } from "../types/src";
/**
 * @return New objects of the other roles whose priority has to move; the given roles are left intact.
 */
export declare function reorderRolesOnPriorityUpdate(allRoles: Role[], oldRole: Role, updatedRole: Role): Role[];
export declare function extractUserFromMember(member: RoomMember | SpaceMember): User | null;
