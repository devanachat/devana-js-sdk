/**
 * Answers an interaction without a message or an edit. Bots only; the author of the interacted message.
 * `Timeout` is sent by the server alone.
 */
export interface AckInteraction {
    interactionId: string;
    status?: 'Ok' | 'Fail';
    /** A short plain text (up to 150 characters) shown to the user who interacted */
    notice?: string;
}
