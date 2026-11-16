import {ChatLocation} from "../ChatLocation";
import {MessagePoll} from "../MessagePoll";
import {SendableEmbed} from "../MessageEmbed";
import {MessageMentions} from "../Message";

export interface CreateMessage {
    location: ChatLocation;
    content: string;
    attachments?: string[];
    customNick?: string;
    customColor?: string;
    /** Turns the message into a poll; its content becomes the question. */
    poll?: MessagePoll;
    sticky?: boolean;
    replyTo?: string;
    embed?: SendableEmbed;
    /** The interaction the message answers */
    interactionId?: string;
    /** Bots only: the id of the room member the message is shown to; it is not stored and resolves with `Ok` */
    ephemeralFor?: string;
    allowedMentions?: MessageMentions;
}
