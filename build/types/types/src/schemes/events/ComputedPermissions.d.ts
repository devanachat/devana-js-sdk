import { ChatLocation } from "../ChatLocation";
export interface ComputedPermissions {
    permissions: number;
    location: ChatLocation;
    /**
     * The user the permissions were computed for.
     */
    userId: string;
}
