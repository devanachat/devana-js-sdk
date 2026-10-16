export interface Error {
    code: string;
    message: string;
}

/**
 * Codes of the errors (`Error.code`) worth telling apart. The server can answer with other codes too.
 */
export enum ErrorCode {
    Authentication = 'AuthenticationException',
    CommandRateLimitExceeded = 'CommandRateLimitExceededException',
    /** `SearchMessages`: invalid query or filter; the message names the field. */
    InvalidSearchQuery = 'InvalidSearchQueryException',
    /** `SearchMessages`: the server has no search engine. */
    MessageSearchUnavailable = 'MessageSearchUnavailableException',
    MessageNotFound = 'MessageNotFoundException',
    RoomNotFound = 'RoomNotFoundException',
    TopicNotFound = 'TopicNotFoundException',
    /** Also: a room you may not read, or a command that needs the membership of a room you only preview. */
    UserNotFound = 'UserNotFoundException',
}
