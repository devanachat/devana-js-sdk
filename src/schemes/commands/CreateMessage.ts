import {ChatLocation} from "../ChatLocation";

export interface CreateMessage {
    location: ChatLocation;
    content: string;
    attachments?: string[];
    customNick?: string;
    customColor?: string;
}
