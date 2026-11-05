import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function DocumentSkeleton() {
  return <WorkspaceLoadingState route="/portal/documents/[documentId]" />;
}
