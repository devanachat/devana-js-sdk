import {WebSocketChatClient} from "../WebSocketChatClient";
import {Session, User} from "../types/src";
import {RoomsManager} from "./RoomsManager";
import {SpacesManager} from "./SpacesManager";
import {PermissionsManager} from "./PermissionsManager";
import {DeferredTask} from "./AsyncUtils";
import {EmoticonsManager} from "./EmoticonsManager";
import {UsersManager} from "./UsersManager";
import {RelationshipsManager} from "./RelationshipsManager";

export class ChatStateTracker {
    public readonly client: WebSocketChatClient;

    /**
     * State of your permissions.
     */
    public readonly permissions: PermissionsManager;

    /**
     * State of the rooms you are in.
     */
    public readonly rooms: RoomsManager;

    /**
     * State of the spaces you are in.
     */
    public readonly spaces: SpacesManager;

    /**
     * State of the emoticons (global and space-related).
     */
    public readonly emoticons: EmoticonsManager;

    /**
     * Users related state.
     */
    public readonly users: UsersManager;

    /**
     * State of relationships with other users.
     */
    public readonly relationships: RelationshipsManager;

    private _me: User = null;
    private readonly deferredSession = new DeferredTask();

    public constructor(client: WebSocketChatClient) {
        this.client = client;
        this.client.on('Session', ev => this.handleSession(ev));

        this.permissions = new PermissionsManager(this);
        this.rooms = new RoomsManager(this);
        this.spaces = new SpacesManager(this);
        this.emoticons = new EmoticonsManager(this);
        this.users = new UsersManager(this);
        this.relationships = new RelationshipsManager(this);
    }

    public get me(): User | null {
        return this._me;
    }

    public async getMe(): Promise<User> {
        await this.deferredSession.promise;
        return this._me;
    }

    private handleSession(ev: Session): void {
        this._me = ev.user;
        this.deferredSession.resolve();
    }
}