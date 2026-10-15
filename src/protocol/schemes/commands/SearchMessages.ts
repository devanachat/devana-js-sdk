/** A calendar date, `YYYY-MM-DD`, interpreted in the `timezone` of the command. */
export type SearchDate = string;

export interface SearchMessages {
    /**
     * Words, `"phrases"` and modifiers (up to 500 characters). The last word is matched as a prefix.
     * Modifiers carry identifiers and dates only: `from:<userId>`, `in:<roomId>`,
     * `before:`/`after:`/`during:YYYY-MM-DD`, `has:file`.
     */
    query?: string;
    /** Search the rooms of this space. */
    spaceId?: string | null;
    /** Search private conversations. Defaults to true. */
    privateMessages?: boolean;
    /** Author ids. Repeated values are alternatives; different filters are combined. */
    from?: string[];
    /** Room ids; can only narrow the searched range. */
    in?: string[];
    before?: SearchDate[];
    after?: SearchDate[];
    during?: SearchDate[];
    hasFile?: boolean;
    /** IANA timezone used for the dates. Defaults to `UTC`. */
    timezone?: string;
    /** `cursor` of the previous `FoundMessages`. */
    cursor?: string | null;
}
