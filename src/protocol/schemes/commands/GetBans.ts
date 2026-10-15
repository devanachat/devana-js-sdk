import {ChatLocation} from "../ChatLocation";
import {BanType} from "../BanObject";

export interface GetBans {
    location: ChatLocation;
    type?: BanType;
}