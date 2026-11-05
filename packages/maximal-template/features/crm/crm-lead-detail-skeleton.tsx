import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function CrmLeadDetailSkeleton() {
  return <WorkspaceLoadingState route="/crm/leads/[leadId]" />;
}
