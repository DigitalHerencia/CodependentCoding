import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function MembersSkeleton() {
  return <WorkspaceLoadingState route="/settings/members" />;
}
