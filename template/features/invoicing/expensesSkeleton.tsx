import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function ExpensesSkeleton() {
  return <WorkspaceLoadingState route="/expenses" />;
}
