import {CallQuality} from "../Call";

export interface CallJoined {
    roomId: string;
    url: string;
    token: string;
    quality: CallQuality;
}
