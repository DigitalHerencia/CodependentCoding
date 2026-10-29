import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function DocumentSkeleton() {
  return <WorkspaceLoadingState route="/portal/documents/[documentId]" />;
}
