// Why: Skeleton: matches the project overview layout.
import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function ProjectSkeleton() {
  return <WorkspaceLoadingTemplate route="/projects/[projectId]" />;
}
