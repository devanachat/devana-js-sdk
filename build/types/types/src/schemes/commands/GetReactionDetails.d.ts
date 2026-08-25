import { ReactionType } from "../Reaction";
export interface GetReactionDetails {
    messageId: string;
    type: ReactionType;
    value: string;
    limit?: number;
    offset?: number;
}
