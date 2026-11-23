import {Space} from "./Space";
import {Room} from "./Room";
import {Call} from "./Call";
import {IncomingCall} from "./IncomingCall";

export interface UserState {
    spaces: Space[];
    rooms: Room[];
    calls: Call[];
    incomingCalls: IncomingCall[];
}