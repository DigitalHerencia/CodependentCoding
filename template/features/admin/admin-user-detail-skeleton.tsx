import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function AdminUserDetailSkeleton() {
  return <WorkspaceLoadingState route="/admin/users/[userId]" />;
}
