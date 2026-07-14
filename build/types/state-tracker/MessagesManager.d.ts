import { ChatStateTracker } from "./ChatStateTracker";
import { Message, ChatLocation } from "../types/src";
import { RoomMessagesHistory } from "./RoomMessagesHistory";
export declare class MessagesManager {
    private tracker;
    private readonly roomHistories;
    private readonly deferredSession;
    constructor(tracker: ChatStateTracker);
    /**
     * Get history manager for given room ID.
     */
    getRoomHistory(roomId: string): Promise<RoomMessagesHistory | undefined>;
    /**
     * For internal use.
     * @internal
     */
    _resolveLastMessage(location: ChatLocation): Promise<Message | null>;
    private createHistoryForNewRoom;
    private handleRoomDeleted;
    private handleRoomJoin;
    private handleRoomLeft;
    private handleSession;
}
