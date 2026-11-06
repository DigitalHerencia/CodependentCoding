import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function AdminRecordDetailSkeleton() {
  return <WorkspaceLoadingTemplate route="/admin/records/[recordId]" />;
}
