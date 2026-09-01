import { updateSupportTicketStatusWorkflow } from "../../support/workflows/supportWorkflows";
export async function resolveTicketWorkflow(input: {
  ticketId: string;
  expectedVersion: number;
}) {
  return updateSupportTicketStatusWorkflow({ ...input, status: "RESOLVED" });
}
