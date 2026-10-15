import {ChatLocation} from "../ChatLocation";

export interface Ack {
    location: ChatLocation;
    messageId?: string;
}