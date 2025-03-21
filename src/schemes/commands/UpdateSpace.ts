import {SpaceDiscoverable} from "../Space";

export interface UpdateSpace {
    id: string;
    name?: string;
    description?: string;
    systemRoom?: string | null;
    defaultRooms?: string[];
    icon?: string | null;
    banner?: string | null;
    discoverable?: SpaceDiscoverable;
    flags?: number;
}