import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function TicketSkeleton() {
  return <WorkspaceLoadingState route="/support/tickets/[ticketId]" />;
}
