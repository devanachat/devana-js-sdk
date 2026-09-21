import { EntitlementsSubject } from "../Entitlements";
/**
 * A limit of the package is running out (80%) or is used up (100%). Only the owners of the space
 * are told, because only they can raise the package.
 */
export interface EntitlementUsage {
    subject: EntitlementsSubject;
    feature: string;
    usage: number;
    limit: number;
}
