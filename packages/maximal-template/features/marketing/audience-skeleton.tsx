import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function AudienceSkeleton() {
  return <WorkspaceLoadingState route="/marketing/audiences/[audienceId]" />;
}
