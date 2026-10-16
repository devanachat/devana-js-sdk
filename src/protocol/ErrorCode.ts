/**
 * Codes of the `Error` event (`error.code` of a failed command) that the SDK users are expected to tell apart.
 * The server may answer with others, so `error.code` stays a plain string.
 */
export const ErrorCode = {
    /** `SearchMessages`: a field or the query is invalid; the message names the field, never its value. */
    InvalidSearchQuery: 'InvalidSearchQueryException',
    /** `SearchMessages`: there is no search engine on the server. Hide the search instead of showing "no results". */
    MessageSearchUnavailable: 'MessageSearchUnavailableException',
    /** `SearchMessages` (`in` outside of the searched range) and the commands of a room that cannot be seen at all. */
    RoomNotFound: 'RoomNotFoundException',
    /** A room one may not read (no membership and no `PreviewRooms`), or a command that needs the membership. */
    UserNotFound: 'UserNotFoundException',
    /** A message outside of the readable rooms, e.g. in `ReportAbuse`. */
    MessageNotFound: 'MessageNotFoundException',
    TopicNotFound: 'TopicNotFoundException',
    /** The per-command rate limit was exceeded (`SearchMessages`: 30 a minute). */
    CommandRateLimitExceeded: 'CommandRateLimitExceededException',
    Authentication: 'AuthenticationException',
} as const;

export type ErrorCodeValue = typeof ErrorCode[keyof typeof ErrorCode];
