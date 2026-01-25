import {Role} from "./Role";

export type SpaceDiscoverable = 'NotRequested' | 'Requested' | 'Accepted' | 'Declined';

export interface Space {
    id: string;
    name: string;
    description: string;
    roles: Role[];
    systemRoom: string | null;
    defaultRooms: string[];
    icon: string | null;
    banner: string | null;
    discoverable: SpaceDiscoverable;
    flags: number;
}