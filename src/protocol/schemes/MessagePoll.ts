import {ReactionType} from "./Reaction";

export interface MessagePollOption {
    type: ReactionType;
    /**
     * The emoji, or the emoticon id for an `Emoticon` option.
     */
    value: string;
    label: string;
}

export interface MessagePoll {
    multipleChoice: boolean;
    options: MessagePollOption[];
}
