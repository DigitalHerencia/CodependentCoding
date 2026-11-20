import { MarketingAudiencesTemplate } from "@/components/templates/marketing-templates";
import { loadAudiencesWorkflow } from "@/lib/workflows/marketingWorkflows";
import type { MarketingRouteQuery } from "@/types/marketingTypes";
/** Compose persisted audience search and paging through the domain workflow. */
export async function AudiencesFeature({ query = {} }: { query?: MarketingRouteQuery }) {
  return <MarketingAudiencesTemplate {...await loadAudiencesWorkflow(query)} />;
}

