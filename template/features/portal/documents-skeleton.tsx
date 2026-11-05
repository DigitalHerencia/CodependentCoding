import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function DocumentsSkeleton() {
  return <WorkspaceLoadingState route="/portal/documents" />;
}
