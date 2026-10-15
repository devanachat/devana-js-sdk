import {Message} from "../Message";

/** A fragment of the message text, in UTF-16 code units; `end` is exclusive (fits `String.slice`). */
export interface TextRange {
    start: number;
    end: number;
}

export interface FoundMessage {
    message: Message;
    spaceId: string | null;
    /** Matches within the message text. */
    ranges: TextRange[];
}

export interface FoundMessages {
    /** Newest first. A page may hold fewer than 25 results even when more pages follow. */
    results: FoundMessage[];
    /** Pass to the next `SearchMessages`; `null` means the end of the results. */
    cursor: string | null;
}
