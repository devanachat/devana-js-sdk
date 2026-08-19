import { SessionPush } from "./commands/SetSessionData";
/**
 * Platform of a client session. Reported on connect (the `platform` query
 * parameter) and independent of the push registration.
 */
export type SessionPlatform = 'web' | 'ios' | 'android' | 'desktop';
export interface SessionData {
    platform?: SessionPlatform;
    push?: SessionPush;
}
