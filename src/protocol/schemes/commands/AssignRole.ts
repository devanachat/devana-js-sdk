import {ChatLocation} from "../ChatLocation";

export interface AssignRole {
    roleId: string;
    userId: string;
    location: ChatLocation;
}
