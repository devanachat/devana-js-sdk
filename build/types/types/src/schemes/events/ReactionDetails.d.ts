import { ReactionType } from "../Reaction";
/**
 * Who reacted, oldest vote first. Only the ids travel - the nicks are already
 * known from the room members collection.
 */
export interface ReactionDetails {
    messageId: string;
    type: ReactionType;
    value: string;
    userIds: string[];
}
