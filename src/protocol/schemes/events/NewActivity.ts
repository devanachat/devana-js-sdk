import {Activity} from "../Activity";
import {Message} from "../Message";
import {User} from "../User";

export interface NewActivity {
    activity: Activity;
    message: Message | null;
    users: User[];
}
