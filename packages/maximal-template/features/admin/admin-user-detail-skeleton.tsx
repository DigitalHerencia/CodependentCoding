import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function AdminUserDetailSkeleton() {
  return <WorkspaceLoadingTemplate route="/admin/users/[userId]" />;
}
