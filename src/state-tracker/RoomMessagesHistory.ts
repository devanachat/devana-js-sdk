import {ChatStateTracker} from "./ChatStateTracker";
import {NewTopic, Room, RoomUpdated, Topic, TopicDeleted} from "../types/src";
import {IndexedCollection,} from "../IndexedObjectCollection";
import {TopicHistoryWindow} from "./TopicHistoryWindow";

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
     */
    public async getMessagesWindow(topicId: string): Promise<TopicHistoryWindow | undefined> {
        if (!this.historyWindows.has(topicId)) {
            const topic = (await this.tracker.rooms.getTopics(this.room.id, [topicId])).get(topicId);

            if (topic) {
                this.createHistoryWindowForTopic(topic);
            }
        }

        return this.historyWindows.get(topicId);
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