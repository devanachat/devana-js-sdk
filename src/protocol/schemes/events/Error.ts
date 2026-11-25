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
    CallFull = 'CallFullException',
    CallMode = 'CallModeException',
    CallNotFound = 'CallNotFoundException',
    CallsNotAccepted = 'CallsNotAcceptedException',
    CallsUnavailable = 'CallsUnavailableException',
    CommandRateLimitExceeded = 'CommandRateLimitExceededException',
    InvalidSearchQuery = 'InvalidSearchQueryException',
    MessageSearchUnavailable = 'MessageSearchUnavailableException',
    MessageNotFound = 'MessageNotFoundException',
    ReactionExistsAlready = 'ReactionExistsAlreadyException',
    RoomIgnored = 'RoomIgnoredException',
    RoomNotFound = 'RoomNotFoundException',
    SavedItemsLimitReached = 'SavedItemsLimitReachedException',
    SpaceJoinRestricted = 'SpaceJoinRestrictedException',
    TooManyCallInvitees = 'TooManyCallInviteesException',
    TopicNotFound = 'TopicNotFoundException',
    UserNotFound = 'UserNotFoundException',
}
