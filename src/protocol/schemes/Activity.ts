import {ChatLocation} from "./ChatLocation";

export type ActivityType = 'Mention' | 'Reply' | 'Reaction' | 'Thread' | 'MissedCall' | 'Custom';

export interface Activity {
    id: string;
    type: ActivityType;
    groupKey: string | null;
    location: ChatLocation | null;
    messageId: string | null;
    actorIds: string[];
    count: number;
    createdAt: string;
    title: string | null;
    description: string | null;
    link: string | null;
    isRead: boolean;
}
