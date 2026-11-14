export type InteractionStatus = 'Ok' | 'Fail' | 'Timeout';

/** Sent to the user who interacted when a bot acknowledges the interaction or does not answer in time. */
export interface InteractionResolved {
    interactionId: string;
    status: InteractionStatus;
    notice: string | null;
}
