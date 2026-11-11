export interface ErrorDetails {
    roomId?: string;
}

export interface Error {
    code: string;
    message: string;
    details?: ErrorDetails | null;
    subcode?: string | null;
}

export enum ErrorCode {
    Authentication = 'AuthenticationException',
    CommandRateLimitExceeded = 'CommandRateLimitExceededException',
    InvalidSearchQuery = 'InvalidSearchQueryException',
    MessageSearchUnavailable = 'MessageSearchUnavailableException',
    MessageNotFound = 'MessageNotFoundException',
    RoomIgnored = 'RoomIgnoredException',
    RoomNotFound = 'RoomNotFoundException',
    SpaceJoinRestricted = 'SpaceJoinRestrictedException',
    TopicNotFound = 'TopicNotFoundException',
    UserNotFound = 'UserNotFoundException',
}
