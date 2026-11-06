import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function DocumentSkeleton() {
  return <WorkspaceLoadingTemplate route="/portal/documents/[documentId]" />;
}
