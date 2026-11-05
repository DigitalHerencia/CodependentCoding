// Why: Skeleton: matches the task board layout.
import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function TasksSkeleton() {
  return <WorkspaceLoadingState route="/projects/[projectId]/tasks" />;
}
