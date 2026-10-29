import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function CrmAccountDetailSkeleton() {
  return <WorkspaceLoadingState route="/crm/accounts/[accountId]" />;
}
