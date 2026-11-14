import {Message} from "../Message";

export interface NewMessage {
    message: Message;
    sticky?: boolean;
    repliedMessage?: Message | null;
    /** The interaction the message answers */
    interactionId?: string | null;
}
