export type ReactionType = 'Emoji' | 'Emoticon';
export interface MessageReaction {
    type: ReactionType;
    value: string;
    count: number;
}
export interface UserReaction {
    type: ReactionType;
    value: string;
}
export interface ToggledReaction extends UserReaction {
    isAdded: boolean;
}
