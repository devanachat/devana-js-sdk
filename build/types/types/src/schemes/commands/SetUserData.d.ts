import { PrivateMessagePolicy } from "../UserData";
export interface SetUserData {
    privateMessagePolicy?: PrivateMessagePolicy;
    showAsyncPresence?: boolean;
}
