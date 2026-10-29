import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function IntegrationsSkeleton() {
  return <WorkspaceLoadingState route="/settings/integrations" />;
}
