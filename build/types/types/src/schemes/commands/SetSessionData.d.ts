export interface SessionPush {
    token: string;
    platform: 'ios' | 'android' | 'web';
}
export interface SetSessionData {
    clientFocused?: boolean;
    push?: SessionPush;
}
