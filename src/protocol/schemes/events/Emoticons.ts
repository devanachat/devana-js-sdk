import {Emoticon} from "../Emoticon";
import {ChatLocation} from "../ChatLocation";

export interface Emoticons {
    emoticons: Emoticon[];
    /**
     * Null for a selection by `ids` - it is not the full list of any location.
     */
    location: ChatLocation | null;
}