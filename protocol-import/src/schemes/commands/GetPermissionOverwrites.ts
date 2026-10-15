import {ChatLocation} from "../ChatLocation";
import {PermissionOverwritesTarget} from "../PermissionOverwritesTarget";

export interface GetPermissionOverwrites {
    location: ChatLocation;
    target: PermissionOverwritesTarget;
}