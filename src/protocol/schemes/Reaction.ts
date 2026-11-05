export type ReactionType = 'Emoji' | 'Emoticon';

export interface MessageReaction {
    type: ReactionType;
    value: string;
    name?: string | null;
    count: number;
}

export interface UserReaction {
    type: ReactionType;
    value: string;
}

export interface ToggledReaction extends UserReaction {
    name?: string | null;
    isAdded: boolean;
}
