import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function TicketSkeleton() {
  return <WorkspaceLoadingTemplate route="/support/tickets/[ticketId]" />;
}
