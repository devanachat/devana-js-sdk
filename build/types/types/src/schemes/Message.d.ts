import { User } from "./User";
import { ChatLocation } from "./ChatLocation";
import { MessageReaction } from "./Reaction";
import { MessagePoll } from "./MessagePoll";
export type MessageType = 'Text' | 'RoomJoin' | 'RoomMemberAdd' | 'RoomLeave' | 'SpaceJoin' | 'SpaceLeave' | 'TopicChange' | 'CustomNickChange' | 'Ephemeral' | 'Poll';
/**
 * Mention targets a message actually reached, as resolved by the server: role
 * mentions the author was not allowed to fire are absent, even though they stay
 * in the content. Null when the message mentions nobody.
 */
export interface MessageMentions {
    userIds: string[];
    roleIds: string[];
}
export interface MessageAuthor {
    user: User;
    customNick?: string;
    color?: string;
}
export interface Message {
    id: string;
    location: ChatLocation;
    createdAt: string;
    type: MessageType;
    author: MessageAuthor;
    content?: string;
    topicRef: string | null;
    attachments: string[] | null;
    reactions: MessageReaction[];
    poll?: MessagePoll;
    mentions: MessageMentions | null;
}
