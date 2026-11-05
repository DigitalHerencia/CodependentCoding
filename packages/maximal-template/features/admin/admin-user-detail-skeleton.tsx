import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function AdminUserDetailSkeleton() {
  return <WorkspaceLoadingState route="/admin/users/[userId]" />;
}
