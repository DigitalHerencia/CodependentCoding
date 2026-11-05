import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function AdminRecordDetailSkeleton() {
  return <WorkspaceLoadingState route="/admin/records/[recordId]" />;
}
