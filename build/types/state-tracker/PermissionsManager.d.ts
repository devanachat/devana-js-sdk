import { ChatStateTracker } from "./ChatStateTracker";
import { ChatLocation, PermissionOverwrites, PermissionOverwritesTarget } from "../types/src";
import { ChangeEventMap, EventTarget } from "../EventTarget";
import { Permissions } from "../Permissions";
interface CheckPermissionsResult {
    /**
     * @deprecated Use `hasAll` instead.
     */
    ok: boolean;
    hasAll: boolean;
    hasAny: boolean;
    missing: string[];
}
type PermissionsManagerEventMap = ChangeEventMap<void>;
export declare class PermissionsManager extends EventTarget<PermissionsManagerEventMap> {
    private tracker;
    private readonly overwrites;
    private readonly overwritesPromises;
    constructor(tracker: ChatStateTracker);
    getOverwrites(location: ChatLocation, target: PermissionOverwritesTarget): Promise<PermissionOverwrites | undefined>;
    check(permissionNames: (keyof typeof Permissions.list)[], location: ChatLocation): Promise<CheckPermissionsResult>;
    calculatePermissions(location: ChatLocation): Promise<number>;
    private handlePermissionOverwrites;
    private handleSpaceDeleted;
    private handleRoomDeleted;
    private handleTopicDeleted;
    private handleRoleDeleted;
    private handleSpaceMemberUpdated;
    private handleRoomMemberUpdated;
    /**
     * @return Matched and deleted ids
     */
    private deleteOverwritesByIdPrefix;
    private collectRoleOverwrites;
    private resolveOverwritesFromRolesByOrder;
    private resolveOverwritesHierarchy;
    private getRootAccessValue;
    private fetchMembersOrFail;
    private validateLocation;
    private handleSession;
}
export {};
