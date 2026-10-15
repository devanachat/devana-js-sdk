export interface PermissionOverwritesTarget {
    type: 'User' | 'Role';
    userId?: string;
    roleId?: string;
}