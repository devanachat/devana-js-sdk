export type PrivateMessagePolicy = 'None' | 'Mutual' | 'All';
export interface UserData {
    privateMessagePolicy: PrivateMessagePolicy;
    /**
     * Whether others may see that the user is reachable on a push-registered
     * device while disconnected. When false the user simply reads as offline.
     */
    showAsyncPresence: boolean;
}
