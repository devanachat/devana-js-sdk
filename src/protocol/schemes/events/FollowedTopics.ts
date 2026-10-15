import {FollowedTopic} from "../FollowedTopic";
import {ChatLocation} from "../ChatLocation";

export interface FollowedTopics {
    location: ChatLocation;
    followedTopics: FollowedTopic[];
}