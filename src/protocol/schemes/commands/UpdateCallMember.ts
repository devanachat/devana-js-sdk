export interface UpdateCallMember {
    roomId: string;
    userId: string;
    speaker?: boolean;
    handRaised?: boolean;
    raiseBlocked?: boolean;
}
