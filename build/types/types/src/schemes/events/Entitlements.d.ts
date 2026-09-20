import { EntitlementsMap, EntitlementsSubject } from "../Entitlements";
/**
 * Sent in response to `GetEntitlements` and pushed whenever the package of the subject changes -
 * to every member of the space, or to every session of the user.
 */
export interface Entitlements {
    subject: EntitlementsSubject;
    planCode: string;
    entitlements: EntitlementsMap;
}
