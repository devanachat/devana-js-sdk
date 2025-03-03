import {ChatStateTracker} from "./ChatStateTracker";
import {IndexedObjectCollection} from "../IndexedObjectCollection";
import {Room, RoomSummary, User} from "../types/src";
import {extractUserFromMember} from "./functions";

export class Utils {
    public constructor(private tracker: ChatStateTracker) {}

    /**
     * Collect all room summaries and rooms you joined in one collection.
     */
    public async collectAllAvailableRooms(): Promise<IndexedObjectCollection<Room | RoomSummary>> {
        const result = new IndexedObjectCollection<Room | RoomSummary>('id');
        const spaces = await this.tracker.spaces.get();
        const collections = await Promise.all([
            ...spaces.items.map(space => this.tracker.spaces.getRooms(space.id)),
            this.tracker.rooms.get(),
        ]);

        collections.forEach(collection => result.set(...collection.items));

        return result;
    }

    /**
     * Collect all users from all spaces and rooms you are in.
     */
    public async collectAllAvailableUsers(): Promise<IndexedObjectCollection<User>> {
        const result = new IndexedObjectCollection<User>('id');
        const [spaces, rooms] = await Promise.all([this.tracker.spaces.get(), this.tracker.rooms.get()]);
        const collections = await Promise.all([
            ...spaces.items.map(space => this.tracker.spaces.getMembers(space.id)),
            ...rooms.items.map(room => this.tracker.rooms.getMembers(room.id)),
        ]);

        collections.forEach(collection => result.set(...collection.items.map(extractUserFromMember)));

        return result;
    }
}