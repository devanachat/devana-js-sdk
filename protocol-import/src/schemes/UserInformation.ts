import {User} from "./User";
import {SpaceSummary} from "./SpaceSummary";
import {RoomSummary} from "./RoomSummary";

export interface UserInformation {
    user: User;
    firstSeenAt: string;
    lastSeenAt: string;
    spaces: SpaceSummary[];
    rooms: RoomSummary[];
    knownAliases?: User[];
}