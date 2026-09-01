import { getSupportTicket } from "../../fetchers/supportFetchers";
import { determineEscalation } from "../../support/logic/determine-escalation.logic";
export async function determineEscalationWorkflow(ticketId: string, now = new Date()) {
  const ticket = await getSupportTicket(ticketId);
  if (!ticket) throw new Error("Support ticket was not found.");
  return determineEscalation({
    priority: ticket.priority,
    firstResponseDueAt: ticket.firstResponseDueAt
      ? new Date(ticket.firstResponseDueAt)
      : null,
    resolutionDueAt: ticket.resolutionDueAt
      ? new Date(ticket.resolutionDueAt)
      : null,
    now,
  });
}
