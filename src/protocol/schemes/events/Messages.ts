import {ChatLocation} from "../ChatLocation";
import {Message} from "../Message";
import {UserReaction} from "../Reaction";

export interface MessageUserReactions {
    messageId: string;
    reactions: UserReaction[];
}

export interface Messages {
    location: ChatLocation;
    messages: Message[];
    myReactions?: MessageUserReactions[] | null;
    repliedMessages?: Message[] | null;
}