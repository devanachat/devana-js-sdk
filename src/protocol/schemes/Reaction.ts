export type ReactionType = 'Emoji' | 'Emoticon';

/**
 * An `Emoji` reaction holds the emoji itself in `value`. An `Emoticon` reaction holds the emoticon id in `value` and its
 * name, copied when the first such reaction was added, in `name` - the emoticon may since have been deleted or be out
 * of the user's reach, and the id may point to no emoticon at all.
 */
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
