import {ChatLocation} from "../ChatLocation";
import {Topic} from "../Topic";

export interface TopicUpdated
{
    location: ChatLocation;
    topic: Topic;
}