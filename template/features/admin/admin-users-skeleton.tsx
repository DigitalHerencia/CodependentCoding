import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function AdminUsersSkeleton() {
  return <WorkspaceLoadingState route="/admin/users" />;
}
