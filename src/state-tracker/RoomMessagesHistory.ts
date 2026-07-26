import {ChatStateTracker} from "./ChatStateTracker";
import {NewTopic, Room, RoomUpdated, Topic, TopicDeleted} from "../types/src";
import {IndexedCollection,} from "../IndexedObjectCollection";
import {TopicHistoryWindow, WindowState} from "./TopicHistoryWindow";

export class RoomMessagesHistory {
    private historyWindows = new IndexedCollection<string, TopicHistoryWindow>();
    private traverseLock: boolean = false;

    public constructor(
        private room: Room,
        private tracker: ChatStateTracker,
    ) {
        this.tracker.client.on('RoomUpdated', ev => this.handleRoomUpdated(ev));
        this.tracker.client.on('NewTopic', ev => this.handleNewTopic(ev));
        this.tracker.client.on('TopicDeleted', ev => this.handleTopicDeleted(ev));

        this.updateTraverseLock(this.room);

        if (this.room.defaultTopic) {
            this.createHistoryWindowForTopic(this.room.defaultTopic);
        }
    }

    /**
     * Returns a history window object for the given topic ID, allowing you to view message history.
     * @param topicId
     * @param peek If true, do not create a cache for this topic and do not allow it to collect new messages.
     */
    public async getMessagesWindow(topicId: string, peek: boolean = false): Promise<TopicHistoryWindow | undefined> {
        if (!this.historyWindows.has(topicId) && !peek) {
            const topic = (await this.tracker.rooms.getTopics(this.room.id, [topicId])).get(topicId);

            if (topic) {
                this.createHistoryWindowForTopic(topic);
            }
        }

        return this.historyWindows.get(topicId);
    }

    /**
     * Re-synchronise this room's history after a reconnect without discarding
     * the existing window objects (which would blank the UI and, for ephemeral
     * rooms, permanently drop live-only history).
     *
     * The window bindings are preserved; only windows that the application had
     * actually pulled to the latest page (state === LATEST) are refreshed, with
     * a single resetToLatest instead of a chain of catch-up requests. Windows
     * that were never pulled (LIVE) or belong to an ephemeral room are left
     * untouched so their in-memory context survives the reconnect.
     */
    public async resync(room: Room): Promise<void> {
        this.room = room;
        this.updateTraverseLock(room);

        if (this.room.defaultTopic) {
            this.createHistoryWindowForTopic(this.room.defaultTopic);
        }

        for (const [, window] of Array.from(this.historyWindows.items)) {
            try {
                await window.setTraverseLock(this.traverseLock);

                // Ephemeral history lives only in memory (the server does not
                // persist it), so never refetch/replace it on reconnect.
                if (this.traverseLock) {
                    continue;
                }

                if (window.state === WindowState.LATEST) {
                    await window.resetToLatest(true);
                }
            } catch (_e) {
                // Best effort: the connection can drop again mid-resync. The
                // window keeps its current content and stays usable, so the
                // application can refresh it on demand.
            }
        }
    }

    private async handleRoomUpdated(ev: RoomUpdated): Promise<void> {
        if (this.room.id === ev.room.id) {
            this.room = ev.room;

            this.updateTraverseLock(ev.room);

            if (ev.room.defaultTopic) {
                this.createHistoryWindowForTopic(ev.room.defaultTopic);
            }

            for (const [, window] of Array.from(this.historyWindows.items)) {
                await window.setTraverseLock(this.traverseLock);
            }
        }
    }

    private handleNewTopic(ev: NewTopic): void {
        if (this.room.id === ev.roomId) {
            this.createHistoryWindowForTopic(ev.topic);
        }
    }

    private handleTopicDeleted(ev: TopicDeleted): void {
        if (this.room.id === ev.location.roomId) {
            this.historyWindows.delete(ev.location.topicId);
        }
    }

    private createHistoryWindowForTopic(topic: Topic): void {
        if (this.historyWindows.has(topic.id)) {
            return;
        }

        const historyWindow = new TopicHistoryWindow(this.room.id, topic.id, this.tracker);

        void historyWindow.setTraverseLock(this.traverseLock);

        this.historyWindows.set([topic.id, historyWindow]);

        // Current behavior of deletion a message with referenced topic is to delete the whole side topic
        // So we need to listen for topic deletions here
        historyWindow.on('reftopicsdeleted', (deletedTopicIds: string[]) => {
            for (const topicId of deletedTopicIds) {
                this.historyWindows.delete(topicId);
            }
            this.tracker.rooms._deleteTopicsFromRoom(this.room.id, ...deletedTopicIds);
        });

        // If new topic refers to some message from this room, update other structures
        if (topic.refMessage) {
            const refHistoryWindow = this.historyWindows.get(topic.refMessage.location.topicId);
            refHistoryWindow?._updateMessageReference(topic);
        }
    }

    private updateTraverseLock(room: Room): void {
        this.traverseLock = room.history.mode === 'Ephemeral';
    }
}