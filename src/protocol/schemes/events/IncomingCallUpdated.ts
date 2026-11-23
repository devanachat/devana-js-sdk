import {IncomingCall} from "../IncomingCall";

export interface IncomingCallUpdated {
    roomId: string;
    incomingCall: IncomingCall | null;
}
