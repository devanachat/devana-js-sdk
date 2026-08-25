import { ReactionType } from "../Reaction";
export interface React {
    messageId: string;
    type: ReactionType;
    value: string;
}
