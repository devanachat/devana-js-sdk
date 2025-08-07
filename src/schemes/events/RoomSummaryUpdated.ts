import {RoomSummary} from "../RoomSummary";

export interface RoomSummaryUpdated {
    /**
     * Partial summary: without the `extras` field.
     */
    summary: RoomSummary;
}