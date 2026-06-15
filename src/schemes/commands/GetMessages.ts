import {ChatLocation} from "../ChatLocation";

export interface GetMessages {
    location: ChatLocation;
    before?: string;
    after?: string;
    around?: string;
    limit?: number;
}