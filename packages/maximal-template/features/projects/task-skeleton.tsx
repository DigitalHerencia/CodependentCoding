// Why: Skeleton: matches the task detail layout.
import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function TaskSkeleton() {
  return <WorkspaceLoadingState route="/projects/[projectId]/tasks/[taskId]" />;
}
