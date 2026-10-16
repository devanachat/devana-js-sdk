import {ChatLocation} from "../ChatLocation";

/**
 * Computed permissions of a user in the location. Without `userId` those of the requesting
 * user are returned, also in a room that user has not joined. Another user may be asked about when the
 * asking user may read the location, a former member of a room included (their overwrites still apply);
 * on the global layer it requires the global `ManagePermissions` permission.
 */
export interface GetComputedPermissions {
    location: ChatLocation;
    userId?: string;
}
