import { MarketingAnalyticsTemplate } from "@/components/templates/marketing-templates";
import { loadMarketingAnalyticsWorkflow } from "@/lib/workflows/marketingWorkflows";
import type { MarketingRouteQuery } from "@/types/marketingTypes";
/** Compose real planning analytics for the selected UTC creation range. */
export async function MarketingAnalyticsFeature({
  query = {},
}: {
  query?: MarketingRouteQuery;
}) {
  return (
    <MarketingAnalyticsTemplate
      {...await loadMarketingAnalyticsWorkflow(query)}
    />
  );
}
