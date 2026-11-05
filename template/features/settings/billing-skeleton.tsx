import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function BillingSkeleton() {
  return <WorkspaceLoadingState route="/settings/billing" />;
}
