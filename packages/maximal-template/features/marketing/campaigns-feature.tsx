import { MarketingCampaignsTemplate } from "@/components/templates/marketing-templates";
import { loadCampaignsWorkflow } from "@/lib/workflows/marketingWorkflows";
import type { MarketingRouteQuery } from "@/types/marketingTypes";
/** Compose the campaign directory from one authenticated workflow and one page template. */
export async function CampaignsFeature({ query = {} }: { query?: MarketingRouteQuery }) {
  return <MarketingCampaignsTemplate {...await loadCampaignsWorkflow(query)} />;
}

