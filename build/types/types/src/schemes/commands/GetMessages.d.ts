import { ChatLocation } from "../ChatLocation";
export interface GetMessages {
    location: ChatLocation;
    before?: string;
    after?: string;
    around?: string;
    limit?: number;
    /**
     * Pull the reactions of the asking user along with the messages, instead of
     * asking for their own state separately.
     */
    includeMyReactions?: boolean;
}
