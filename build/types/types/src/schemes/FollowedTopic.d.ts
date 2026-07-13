import { ChatLocation } from "./ChatLocation";
export type NotificationLevel = 'All' | 'Mentions' | 'None';
export interface FollowedTopic {
    location: ChatLocation;
    lastAckMessageId: string | null;
    notificationLevel: NotificationLevel;
    missed: number | null;
    isUnread: boolean;
    mentionCount: number;
}
