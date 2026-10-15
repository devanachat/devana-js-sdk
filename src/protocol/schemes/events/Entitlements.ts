import {EntitlementsExtras, EntitlementsMap, EntitlementsSubject} from "../Entitlements";

/**
 * Sent in response to `GetEntitlements` and pushed whenever the package of the subject changes -
 * to every member of the space, or to every session of the user. `extras` is filled in only for
 * the answer to the command: usage changes with every file, so it is asked for when it is needed.
 */
export interface Entitlements {
    subject: EntitlementsSubject;
    planCode: string;
    entitlements: EntitlementsMap;
    extras?: EntitlementsExtras | null;
}
