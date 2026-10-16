/** `YYYY-MM-DD` in the `timezone` of the command. */
export type SearchDate = string;

export interface SearchMessages {
    /** Plain text, without modifiers - filters are the fields below. */
    query?: string;
    spaceId?: string | null;
    /** Defaults to true. */
    privateMessages?: boolean;
    from?: string[];
    in?: string[];
    before?: SearchDate[];
    after?: SearchDate[];
    during?: SearchDate[];
    hasFile?: boolean;
    /** Defaults to `UTC`. */
    timezone?: string;
    cursor?: string | null;
}
