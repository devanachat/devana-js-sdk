import { RoomSummary } from "../RoomSummary";
export interface RoomSummaryUpdated {
    /**
     * Partial summary - the client merges it into the cached one.
     * Private rooms do not emit this event at all.
     */
    summary: RoomSummary;
}
