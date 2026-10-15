import {BanObject} from "./BanObject";
import {Error as ErrorObject} from "./events/Error"

export interface LeaveReason {
    type: 'Leave' | 'Ban' | 'Kick' | 'Service' | 'Error';
    ban?: BanObject;
    kick?: string;
    service?: string;
    error?: ErrorObject;
}