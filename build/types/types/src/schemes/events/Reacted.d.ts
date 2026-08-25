import { ToggledReaction } from "../Reaction";
/**
 * Sent to every client of the voting user, so all of their devices know what they
 * voted for without refetching the message history.
 */
export interface Reacted {
    messageId: string;
    reaction: ToggledReaction;
}
