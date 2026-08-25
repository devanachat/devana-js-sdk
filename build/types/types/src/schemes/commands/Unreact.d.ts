import { ReactionType } from "../Reaction";
export interface Unreact {
    messageId: string;
    type: ReactionType;
    value: string;
}
