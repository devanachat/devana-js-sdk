import { ChatLocation } from "../ChatLocation";
import { Role } from "../Role";
export interface Invited {
    location: ChatLocation;
    /**
     * Ids of the invited users. Join them with the space member collection to display them.
     */
    userIds: string[];
    roles: Role[];
}
