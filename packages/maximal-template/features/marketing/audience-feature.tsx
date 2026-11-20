import { MarketingAudienceDetailTemplate } from "@/components/templates/marketing-templates";
import { loadAudienceWorkflow } from "@/lib/workflows/marketingWorkflows";
/** Render the persisted audience definition through its single detail template. */
export async function AudienceFeature({ audienceId }: { audienceId: string }) {
  return <MarketingAudienceDetailTemplate {...await loadAudienceWorkflow({ audienceId })} />;
}

