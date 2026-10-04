import { ChatLocation } from "../ChatLocation";
/**
 * Computed permissions of a user in the location. Without `userId` those of the requesting
 * user are returned. Another user may be asked about only when both are members of the
 * location; on the global layer it requires the global `ManagePermissions` permission.
 */
export interface GetComputedPermissions {
    location: ChatLocation;
    userId?: string;
}
