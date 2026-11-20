import { Suspense } from "react";
import { MarketingAnalyticsFeature } from "@/features/marketing/marketing-analytics-feature";
import { MarketingAnalyticsSkeleton } from "@/features/marketing/marketing-analytics-skeleton";
import type { MarketingRouteQuery } from "@/types/marketingTypes";
/** URL boundary composes the route feature inside its corresponding Suspense skeleton. */
export default async function Page({ searchParams }: { searchParams: Promise<MarketingRouteQuery> }) {
  const query = await searchParams;
  return <Suspense key={JSON.stringify(query)} fallback={<MarketingAnalyticsSkeleton />}><MarketingAnalyticsFeature query={query} /></Suspense>;
}

