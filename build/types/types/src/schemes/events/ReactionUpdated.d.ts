import { MessageReaction } from "../Reaction";
/**
 * The single source of truth of a reaction counter, broadcast to the whole room.
 */
export interface ReactionUpdated {
    messageId: string;
    reaction: MessageReaction;
}
