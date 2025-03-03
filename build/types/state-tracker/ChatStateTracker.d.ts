import { WebSocketChatClient } from "../WebSocketChatClient";
import { User } from "../types/src";
import { RoomsManager } from "./RoomsManager";
import { SpacesManager } from "./SpacesManager";
import { PermissionsManager } from "./PermissionsManager";
import { EmoticonsManager } from "./EmoticonsManager";
import { Utils } from "./Utils";
export declare class ChatStateTracker {
    readonly client: WebSocketChatClient;
    /**
     * State of your permissions.
     */
    readonly permissions: PermissionsManager;
    /**
     * State of the rooms you are in.
     */
    readonly rooms: RoomsManager;
    /**
     * State of the spaces you are in.
     */
    readonly spaces: SpacesManager;
    /**
     * State of the emoticons (global and space-related).
     */
    readonly emoticons: EmoticonsManager;
    /**
     * Various utilities.
     */
    readonly utils: Utils;
    private _me;
    private readonly deferredSession;
    constructor(client: WebSocketChatClient);
    get me(): User | null;
    getMe(): Promise<User>;
    private handleSession;
}
