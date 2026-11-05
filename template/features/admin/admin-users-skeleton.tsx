import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function AdminUsersSkeleton() {
  return <WorkspaceLoadingState route="/admin/users" />;
}
