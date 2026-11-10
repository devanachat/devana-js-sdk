import {User} from "./User";

export enum PmParticipantFlag {
    IgnoresRoom = 1 << 0,
}

export interface PmParticipant {
    user: User;
    flags: number;
}
