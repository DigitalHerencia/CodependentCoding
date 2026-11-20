import { Suspense } from "react";
import { CampaignNewFeature } from "@/features/marketing/campaign-new-feature";
import { CampaignFormSkeleton } from "@/features/marketing/campaign-form-skeleton";
/** URL boundary composes the route feature inside its corresponding Suspense skeleton. */
export default async function Page() {
  return <Suspense fallback={<CampaignFormSkeleton />}><CampaignNewFeature /></Suspense>;
}

