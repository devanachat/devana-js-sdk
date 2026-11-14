import {Message} from "../Message";

export interface MessageUpdated {
    message: Message;
    /** The interaction the edit answers */
    interactionId?: string | null;
}
