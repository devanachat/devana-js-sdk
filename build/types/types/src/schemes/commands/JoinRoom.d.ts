export interface JoinRoom {
    id: string;
    /**
     * Ids of the users to add to the room instead of joining it yourself.
     * Requires the `AddMembers` permission.
     */
    userIds?: string[];
    /**
     * Ids of the roles whose members should be added to the room. The space default
     * ("everyone") role is not supported. Requires the `AddMembers` permission.
     */
    roleIds?: string[];
}
