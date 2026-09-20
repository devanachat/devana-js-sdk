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
 * or a setting.
 */
export type EntitlementValue = boolean | number | string;
/**
 * Entitlement keys granted by the package, keyed by {@link SpaceFeature} or {@link UserFeature}.
 * A feature the package does not grant is simply absent.
 */
export type EntitlementsMap = Record<string, EntitlementValue>;
/**
 * Value of a numeric limit that is not limited at all.
 */
export declare const NO_LIMIT = -1;
/**
 * Entitlement keys of space packages.
 */
export declare enum SpaceFeature {
    MembersLimit = "space.members.limit",
    RoomsLimit = "space.rooms.limit",
    StorageLimitMb = "space.storage.limit_mb",
    EmoticonsLimit = "space.emoticons.limit",
    BotsLimit = "space.bots.limit",
    Insights = "space.insights",
    Discoverable = "space.discoverable",
    Branding = "space.branding",
    Support = "space.support"
}
/**
 * Entitlement keys of user packages.
 */
export declare enum UserFeature {
    BotsLimit = "user.bots.limit",
    UploadMaxFileMb = "user.upload.max_file_mb",
    AnimatedAvatar = "user.animated_avatar",
    Badge = "user.badge"
}
