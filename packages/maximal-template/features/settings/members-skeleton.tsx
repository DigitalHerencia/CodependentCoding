import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function MembersSkeleton() {
  return <WorkspaceLoadingState route="/settings/members" />;
}
