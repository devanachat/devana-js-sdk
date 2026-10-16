import {WebSocketChatClient} from "../WebSocketChatClient";
import {Session, User} from "../protocol";
import {PreviewHistoryWindow, RoomPreviewError} from "./PreviewHistoryWindow";
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

    /**
     * Looks into the history of a room the user has not joined (requires `PreviewRooms` and access to the room).
     *
     * The returned window is filled with the latest messages, or - with `around` - with the surroundings of a message.
     * It has no live events; ask it for new messages with `refresh()`. Nothing is marked as read, the room does not
     * join the joined ones, and the unread counters stay as they are. Call `dispose()` when done.
     *
     * @param options.topicId The topic to read - a thread, for example. The default topic of the room otherwise.
     * @param options.around Id of a message to open the history at.
     * @param options.spaceId Space of the room, when known.
     * @throws RoomPreviewError When the room cannot be previewed; `code` holds the server error code (`ErrorCode`).
     */
    public async previewRoom(
        roomId: string,
        options: {topicId?: string, around?: string, spaceId?: string} = {},
    ): Promise<PreviewHistoryWindow> {
        const result = await this.client.send('GetRoomSummary', {location: {roomId, spaceId: options.spaceId}});

        if (result.error) {
            throw new RoomPreviewError(`Cannot fetch the room summary: ${result.error.message}`, result.error.code);
        }

        const summary = result.data.summary;
        const topicId = options.topicId ?? summary.defaultTopicId;

        if (! topicId) {
            // The server gives the default topic to those who may read the room, so there is no access.
            throw new RoomPreviewError('The room cannot be previewed: no topic to read', 'NoTopic');
        }

        const window = new PreviewHistoryWindow(roomId, topicId, this, summary);

        try {
            await window.load(options.around);
        } catch (error) {
            window.dispose();
            throw error;
        }

        return window;
    }

    private handleSession(ev: Session): void {
        this._me = ev.user;
        this.deferredSession.resolve();
    }
}