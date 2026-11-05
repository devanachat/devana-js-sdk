export interface GetEmoticons {
    spaceId?: string;
    /**
     * At most 100. Emoticons the user may not see are left out, as if they did not exist.
     */
    ids?: string[];
}
