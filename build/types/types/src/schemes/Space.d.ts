import { Role } from "./Role";
export type SpaceDiscoverable = 'NotRequested' | 'Requested' | 'Accepted' | 'Declined';
export declare enum SpaceIntent {
    Community = "community",
    Friends = "friends",
    Team = "team"
}
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
    intent: SpaceIntent | null;
}
