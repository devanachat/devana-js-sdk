import {ReactionType} from "../Reaction";

export interface React {
    messageId: string;
    type: ReactionType;
    /**
     * The emoji, or the emoticon id for an `Emoticon` reaction (never its name).
     */
    value: string;
}
