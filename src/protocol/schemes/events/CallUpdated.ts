import {Call} from "../Call";

export interface CallUpdated {
    roomId: string;
    call: Call | null;
}
