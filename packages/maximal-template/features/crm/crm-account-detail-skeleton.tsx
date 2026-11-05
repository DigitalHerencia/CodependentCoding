import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function CrmAccountDetailSkeleton() {
  return <WorkspaceLoadingState route="/crm/accounts/[accountId]" />;
}
