import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function CampaignsSkeleton() {
  return <WorkspaceLoadingState route="/marketing/campaigns" />;
}
