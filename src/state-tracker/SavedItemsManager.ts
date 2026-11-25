import {ObservableIndexedObjectCollection} from "../IndexedObjectCollection";
import {
    ItemSaved,
    ItemUnsaved,
    Message,
    MessagesRedacted,
    MessageUpdated,
    RoomDeleted,
    RoomJoined,
    RoomLeft,
    SavedItem,
    SavedItems,
    SavedItemType,
} from "../protocol";
import {PromiseRegistry} from "./AsyncUtils";
import {ChatStateTracker} from "./ChatStateTracker";

/**
 * The key of a saved item in the collection returned by {@link SavedItemsManager.get}.
 */
export const savedItemKey = (type: SavedItemType, id: string): string => `${type}:${id}`;

const keyOf = (item: SavedItem): string => savedItemKey(item.type, item.id);

export class SavedItemsManager {
    private readonly items = new ObservableIndexedObjectCollection<SavedItem>(keyOf);
    private readonly messages = new ObservableIndexedObjectCollection<Message>('id');
    private readonly promises = new PromiseRegistry();
    private readonly hiddenRoomIds = new Set<string>();
    private itemsWanted = false;
    private messagesWanted = false;
    private refreshScheduled = false;

    public constructor(private tracker: ChatStateTracker) {
        this.tracker.client.on('ItemSaved', ev => this.handleItemSaved(ev));
        this.tracker.client.on('ItemUnsaved', ev => this.handleItemUnsaved(ev));
        this.tracker.client.on('MessageUpdated', ev => this.handleMessageUpdated(ev));
        this.tracker.client.on('MessagesRedacted', ev => this.handleMessagesRedacted(ev));
        this.tracker.client.on('RoomDeleted', ev => this.handleRoomDeleted(ev));
        this.tracker.client.on('RoomLeft', ev => this.handleRoomLeft(ev));
        this.tracker.client.on('RoomJoined', ev => this.handleRoomJoined(ev));
        this.tracker.client.on('Session', () => this.handleSession());
    }

    /**
     * The rooms and messages you saved, keyed by {@link savedItemKey}; always the same collection. The first call fetches
     * the list, later ones resolve with it. Items of rooms you are not a member of are left out until you rejoin. The
     * collection keeps no meaningful order - sort by `savedAt`. Once fetched, the list is fetched again after every
     * reconnect. Saving and unsaving is done with the `SaveItem` and `UnsaveItem` commands.
     * @param fetchWithMessages Fetch the contents of the saved messages along, so {@link getMessages} needs no request.
     */
    public async get(fetchWithMessages: boolean = false): Promise<ObservableIndexedObjectCollection<SavedItem>> {
        if (fetchWithMessages) {
            await this.getMessages();
        }

        if (this.promises.notExist('items')) {
            this.itemsWanted = true;
            this.registerFetch(false);
        }

        await this.promises.get('items');
        return this.items;
    }

    /**
     * The contents of the saved messages, keyed by message id; always the same collection. The first call fetches them
     * together with the list of {@link get}, unless they were fetched already; afterwards they follow the edits and are
     * fetched again after every reconnect.
     */
    public async getMessages(): Promise<ObservableIndexedObjectCollection<Message>> {
        if (this.promises.notExist('messages')) {
            this.itemsWanted = true;
            this.messagesWanted = true;
            this.registerFetch(true);
        }

        await this.promises.get('messages');
        return this.messages;
    }

    public async isSaved(type: SavedItemType, id: string): Promise<boolean> {
        return (await this.get()).has(savedItemKey(type, id));
    }

    private registerFetch(withMessages: boolean): void {
        const fetching = this.fetch(withMessages);

        this.promises.register(fetching, 'items');
        if (withMessages) {
            this.promises.register(fetching, 'messages');
        }
    }

    private async fetch(withMessages: boolean): Promise<void> {
        const result = await this.tracker.client.send('GetSavedItems', {withMessages});
        if (result.error) {
            throw result.error;
        }

        this.apply(result.data, withMessages);
    }

    private apply(ev: SavedItems, withMessages: boolean): void {
        this.items.reconcile(...ev.items);

        if (withMessages) {
            this.messages.reconcile(...ev.messages);
        }
    }

    private refresh(): void {
        if (this.messagesWanted) {
            this.registerFetch(true);
        } else if (this.itemsWanted) {
            this.registerFetch(false);
        }

        this.promises.get('items')?.catch(() => {});
    }

    private handleItemSaved(ev: ItemSaved): void {
        if (!this.itemsWanted) {
            return;
        }

        this.items.set(ev.item);

        if (this.messagesWanted && ev.message) {
            this.messages.set(ev.message);
        }
    }

    private handleItemUnsaved(ev: ItemUnsaved): void {
        this.items.delete(savedItemKey(ev.type, ev.id));

        if (ev.type === 'Message') {
            this.messages.delete(ev.id);
        }
    }

    private handleMessageUpdated(ev: MessageUpdated): void {
        if (this.messages.has(ev.message.id)) {
            this.messages.set(ev.message);
        }
    }

    private handleMessagesRedacted(ev: MessagesRedacted): void {
        const saved = ev.ids.filter(id => this.items.has(savedItemKey('Message', id)));

        this.items.delete(...saved.map(id => savedItemKey('Message', id)));
        this.messages.delete(...saved.filter(id => this.messages.has(id)));
    }

    private handleRoomDeleted(ev: RoomDeleted): void {
        this.hiddenRoomIds.delete(ev.id);
        this.deleteRoomItems(ev.id);
    }

    private handleRoomLeft(ev: RoomLeft): void {
        // The server keeps them and hands them back once you rejoin
        if (this.deleteRoomItems(ev.id)) {
            this.hiddenRoomIds.add(ev.id);
        }
    }

    private handleRoomJoined(ev: RoomJoined): void {
        if (!this.hiddenRoomIds.delete(ev.room.id) || this.refreshScheduled) {
            return;
        }

        // Joining a space joins its rooms one by one; one request brings back the items of all of them
        this.refreshScheduled = true;
        setTimeout(() => {
            this.refreshScheduled = false;
            this.refresh();
        }, 0);
    }

    private deleteRoomItems(roomId: string): boolean {
        const items = this.items.items.filter(item => item.roomId === roomId);

        this.items.delete(...items.map(keyOf));
        this.messages.delete(...items.filter(item => this.messages.has(item.id)).map(item => item.id));

        return items.length > 0;
    }

    private handleSession(): void {
        this.promises.forgetAll();
        this.refresh();
    }
}
