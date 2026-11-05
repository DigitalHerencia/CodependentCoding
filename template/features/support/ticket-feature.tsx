import { notFound } from "next/navigation";
import {
  getSupportTicket,
  getSupportMessages,
} from "@/lib/fetchers/supportFetchers";
import { SupportTicketTemplate } from "@/components/templates/support-templates";
import { TicketFeatureClient } from "./ticket-conversation-form.client";
export async function TicketFeature({ ticketId }: { ticketId: string }) {
  const ticket = await getSupportTicket(ticketId);
  if (!ticket) notFound();
  const messages = await getSupportMessages(ticketId);
  return (
    <SupportTicketTemplate ticket={ticket} messages={messages}>
      <TicketFeatureClient key={ticket.version} ticket={ticket} />
    </SupportTicketTemplate>
  );
}
