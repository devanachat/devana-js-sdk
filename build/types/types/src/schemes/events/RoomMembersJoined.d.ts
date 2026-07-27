import { RoomMember } from "../RoomMember";
export interface RoomMembersJoined {
    roomId: string;
    members: RoomMember[];
    /**
     * Id of the user who added the members to the room, null when they joined on their own.
     */
    addedByUserId: string | null;
}
