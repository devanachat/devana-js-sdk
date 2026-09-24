import { TicketAudience } from "../commands/CreateAccessTicket";
/**
 * A signed ticket to send as a bearer token to the service named by {@link audience}. It is
 * valid for a couple of minutes only, so ask for it right before the request.
 */
export interface AccessTicket {
    id: string;
    token: string;
    audience: TicketAudience;
    /** Resource the ticket covers: `space:<id>` or `user:<id>`. */
    scope: string;
    permissions: string[];
    expiresAt: string;
}
