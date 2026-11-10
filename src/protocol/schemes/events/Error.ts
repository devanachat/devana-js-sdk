export interface ErrorDetails {
    roomId?: string;
}

export interface Error {
    code: string;
    message: string;
    details?: ErrorDetails | null;
}

export enum ErrorCode {
    Authentication = 'AuthenticationException',
    CommandRateLimitExceeded = 'CommandRateLimitExceededException',
    InvalidSearchQuery = 'InvalidSearchQueryException',
    MessageSearchUnavailable = 'MessageSearchUnavailableException',
    MessageNotFound = 'MessageNotFoundException',
    RoomIgnored = 'RoomIgnoredException',
    RoomNotFound = 'RoomNotFoundException',
    TopicNotFound = 'TopicNotFoundException',
    UserNotFound = 'UserNotFoundException',
}
