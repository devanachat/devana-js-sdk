import {Message} from "./Message";

export interface Topic {
    id: string;
    name: string;
    messageCount: number;
    refMessage?: Message;
    lastMessage?: Message;
}