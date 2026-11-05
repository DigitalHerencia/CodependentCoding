import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function BillingSkeleton() {
  return <WorkspaceLoadingState route="/portal/billing" />;
}
