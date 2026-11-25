import {Activity} from "../Activity";
import {Message} from "../Message";
import {User} from "../User";

export interface Activities {
    seenAt: string | null;
    activities: Activity[];
    messages: Message[];
    users: User[];
}
