import {SendableEmbed} from "../MessageEmbed";

export interface UpdateMessage {
    messageId: string;
    content?: string;
    embed?: SendableEmbed | null;
}
