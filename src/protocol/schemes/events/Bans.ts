import {ChatLocation} from "../ChatLocation";
import {BanObject} from "../BanObject";

export interface Bans {
    location: ChatLocation;
    bans: BanObject[];
}