export type UserTags = 'bot' | 'temp' | string;
/**
 * Availability of a user, aggregated over all of their sessions.
 *
 * - `Offline` - no session is connected and none can be reached asynchronously.
 * - `Online` - at least one session holds a live connection.
 * - `OnlineAsync` - no live connection, but a push-registered device was active
 *   recently, so a message will still reach the user.
 */
export declare enum UserStatus {
    Offline = 0,
    Online = 1,
    OnlineAsync = 2
}
export interface User {
    id: string;
    nick: string;
    avatar: string;
    tags: UserTags[];
    status: UserStatus;
    /** @deprecated Use {@link status}. Kept for clients older than the numeric status. */
    online: boolean;
}
