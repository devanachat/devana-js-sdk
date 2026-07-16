export interface SessionPush {
    token?: string;
    platform?: 'ios' | 'android' | 'web';
    active?: boolean;
}
export interface SetSessionData {
    clientFocused?: boolean;
    push?: SessionPush;
}
