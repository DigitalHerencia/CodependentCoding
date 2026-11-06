import { WorkspaceLoadingTemplate } from "@/components/templates/shared-templates";

export function CampaignSkeleton() {
  return <WorkspaceLoadingTemplate route="/marketing/campaigns/[campaignId]" />;
}
