export type UserTags = 'bot' | 'temp';

export interface User {
    id: string;
    nick: string;
    avatar: string;
    tags: UserTags[];
    online: boolean;
}