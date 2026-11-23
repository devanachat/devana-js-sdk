import {Call} from "./Call";
import {User} from "./User";

export interface IncomingCall {
    call: Call;
    caller: User;
}
