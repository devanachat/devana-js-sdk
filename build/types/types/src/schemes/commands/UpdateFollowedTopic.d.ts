import { ChatLocation } from "../ChatLocation";
import { NotificationLevel } from "../FollowedTopic";
export interface UpdateFollowedTopic {
    location: ChatLocation;
    notificationLevel?: NotificationLevel;
}
