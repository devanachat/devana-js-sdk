import {ChatLocation} from "../ChatLocation";
import {User} from "../User";

export interface NewInteraction {
    interactionId: string;
    location: ChatLocation;
    messageId: string;
    user: User;
    actionId: string;
    value: string | null;
}
