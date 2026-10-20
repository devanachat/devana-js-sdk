import {WebSocketChatClient} from "../WebSocketChatClient";
import {Session, User} from "../protocol";
import {RoomsManager} from "./RoomsManager";
import {SpacesManager} from "./SpacesManager";
import {PermissionsManager} from "./PermissionsManager";
import {DeferredTask} from "./AsyncUtils";
import {EmoticonsManager} from "./EmoticonsManager";
import {UsersManager} from "./UsersManager";
import {RelationshipsManager} from "./RelationshipsManager";
import {
    isValidStateSnapshot,
    STATE_SNAPSHOT_VERSION,
    StateSnapshot,
    StateSnapshotIntent,
    withoutPresence,
} from "./StateSnapshot";

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
    private sessionReceived = false;
    private snapshotImported = false;

    public constructor(client: WebSocketChatClient) {
        this.client = client;
        this.client.on('Session', ev => this.handleSession(ev));

        this.permissions = new PermissionsManager(this);
        this.rooms = new RoomsManager(this);
        this.spaces = new SpacesManager(this);
        this.emoticons = new EmoticonsManager(this);
        this.users = new UsersManager(this);
        this.relationships = new RelationshipsManager(this);

        // Registered after the managers, so it runs once they have applied the session.
        this.client.on('Session', ev => this.handleSessionAfterImport(ev));
    }

    public get me(): User | null {
        return this._me;
    }

    public async getMe(): Promise<User> {
        await this.deferredSession.promise;
        return this._me;
    }

    /**
     * Export the tracked state to a plain, JSON-serializable object, to be saved and restored with
     * {@link importSnapshot} at the next start of the application, before the connection is established.
     * See {@link StateSnapshot} for what is included.
     * @param intent What to include beyond the state that is always exported, e.g. the message histories.
     * @return Null if there is no state yet (no session has been received or imported).
     */
    public exportSnapshot(intent: StateSnapshotIntent = {}): StateSnapshot | null {
        if (! this._me) {
            return null;
        }

        const snapshot: StateSnapshot = {
            version: STATE_SNAPSHOT_VERSION,
            createdAt: Date.now(),
            user: withoutPresence(this._me),
            spaces: this.spaces._exportSpaces(),
            rooms: this.rooms._exportRooms(),
            spaceRooms: this.spaces._exportSpaceRooms(),
            followedTopics: this.rooms.followedTopics._exportFollowedTopics(),
            emoticons: this.emoticons._exportEmoticons(),
            relationships: this.relationships._exportRelationships(),
            histories: this.rooms._exportHistories(intent),
            roomMembers: this.rooms._exportMembers(
                (intent.histories ?? []).map(history => history.roomId),
                intent.roomMembersLimit ?? 0,
            ),
        };

        // Detaches the snapshot from the live state objects and leaves nothing a JSON round trip would change.
        return JSON.parse(JSON.stringify(snapshot));
    }

    /**
     * Restore the state exported with {@link exportSnapshot}, so it is available before the connection is
     * established. The collections emit their usual change events and the getters waiting for the session resolve.
     * The first `Session` from the server then replaces the restored state the same way it does on a reconnect:
     * removed spaces and rooms are dropped, the rest is updated in place, the restored message histories and topics
     * other than the default ones are fetched anew (as a window holding the latest messages is on a reconnect), and
     * the lazily loaded lists are refetched on their next access.
     *
     * Allowed only once and only before the first `Session`.
     * @return False if the snapshot was rejected (another version, malformed data, or a session already received) -
     * the state is not changed then.
     */
    public importSnapshot(snapshot: unknown): boolean {
        if (this.sessionReceived || this.snapshotImported || ! isValidStateSnapshot(snapshot)) {
            return false;
        }

        this.snapshotImported = true;

        try {
            this._me = snapshot.user;
            this.users._importUser(snapshot.user);
            this.rooms._importRooms(snapshot.rooms);
            this.spaces._importSpaces(snapshot.spaces, snapshot.spaceRooms);
            this.rooms.followedTopics._importFollowedTopics(snapshot.followedTopics);
            this.emoticons._importEmoticons(snapshot.emoticons, snapshot.spaces.map(space => space.id));
            this.relationships._importRelationships(snapshot.relationships);
            this.rooms._importHistories(snapshot.histories, snapshot.roomMembers);
        } catch {
            // Not expected after the validation; whatever got restored is replaced by the first session anyway.
            return false;
        }

        this.deferredSession.resolve();
        return true;
    }

    private handleSession(ev: Session): void {
        this._me = ev.user;
        this.sessionReceived = true;
        this.deferredSession.resolve();
    }

    /**
     * A reconnect keeps the followed topics and emoticons of rooms and spaces that are gone; for the restored ones
     * the first session is the only chance to tell they are gone.
     */
    private handleSessionAfterImport(ev: Session): void {
        if (! this.snapshotImported) {
            return;
        }

        this.snapshotImported = false;
        this.rooms.followedTopics._forgetRoomsExcept(ev.state.rooms.map(room => room.id));
        this.emoticons._forgetSpacesExcept(ev.state.spaces.map(space => space.id));
        this.rooms._refreshImportedTopics();
    }
}