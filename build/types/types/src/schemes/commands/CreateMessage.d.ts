import { ChatLocation } from "../ChatLocation";
import { MessagePoll } from "../MessagePoll";
export interface CreateMessage {
    location: ChatLocation;
    content: string;
    attachments?: string[];
    customNick?: string;
    customColor?: string;
    /** Turns the message into a poll; its content becomes the question. */
    poll?: MessagePoll;
}
