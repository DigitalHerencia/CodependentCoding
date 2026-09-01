import { getSupportTicket } from "../../fetchers/supportFetchers";
import { calculateSla } from "../../support/logic/calculate-sla.logic";
export async function calculateSlaWorkflow(ticketId: string) {
  const ticket = await getSupportTicket(ticketId);
  if (!ticket) throw new Error("Support ticket was not found.");
  return calculateSla(new Date(ticket.createdAt), ticket.priority);
}
