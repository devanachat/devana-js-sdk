import { ChatStateTracker } from "./ChatStateTracker";
import { ObservableIndexedObjectCollection } from "../IndexedObjectCollection";
import { Role, RoomSummary, Space, SpaceMember } from "../types/src";
export declare class SpacesManager {
    private tracker;
    private readonly list;
    private readonly roles;
    private readonly rooms;
    private readonly roomIdToSpaceId;
    private readonly members;
    private readonly deferredSession;
    private readonly roomsPromises;
    private readonly membersPromises;
    constructor(tracker: ChatStateTracker);
    /**
     * Get collection of all the spaces you are in.
     */
    get(): Promise<ObservableIndexedObjectCollection<Space>>;
    /**
     * Get collection of space roles.
     */
    getRoles(spaceId: string): Promise<ObservableIndexedObjectCollection<Role> | undefined>;
    /**
     * Get collection of the all available rooms inside given space.
     */
    getRooms(spaceId: string): Promise<ObservableIndexedObjectCollection<RoomSummary> | undefined>;
    /**
     * Get collection of space members.
     */
    getMembers(spaceId: string): Promise<ObservableIndexedObjectCollection<SpaceMember> | undefined>;
    /**
     * Get a space member representing the current user.
     */
    getMe(spaceId: string): Promise<SpaceMember | undefined>;
    private handleNewRole;
    private handleNewRoom;
    private handleRoomUpdated;
    private handleRoomDeleted;
    private handleRoleDeleted;
    private handleSpaceUpdated;
    private handleSpaceDeleted;
    private handleSpaceJoined;
    private addJoinedSpaces;
    private handleSpaceMemberJoined;
    private handleSpaceMemberLeft;
    private handleSpaceMembers;
    private handleSpaceRooms;
    private handleRoomSummaryUpdated;
    private handleSpaceMemberUpdated;
    private handleRoleUpdated;
    private handleSession;
    private handleUserUpdated;
}
