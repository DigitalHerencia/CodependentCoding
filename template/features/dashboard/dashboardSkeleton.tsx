import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function DashboardSkeleton() {
  return <WorkspaceLoadingState route="/dashboard" />;
}
