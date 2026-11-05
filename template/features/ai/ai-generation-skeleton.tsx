import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function AiGenerationSkeleton() {
  return <WorkspaceLoadingState route="/ai" />;
}
