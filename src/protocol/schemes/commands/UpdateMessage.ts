import {SendableEmbed} from "../MessageEmbed";

export interface UpdateMessage {
    messageId: string;
    content?: string;
    embed?: SendableEmbed | null;
    /** The interaction the edit answers */
    interactionId?: string;
}
