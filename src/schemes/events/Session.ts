import {UserState} from "../UserState";
import {User} from "../User";

export interface Session {
    serverVersion: string;
    protoVersion: string;
    state: UserState;
    user: User;
}
