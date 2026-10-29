import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function AdminAuditSkeleton() {
  return <WorkspaceLoadingState route="/admin/audit" />;
}
