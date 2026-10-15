import {PermissionOverwritesValue} from "../PermissionOverwritesValue";
import {ChatLocation} from "../ChatLocation";
import {PermissionOverwritesTarget} from "../PermissionOverwritesTarget";

export interface PermissionOverwritesUpdated {
    location: ChatLocation;
    target: PermissionOverwritesTarget;
    overwrites: PermissionOverwritesValue;
}