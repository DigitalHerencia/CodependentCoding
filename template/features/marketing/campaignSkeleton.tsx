import { WorkspaceLoadingState } from "@/components/blocks/loading-states";

export function CampaignSkeleton() {
  return <WorkspaceLoadingState route="/marketing/campaigns/[campaignId]" />;
}
