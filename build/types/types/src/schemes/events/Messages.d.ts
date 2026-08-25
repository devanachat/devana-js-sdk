import { ChatLocation } from "../ChatLocation";
import { Message } from "../Message";
import { UserReaction } from "../Reaction";
export interface Messages {
    location: ChatLocation;
    messages: Message[];
    /** Message id => reactions of the asking user; present only when requested. */
    myReactions?: Record<string, UserReaction[]>;
}
