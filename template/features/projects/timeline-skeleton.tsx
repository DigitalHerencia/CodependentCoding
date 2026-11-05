// Why: Skeleton: matches the timeline layout.
import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function TimelineSkeleton() {
  return <WorkspaceLoadingState route="/projects/[projectId]/timeline" />;
}
