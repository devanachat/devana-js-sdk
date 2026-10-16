export interface Error {
    code: string;
    message: string;
}

export enum ErrorCode {
    Authentication = 'AuthenticationException',
    CommandRateLimitExceeded = 'CommandRateLimitExceededException',
    InvalidSearchQuery = 'InvalidSearchQueryException',
    MessageSearchUnavailable = 'MessageSearchUnavailableException',
    MessageNotFound = 'MessageNotFoundException',
    RoomNotFound = 'RoomNotFoundException',
    TopicNotFound = 'TopicNotFoundException',
    UserNotFound = 'UserNotFoundException',
}
