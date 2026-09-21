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
import * as ChatTypes from './types/src';
import {
    HistoryRotation,
    NO_LIMIT,
    RoleFlag,
    SearchRange,
    SPACE_STORAGE_LIMIT_UNIT_BYTES,
    SpaceFeature,
    STORAGE_UNIT_BYTES,
    UserFeature,
    UserStatus,
} from './types/src';
import {extractUserFromMember} from "./state-tracker/functions";
import {AbstractRestClient} from "./AbstractRestClient";
import {UnreadSummary} from "./state-tracker/FollowedTopicsManager";

export {
    IndexedCollection, ObservableIndexedCollection,
    IndexedObjectCollection, ObservableIndexedObjectCollection,
    Permissions, PermissionDefinition, Layer,
    WebSocketChatClient, WebApiChatClient,
    FilesClient,
    AbstractRestClient,
    extractUserFromMember,
    UserStatus,
    RoleFlag,
    SpaceFeature,
    UserFeature,
    HistoryRotation,
    SearchRange,
    NO_LIMIT,
    SPACE_STORAGE_LIMIT_UNIT_BYTES,
    STORAGE_UNIT_BYTES,
};

export type {
    ChatTypes,
    File,
    UnreadSummary,
};