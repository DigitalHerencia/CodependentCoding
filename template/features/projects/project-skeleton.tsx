// Why: Skeleton: matches the project overview layout.
import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function ProjectSkeleton() {
  return <WorkspaceLoadingState route="/projects/[projectId]" />;
}
