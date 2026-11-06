// Why: Skeleton: matches the task detail layout.
import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function TaskSkeleton() {
  return (
    <WorkspaceLoadingTemplate route="/projects/[projectId]/tasks/[taskId]" />
  );
}
