import { Suspense } from "react";
import { CampaignFeature } from "@/features/marketing/campaign-feature";
import { CampaignSkeleton } from "@/features/marketing/campaign-skeleton";
import type { MarketingRouteQuery } from "@/types/marketingTypes";
/** URL boundary composes the route feature inside its corresponding Suspense skeleton. */
export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ campaignId: string }>;
  searchParams: Promise<MarketingRouteQuery>;
}) {
  const [{ campaignId }, query] = await Promise.all([params, searchParams]);
  return (
    <Suspense key={JSON.stringify(query)} fallback={<CampaignSkeleton />}>
      <CampaignFeature campaignId={campaignId} stepPage={query.stepPage} />
    </Suspense>
  );
}
