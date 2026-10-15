import {ChatLocation} from "../ChatLocation";

export interface Kick {
    userId: string;
    location: ChatLocation;
    reason: string;
    notify: boolean;
}