import {ChatLocation} from "../ChatLocation";

export interface DeassignRole {
    roleId: string;
    userId: string;
    location: ChatLocation;
}
