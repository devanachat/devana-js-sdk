import { ReactionType } from "./Reaction";
export interface MessagePollOption {
    type: ReactionType;
    value: string;
    label: string;
}
export interface MessagePoll {
    multipleChoice: boolean;
    options: MessagePollOption[];
}
