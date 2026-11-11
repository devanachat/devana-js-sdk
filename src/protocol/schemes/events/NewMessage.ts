import {Message} from "../Message";

export interface NewMessage {
    message: Message;
    sticky?: boolean;
}
