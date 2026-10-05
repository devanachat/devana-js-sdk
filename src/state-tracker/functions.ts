import {Role, RoomMember, SpaceMember, User} from "../types/src";

/**
 * @return New objects of the other roles whose priority has to move; the given roles are left intact.
 */
export function reorderRolesOnPriorityUpdate(allRoles: Role[], oldRole: Role, updatedRole: Role): Role[] {
    // If the priority has changed, adjust the rest of roles
    const increased = (updatedRole.priority - oldRole.priority) > 0;
    const decreased = ! increased;
    const changedRoles: Role[] = [];

    allRoles.forEach(role => {
        if (role.id === updatedRole.id) {
            // Skip the updated role
            return;
        }
        if (increased && oldRole.priority <= role.priority) {
            changedRoles.push({...role, priority: role.priority - 1});
        }
        if (decreased && updatedRole.priority <= role.priority) {
            changedRoles.push({...role, priority: role.priority + 1});
        }
    });

    return changedRoles;
}

export function extractUserFromMember(member: RoomMember | SpaceMember): User | null {
    return member.user ?? (member as RoomMember).spaceMember?.user;
}