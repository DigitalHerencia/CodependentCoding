import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function AdminRecordsSkeleton() {
  return <WorkspaceLoadingState route="/admin/records" />;
}
