import { SupportTicketTemplate } from "@/components/templates/support-templates";
import { loadTicketWorkflow } from "@/lib/workflows/supportWorkflows";
import { TicketFeatureClient } from "./editTicketConversationForm";

export async function TicketFeature({ ticketId }: { ticketId: string }) {
  const { ticket, messages } = await loadTicketWorkflow({ ticketId });
  return (
    <SupportTicketTemplate ticket={ticket} messages={messages}>
      <TicketFeatureClient key={ticket.version} ticket={ticket} />
    </SupportTicketTemplate>
  );
}
