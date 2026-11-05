import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function CrmAccountsSkeleton() {
  return <WorkspaceLoadingState route="/crm/accounts" />;
}
