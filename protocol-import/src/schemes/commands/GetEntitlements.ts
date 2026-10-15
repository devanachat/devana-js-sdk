/**
 * Package entitlements of a space (readable by its members) or of an account. Without both
 * fields the entitlements of the requesting user are returned; `userId` may only be their own.
 */
export interface GetEntitlements {
    spaceId?: string;
    userId?: string;
}
