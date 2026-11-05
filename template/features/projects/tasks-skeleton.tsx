// Why: Skeleton: matches the task board layout.
import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function TasksSkeleton() {
  return <WorkspaceLoadingState route="/projects/[projectId]/tasks" />;
}
