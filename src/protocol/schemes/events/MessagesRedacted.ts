import {ChatLocation} from "../ChatLocation";

export interface MessagesRedacted {
    location: ChatLocation;
    ids: string[];
}