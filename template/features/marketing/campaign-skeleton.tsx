import { WorkspaceLoadingState } from "@/components/blocks/shared-blocks";

export function CampaignSkeleton() {
  return <WorkspaceLoadingState route="/marketing/campaigns/[campaignId]" />;
}
