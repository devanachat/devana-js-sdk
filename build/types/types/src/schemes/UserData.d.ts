export type PrivateMessagePolicy = 'None' | 'Mutual' | 'All';
export interface UserData {
    privateMessagePolicy: PrivateMessagePolicy;
}
