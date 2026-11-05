// Why: Skeleton: matches the task detail layout.
import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function TaskSkeleton() {
  return <WorkspaceLoadingState route="/projects/[projectId]/tasks/[taskId]" />;
}
