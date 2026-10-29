import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function PortalSkeleton() {
  return <WorkspaceLoadingState route="/portal" />;
}
