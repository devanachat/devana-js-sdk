import {Message} from "../Message";

/** In UTF-16 code units, `end` exclusive. */
export interface TextRange {
    start: number;
    end: number;
}

export interface FoundMessage {
    message: Message;
    spaceId: string | null;
    ranges: TextRange[];
}

export interface FoundMessages {
    results: FoundMessage[];
    /** `null` - no more results. */
    cursor: string | null;
}
