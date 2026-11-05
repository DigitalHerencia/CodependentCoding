import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function CrmAccountsSkeleton() {
  return <WorkspaceLoadingState route="/crm/accounts" />;
}
