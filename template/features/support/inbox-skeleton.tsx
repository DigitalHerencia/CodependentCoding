import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function InboxSkeleton() {
  return <WorkspaceLoadingState route="/support/inbox" />;
}
