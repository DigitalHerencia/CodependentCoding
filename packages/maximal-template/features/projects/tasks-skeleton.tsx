// Why: Skeleton: matches the task board layout.
import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function TasksSkeleton() {
  return <WorkspaceLoadingTemplate route="/projects/[projectId]/tasks" />;
}
