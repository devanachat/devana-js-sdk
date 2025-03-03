import {Role, RoomMember, SpaceMember, User} from "../types/src";

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
            role.priority--;
            changedRoles.push(role);
        }
        if (decreased && updatedRole.priority <= role.priority) {
            role.priority++;
            changedRoles.push(role);
        }
    });

    return changedRoles;
}

export function extractUserFromMember(member: RoomMember | SpaceMember): User | null {
    return member.user ?? (member as RoomMember).spaceMember?.user;
}