import {SpaceIntent} from "../Space";

export interface CreateSpace {
    name: string;
    flags?: number;
    intent?: SpaceIntent;
}
