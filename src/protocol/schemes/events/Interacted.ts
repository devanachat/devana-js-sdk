import {ChatLocation} from "../ChatLocation";
import {User} from "../User";

export interface Interacted {
    location: ChatLocation;
    messageId: string;
    user: User;
    actionId: string;
    value: string | null;
}
