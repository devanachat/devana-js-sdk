import {RoleIcon} from "../Role";

export interface UpdateRole {
    spaceId: string;
    id: string;
    priority?: number;
    name?: string;
    color?: string;
    flags?: number;
    icon?: RoleIcon | null;
}