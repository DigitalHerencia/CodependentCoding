import { updateSupportTicketStatusWorkflow } from "../../support/workflows/supportWorkflows";
export async function reopenTicketWorkflow(input: {
  ticketId: string;
  expectedVersion: number;
}) {
  return updateSupportTicketStatusWorkflow({ ...input, status: "OPEN" });
}
