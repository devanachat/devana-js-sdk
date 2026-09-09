/**
 * Bit flags of a role, stored in {@link Role.flags}.
 *
 * - `SeparateOnMembersList` - available holders of the role are listed in their
 *   own group of the members list, headed by the role name.
 * - `MentionableByEveryone` - anybody may mention the role with notification
 *   effects; without it the mention is decorative only, unless the author holds
 *   the `MentionAllRoles` permission.
 */
export declare enum RoleFlag {
    SeparateOnMembersList = 1,
    MentionableByEveryone = 2
}
export interface Role {
    id: string;
    priority: number;
    name: string;
    color?: string;
    flags: number;
}
