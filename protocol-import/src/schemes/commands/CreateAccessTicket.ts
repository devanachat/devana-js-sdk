/**
 * Issues a short-lived signed ticket with which the client authenticates in a service outside the
 * chat server. With `spaceId` the ticket covers that space and requires the `ManageSpace`
 * permission; without it the ticket covers the requesting user.
 */
export interface CreateAccessTicket {
    audience: TicketAudience;
    spaceId?: string;
}

/**
 * Service a ticket is issued for. A ticket is rejected by every other service.
 */
export type TicketAudience = 'billing' | string;
