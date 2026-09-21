/**
 * What a package is attached to. A space package and a user package never describe the same
 * feature, so entitlements of the two targets are never merged, summed or prioritised.
 */
export type EntitlementTarget = 'space' | 'user';
/**
 * Subject the entitlements belong to, as the billing service knows it.
 */
export interface EntitlementsSubject {
    target: EntitlementTarget;
    id: string;
}
/**
 * Value of a single entitlement: a flag, a numeric limit ({@link NO_LIMIT} means unlimited)
 * or a dictionary value. A dictionary states its numbers as strings.
 */
export type EntitlementValue = boolean | number | string;
/**
 * Entitlement keys granted by the package, keyed by {@link SpaceFeature} or {@link UserFeature}.
 * A feature the package does not grant is simply absent.
 */
export type EntitlementsMap = Record<string, EntitlementValue>;
/**
 * What the modules of the chat server add to the answer of `GetEntitlements`. The package says
 * how much a subject may take, these say how much of it is already gone.
 */
export interface EntitlementsExtras {
    storageUsedBytes?: number;
}
/**
 * Value of a numeric limit that is not limited at all.
 */
export declare const NO_LIMIT = -1;
/**
 * Entitlement keys of space packages.
 */
export declare enum SpaceFeature {
    MembersLimit = "space.members.limit",
    MembersGuests = "space.members.guests",
    RoomsLimit = "space.rooms.limit",
    RoomsPrivateLimit = "space.rooms.private_limit",
    RoomsArchive = "space.rooms.archive",
    RoomsHistoryRotation = "space.rooms.history_rotation",
    EmoticonsLimit = "space.emoticons.limit",
    MessageLength = "space.message.length",
    StorageLimit = "space.storage.limit",
    StorageSingleFileLimit = "space.storage.single_file_limit",
    AccessWhitelist = "space.access.whitelist",
    SearchRange = "space.search.range",
    ContentExport = "space.content.export",
    ContentAuditLog = "space.content.auditlog",
    AvMemberLimit = "space.av.member_limit",
    AvBroadcasterLimit = "space.av.broadcaster_limit",
    AvQuality = "space.av.quality",
    UiErgonomic = "app.ui.ergonomic",
    ApiAccess = "app.api.access",
    DataSovereignty = "app.data.sovereignty",
    Support = "app.support"
}
/**
 * Entitlement keys of user packages.
 */
export declare enum UserFeature {
    MessageLength = "user.message.length",
    StorageLimit = "user.storage.limit",
    StorageSingleFileLimit = "user.storage.single_file_limit"
}
/**
 * How far back a room of the space may be told to keep its history.
 */
export declare enum HistoryRotation {
    Low = "low",
    High = "high"
}
/**
 * How much of the space search reaches.
 */
export declare enum SearchRange {
    JoinedRooms = "joined_rooms",
    AvailableRooms = "available_rooms"
}
/**
 * `space.storage.limit` is stated in gigabytes; every other storage key is in megabytes.
 */
export declare const SPACE_STORAGE_LIMIT_UNIT_BYTES: number;
export declare const STORAGE_UNIT_BYTES: number;
