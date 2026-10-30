import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function ComposerSkeleton() {
  return <WorkspaceLoadingState route="/social/compose" />;
}
