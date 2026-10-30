import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function AudienceSkeleton() {
  return <WorkspaceLoadingState route="/marketing/audiences/[audienceId]" />;
}
