import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function DocumentsSkeleton() {
  return <WorkspaceLoadingState route="/portal/documents" />;
}
