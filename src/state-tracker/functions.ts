import {
    MessageReaction,
    PmParticipant,
    PmParticipantFlag,
    Role,
    Room,
    RoomMember,
    SpaceMember,
    ToggledReaction,
    User,
    UserReaction,
} from "../protocol";

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

/**
 * Whether the room is a private group conversation - 3 or more participants, including the ones ignoring it.
 */
export function isGroupPm(room: Room): boolean {
    return room.type === 'Pm' && (room.participants?.length ?? 0) >= 3;
}

/**
 * Participants of a private conversation taking part in it: without the ones ignoring it and without the user
 * `meId`. Empty for notes and for rooms of spaces.
 */
export function getPmPeers(room: Room, meId: string): PmParticipant[] {
    return getActivePmParticipants(room).filter(participant => participant.user.id !== meId);
}

export function getActivePmParticipants(room: Room): PmParticipant[] {
    return (room.participants ?? []).filter(participant => ! (participant.flags & PmParticipantFlag.IgnoresRoom));
}

export function isSameUser(a: User, b: User): boolean {
    const keys = Object.keys(a) as (keyof User)[];

    if (keys.length !== Object.keys(b).length) {
        return false;
    }

    return keys.every(key => {
        const valueA = a[key];
        const valueB = b[key];

        if (Array.isArray(valueA) && Array.isArray(valueB)) {
            return valueA.length === valueB.length && valueA.every((item, index) => item === valueB[index]);
        }

        return valueA === valueB;
    });
}

/**
 * The counter arrives as the global source of truth - only it is overwritten, and a reaction nobody holds any more
 * (count 0) leaves the message.
 * @return Null when the reactions stay as they are.
 */
export function applyReactionCounter(reactions: MessageReaction[], counter: MessageReaction): MessageReaction[] | null {
    const index = reactions.findIndex(reaction => reaction.type === counter.type && reaction.value === counter.value);

    if (index === -1 && ! counter.count) {
        return null;
    }

    const next = [...reactions];

    if (index === -1) {
        next.push(counter);
    } else if (counter.count) {
        next[index] = counter; // In place - a pill must not jump around as its counter moves
    } else {
        next.splice(index, 1);
    }

    return next;
}

export function applyToggledReaction(own: UserReaction[], toggled: ToggledReaction): UserReaction[] {
    const {type, value, isAdded} = toggled;
    const next = own.filter(reaction => reaction.type !== type || reaction.value !== value);

    if (isAdded) {
        next.push({type, value});
    }

    return next;
}
