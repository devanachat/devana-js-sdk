import {
    Emoticon,
    FollowedTopic,
    Message,
    Room,
    RoomMember,
    RoomSummary,
    Space,
    Topic,
    User,
    UserReaction,
    UserRelationship,
    UserStatus,
} from "../protocol";

/**
 * Version of the {@link StateSnapshot} format. A snapshot of any other version is rejected on import.
 */
export const STATE_SNAPSHOT_VERSION = 1;

/**
 * Plain, JSON-serializable copy of the state tracked by {@link ChatStateTracker}, made to restore the state at the
 * application start (before the connection is established) - see {@link ChatStateTracker.exportSnapshot}.
 *
 * Only the data that lasts is included: the current user, the joined spaces (with roles) and rooms (with the default
 * topics), and the lazily loaded lists already fetched - rooms of spaces, followed topics, emoticons and relationships.
 * The message histories of the topics named in the {@link StateSnapshotIntent} are included too, with what their
 * display needs: the topics referenced by the messages and, optionally, the members of the rooms.
 * Left out on purpose:
 * - presence - every user status is saved as `Offline`, a status from the past would show people online who are not;
 * - members of spaces, and of rooms not asked for - large, made mostly of presence, and refetched cheaply on demand;
 * - other message histories and topics, histories of ephemeral rooms (they live only in the memory of the session),
 *   permission overwrites and room previews - loaded on demand once the connection is up, as on a reconnect.
 */
export interface StateSnapshot {
    version: typeof STATE_SNAPSHOT_VERSION;
    /**
     * Time of the export, in milliseconds since the epoch.
     */
    createdAt: number;
    user: User;
    spaces: Space[];
    rooms: Room[];
    spaceRooms: SpaceRoomsSnapshot[];
    followedTopics: RoomFollowedTopicsSnapshot[];
    emoticons: EmoticonsSnapshot[];
    /**
     * Null when the relationships have not been loaded.
     */
    relationships: UserRelationship[] | null;
    histories: TopicHistorySnapshot[];
    roomMembers: RoomMembersSnapshot[];
}

/**
 * What {@link ChatStateTracker.exportSnapshot} should include beyond the state that is always exported.
 */
export interface StateSnapshotIntent {
    /**
     * Topics to save the latest messages of, e.g. the ones last open in the application. Without `topicId`, the default
     * topic of the room. Only a history window holding the latest messages (the `LATEST` state) is saved.
     */
    histories?: {roomId: string; topicId?: string}[];
    /**
     * Messages saved per topic, the latest ones. Never fewer than the `fetchLimit` of the window (50 by default), so a
     * restored window tells right whether it reaches the oldest message. Defaults to that `fetchLimit`.
     */
    historyLimit?: number;
    /**
     * Save the members of the rooms of the histories (for the roles, colors and avatars of the authors) when they are
     * loaded and there are not more of them than this. Defaults to 0 - none.
     */
    roomMembersLimit?: number;
}

export interface TopicHistorySnapshot {
    roomId: string;
    topicId: string;
    /**
     * Oldest first.
     */
    messages: Message[];
    myReactions: Record<string, UserReaction[]>;
    /**
     * The topic of the history (if not the default one of the room) and the topics the messages refer to, as far as
     * they are known.
     */
    topics: Topic[];
}

export interface RoomMembersSnapshot {
    roomId: string;
    members: RoomMember[];
}

export interface SpaceRoomsSnapshot {
    spaceId: string;
    summaries: RoomSummary[];
}

export interface RoomFollowedTopicsSnapshot {
    roomId: string;
    followedTopics: FollowedTopic[];
}

export interface EmoticonsSnapshot {
    /**
     * Null for the global emoticons.
     */
    spaceId: string | null;
    emoticons: Emoticon[];
}

export function withoutPresence(user: User): User {
    return {...user, status: UserStatus.Offline, online: false};
}

export function messageWithoutPresence(message: Message): Message {
    return {...message, author: {...message.author, user: withoutPresence(message.author.user)}};
}

export function memberWithoutPresence(member: RoomMember): RoomMember {
    return {
        ...member,
        user: member.user ? withoutPresence(member.user) : member.user,
        spaceMember: member.spaceMember
            ? {...member.spaceMember, user: withoutPresence(member.spaceMember.user)}
            : member.spaceMember,
    };
}

/**
 * Structural check of the data restored from a storage - deep enough that importing it cannot throw, as the state
 * handlers dereference these fields without checking them.
 */
export function isValidStateSnapshot(value: unknown): value is StateSnapshot {
    return isObject(value)
        && value.version === STATE_SNAPSHOT_VERSION
        && typeof value.createdAt === 'number'
        && isUser(value.user)
        && isArrayOf(value.spaces, isSpace)
        && isArrayOf(value.rooms, isRoom)
        && isArrayOf(value.spaceRooms, isSpaceRooms)
        && isArrayOf(value.followedTopics, isRoomFollowedTopics)
        && isArrayOf(value.emoticons, isEmoticons)
        && (value.relationships === null || isArrayOf(value.relationships, isRelationship))
        && isArrayOf(value.histories, isTopicHistory)
        && isArrayOf(value.roomMembers, isRoomMembers);
}

type UnknownObject = Record<string, unknown>;

function isObject(value: unknown): value is UnknownObject {
    return typeof value === 'object' && value !== null && ! Array.isArray(value);
}

function isArrayOf(value: unknown, isItem: (item: unknown) => boolean): boolean {
    return Array.isArray(value) && value.every(isItem);
}

function isString(value: unknown): value is string {
    return typeof value === 'string';
}

function hasId(value: unknown): value is UnknownObject {
    return isObject(value) && isString(value.id);
}

function isUser(value: unknown): boolean {
    return hasId(value);
}

function isRole(value: unknown): boolean {
    return hasId(value) && typeof value.priority === 'number';
}

function isSpace(value: unknown): boolean {
    return hasId(value)
        && isArrayOf(value.roles, isRole)
        && isArrayOf(value.defaultRooms, isString)
        && (value.systemRoom === null || isString(value.systemRoom));
}

function isTopic(value: unknown): boolean {
    return hasId(value) && (value.refMessage === undefined || value.refMessage === null || isMessage(value.refMessage));
}

function isMessage(value: unknown): boolean {
    return hasId(value) && isObject(value.location) && isString(value.location.topicId);
}

function isFullMessage(value: unknown): boolean {
    return hasId(value)
        && isObject(value.location)
        && isString(value.location.roomId)
        && isString(value.location.topicId)
        && isObject(value.author)
        && isUser(value.author.user)
        && Array.isArray(value.reactions);
}

function isRoom(value: unknown): boolean {
    return hasId(value)
        && isString(value.type)
        && (value.spaceId === null || isString(value.spaceId))
        && (value.defaultTopic === null || isTopic(value.defaultTopic))
        && (value.recipients === null || isArrayOf(value.recipients, isUser))
        && isObject(value.history)
        && isString(value.history.mode);
}

function isSpaceRooms(value: unknown): boolean {
    return isObject(value) && isString(value.spaceId) && isArrayOf(value.summaries, hasId);
}

function isFollowedTopic(value: unknown): boolean {
    return isObject(value) && isObject(value.location) && isString(value.location.roomId) && isString(value.location.topicId);
}

function isRoomFollowedTopics(value: unknown): boolean {
    return isObject(value) && isString(value.roomId) && isArrayOf(value.followedTopics, isFollowedTopic);
}

function isEmoticons(value: unknown): boolean {
    return isObject(value) && (value.spaceId === null || isString(value.spaceId)) && isArrayOf(value.emoticons, hasId);
}

function isRelationship(value: unknown): boolean {
    return isObject(value) && isUser(value.refUser) && isString(value.type);
}

function isUserReactions(value: unknown): boolean {
    return isObject(value) && Object.values(value).every(reactions => isArrayOf(reactions, isObject));
}

function isTopicHistory(value: unknown): boolean {
    return isObject(value)
        && isString(value.roomId)
        && isString(value.topicId)
        && isArrayOf(value.messages, isFullMessage)
        && isUserReactions(value.myReactions)
        && isArrayOf(value.topics, isTopic);
}

function isRoomMember(value: unknown): boolean {
    return isObject(value)
        && (isUser(value.user) || (isObject(value.spaceMember) && isUser(value.spaceMember.user)));
}

function isRoomMembers(value: unknown): boolean {
    return isObject(value) && isString(value.roomId) && isArrayOf(value.members, isRoomMember);
}
