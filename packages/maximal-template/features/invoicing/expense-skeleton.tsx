import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function ExpenseSkeleton() {
  return <WorkspaceLoadingState route="/expenses/[expenseId]" />;
}
