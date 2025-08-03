import {ChatLocation} from "../ChatLocation";

export interface CreateTopicInitialMessage {
    content?: string;
    attachments?: string[];
}

export interface CreateTopic {
    location: ChatLocation;
    name: string;
    refMessageId?: string;
    initialMessage?: CreateTopicInitialMessage;
}
