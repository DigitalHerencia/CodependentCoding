// Why: Skeleton: matches the timeline layout.
import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function TimelineSkeleton() {
  return <WorkspaceLoadingTemplate route="/projects/[projectId]/timeline" />;
}
