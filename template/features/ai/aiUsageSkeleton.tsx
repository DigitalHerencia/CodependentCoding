import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function AiUsageSkeleton() {
  return <WorkspaceLoadingState route="/ai/usage" />;
}
