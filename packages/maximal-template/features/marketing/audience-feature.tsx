import { MarketingAudienceDetailTemplate } from "@/components/templates/marketing-templates";
import { loadAudienceWorkflow } from "@/lib/workflows/marketingWorkflows";

export async function AudienceFeature({ audienceId }: { audienceId: string }) {
  const { audience } = await loadAudienceWorkflow({ audienceId });
  return <MarketingAudienceDetailTemplate audience={audience} />;
}
