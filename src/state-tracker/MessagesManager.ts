import {ChatStateTracker} from "./ChatStateTracker";
import {
    RoomDeleted,
    RoomLeft,
    RoomJoined,
    Session,
    Room,
    Message, ChatLocation,
} from "../types/src";
import {IndexedCollection} from "../IndexedObjectCollection";
import {DeferredTask} from "./AsyncUtils";
import {RoomMessagesHistory} from "./RoomMessagesHistory";

export class MessagesManager {
    private readonly roomHistories = new IndexedCollection<string, RoomMessagesHistory>();
    private readonly deferredSession = new DeferredTask();

    public constructor(private tracker: ChatStateTracker) {
        this.tracker.client.on('Session', ev => this.handleSession(ev));
        this.tracker.client.on('RoomJoined', ev => this.handleRoomJoin(ev));
        this.tracker.client.on('RoomDeleted', ev => this.handleRoomDeleted(ev));
        this.tracker.client.on('RoomLeft', ev => this.handleRoomLeft(ev));
    }

    /**
     * Get history manager for given room ID.
     */
    public async getRoomHistory(roomId: string): Promise<RoomMessagesHistory | undefined> {
        await this.deferredSession.promise;
        return this.roomHistories.get(roomId);
    }

    /**
     * For internal use.
     * @internal
     */
    public async _resolveLastMessage(location: ChatLocation): Promise<Message|null> {
        // Try to get last message from history window (if cached)
        let message: Message = await this.getRoomHistory(location.roomId)
            .then(roomHistory => roomHistory?.getMessagesWindow(location.topicId, true))
            .then(
                historyWindow =>
                    historyWindow?.hasLatest && historyWindow.getAt(historyWindow.length - 1)
            );

        if (!message) {
            const result = await this.tracker.client.send('GetMessages', {
                location,
                limit: 1,
            });
            message = result.data?.messages[0];
        }

        return message || null;
    }

    private createHistoryForNewRoom(room: Room): void {
        this.roomHistories.set([room.id, new RoomMessagesHistory(room, this.tracker)]);
    }

    private handleRoomDeleted(ev: RoomDeleted): void {
        this.roomHistories.delete(ev.id);
    }

    private handleRoomJoin(ev: RoomJoined): void {
        this.createHistoryForNewRoom(ev.room);
    }

    private handleRoomLeft(ev: RoomLeft): void {
        this.roomHistories.delete(ev.id);
    }

    private handleSession(ev: Session): void {
        this.roomHistories.deleteAll();
        ev.state.rooms.forEach(room => this.createHistoryForNewRoom(room));
        this.deferredSession.resolve();
    }
}