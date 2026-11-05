import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function ExpenseSkeleton() {
  return <WorkspaceLoadingState route="/expenses/[expenseId]" />;
}
