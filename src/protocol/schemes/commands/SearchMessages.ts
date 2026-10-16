/** A calendar date, `YYYY-MM-DD`, interpreted in the `timezone` of the command. */
export type SearchDate = string;

export interface SearchMessages {
    /**
     * Plain text: words and `"phrases"` (up to 500 characters). The last word is matched as a prefix, unless the query
     * ends with a space or a phrase. The server recognises no modifiers - `from:ania` or `has:file` are ordinary words;
     * filters go in the fields below. Parsing a search syntax is up to the client.
     */
    query?: string;
    /**
     * Search the rooms of this space: those you are in and, when the plan of the space allows it, those you may
     * preview - each with the `SearchMessages` permission. Without it the result for the space is empty, not an error.
     */
    spaceId?: string | null;
    /** Search private conversations. Defaults to true. */
    privateMessages?: boolean;
    /** Author ids. Values of one field are alternatives (or), different fields are combined (and); up to 20 per field. */
    from?: string[];
    /** Room ids; can only narrow the searched range - a room outside of it is `RoomNotFoundException`. */
    in?: string[];
    before?: SearchDate[];
    after?: SearchDate[];
    during?: SearchDate[];
    /** Only messages with an attachment. */
    hasFile?: boolean;
    /** IANA timezone used for the dates. Defaults to `UTC`. */
    timezone?: string;
    /** `cursor` of the previous `FoundMessages`. */
    cursor?: string | null;
}
