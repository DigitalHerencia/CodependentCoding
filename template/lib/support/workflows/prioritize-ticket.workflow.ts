import { getSupportInbox } from "../../fetchers/supportFetchers";
import { prioritizeTickets } from "../../support/logic/prioritize-tickets.logic";
export async function prioritizeTicketWorkflow(limit = 100, now = new Date()) {
  const tickets = await getSupportInbox(limit);
  return prioritizeTickets(
    tickets.map((ticket) => ({
      ...ticket,
      createdAt: new Date(ticket.createdAt),
      resolutionDueAt: ticket.resolutionDueAt
        ? new Date(ticket.resolutionDueAt)
        : null,
    })),
    now,
  );
}
