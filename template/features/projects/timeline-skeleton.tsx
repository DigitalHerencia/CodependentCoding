// Why: Skeleton: matches the timeline layout.
import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function TimelineSkeleton() {
  return <WorkspaceLoadingState route="/projects/[projectId]/timeline" />;
}
