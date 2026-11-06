import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function ExpenseSkeleton() {
  return <WorkspaceLoadingTemplate route="/expenses/[expenseId]" />;
}
