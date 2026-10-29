import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function CrmLeadDetailSkeleton() {
  return <WorkspaceLoadingState route="/crm/leads/[leadId]" />;
}
