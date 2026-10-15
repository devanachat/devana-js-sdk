import {Space} from "./Space";
import {Room} from "./Room";

export interface UserState {
    spaces: Space[];
    rooms: Room[];
}