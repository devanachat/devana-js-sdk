import { SessionPlatform } from "../SessionData";
export interface SessionPush {
    token?: string;
    active?: boolean;
    /**
     * @deprecated The platform describes the session, not its push registration.
     * Use {@link SetSessionData.platform} (or the `platform` connection query
     * parameter). Still accepted by the server, but the top-level field wins.
     */
    platform?: SessionPlatform;
}
export interface SetSessionData {
    clientFocused?: boolean;
    push?: SessionPush;
    /** Client platform of this session; null leaves the stored value unchanged. */
    platform?: SessionPlatform;
}
