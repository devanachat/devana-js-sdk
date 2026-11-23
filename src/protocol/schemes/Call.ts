import {User} from "./User";
import {ChatLocation} from "./ChatLocation";

export type CallMode = 'Conversation' | 'Stage' | 'Queue';

export enum CallMemberFlag {
    Camera = 1 << 0,
    ScreenShare = 1 << 1,
    Speaker = 1 << 2,
    RaiseBlocked = 1 << 4,
}

export interface CallMember {
    user: User;
    joinedAt: string;
    flags: number;
    handRaisedAt: string | null;
}

export interface CallTurn {
    userId: string;
    endsAt: string;
    claimBy: string | null;
}

export interface CallQuality {
    audioBitrate: number;
    cameraMaxHeight: number;
    screenMaxHeight: number;
    screenMaxFps: number;
}

export interface Call {
    location: ChatLocation;
    messageId: string;
    startedAt: string;
    mode: CallMode;
    turn: CallTurn | null;
    autoEndAt: string | null;
    members: CallMember[];
}
