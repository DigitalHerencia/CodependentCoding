import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function ExpensesSkeleton() {
  return <WorkspaceLoadingState route="/expenses" />;
}
