// Why: Skeleton: matches the project overview layout.
import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function ProjectSkeleton() {
  return <WorkspaceLoadingState route="/projects/[projectId]" />;
}
