import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function TicketSkeleton() {
  return <WorkspaceLoadingState route="/support/tickets/[ticketId]" />;
}
