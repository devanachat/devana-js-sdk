import {WebSocketChatClient} from "./WebSocketChatClient";
import {WebApiChatClient} from "./WebApiChatClient";
import {
    IndexedCollection,
    IndexedObjectCollection,
    ObservableIndexedCollection,
    ObservableIndexedObjectCollection
} from "./IndexedObjectCollection";
import {FilesClient, File} from "./FilesClient";
import { Permissions, PermissionDefinition, Layer } from "./Permissions";
import * as ChatTypes from './protocol';
import {
    ErrorCode,
    HistoryRotation,
    NO_LIMIT,
    RoleFlag,
    SearchRange,
    UiPurpose,
    SpaceFeature,
    SpaceIntent,
    STORAGE_UNIT_BYTES,
    UserFeature,
    UserStatus,
} from './protocol';
import {extractUserFromMember} from "./state-tracker/functions";
import {AbstractRestClient} from "./AbstractRestClient";
import {UnreadSummary} from "./state-tracker/FollowedTopicsManager";
import {TopicHistoryWindow} from "./state-tracker/TopicHistoryWindow";
import {PermissionsManager} from "./state-tracker/PermissionsManager";
import {STATE_SNAPSHOT_VERSION} from "./state-tracker/StateSnapshot";

export {
    IndexedCollection, ObservableIndexedCollection,
    IndexedObjectCollection, ObservableIndexedObjectCollection,
    Permissions, PermissionDefinition, Layer,
    WebSocketChatClient, WebApiChatClient,
    FilesClient,
    AbstractRestClient,
    extractUserFromMember,
    ErrorCode,
    UserStatus,
    RoleFlag,
    SpaceFeature,
    UserFeature,
    HistoryRotation,
    SearchRange,
    UiPurpose,
    SpaceIntent,
    NO_LIMIT,
    STORAGE_UNIT_BYTES,
    STATE_SNAPSHOT_VERSION,
};

export type {
    CommandResult,
    CommandRequest,
    CommandResponse,
    CommandsMap,
    EventsMap,
} from "./AbstractChatClient";
export type {WebSocketClientOptions} from "./WebSocketChatClient";
export type {WebApiChatClientOptions} from "./WebApiChatClient";
export type {RestClientOptions, RestClientResponse} from "./AbstractRestClient";
export type {EventHandler, ObservableInterface} from "./EventTarget";
export type {
    StateSnapshot,
    SpaceRoomsSnapshot,
    RoomFollowedTopicsSnapshot,
    EmoticonsSnapshot,
    StateSnapshotIntent,
    TopicHistorySnapshot,
    RoomMembersSnapshot,
} from "./state-tracker/StateSnapshot";

export type {
    ChatTypes,
    File,
    UnreadSummary,
    TopicHistoryWindow,
    PermissionsManager,
};