import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function AdminRecordDetailSkeleton() {
  return <WorkspaceLoadingState route="/admin/records/[recordId]" />;
}
