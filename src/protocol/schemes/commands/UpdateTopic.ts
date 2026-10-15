import {ChatLocation} from "../ChatLocation";

export interface UpdateTopic {
    location: ChatLocation;
    name?: string;
}