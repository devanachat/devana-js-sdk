import {ChatLocation} from "../ChatLocation";
import {PermissionOverwritesTarget} from "../PermissionOverwritesTarget";

export interface GetPermissionOverwritesQuery {
    location: ChatLocation;
    target: PermissionOverwritesTarget;
}

/**
 * Answered with `PermissionOverwritesList`: one result for each query, in their order. At most 50 queries, referring
 * to at most 4 different locations.
 */
export interface GetPermissionOverwritesBatch {
    queries: GetPermissionOverwritesQuery[];
}

/**
 * Answered with a single `PermissionOverwrites`.
 * @deprecated Send `queries` instead.
 */
export interface GetSinglePermissionOverwrites {
    location: ChatLocation;
    target: PermissionOverwritesTarget;
}

export type GetPermissionOverwrites = GetPermissionOverwritesBatch | GetSinglePermissionOverwrites;
