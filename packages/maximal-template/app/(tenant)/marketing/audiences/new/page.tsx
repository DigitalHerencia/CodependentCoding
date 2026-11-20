import { Suspense } from "react";
import { AudienceNewFeature } from "@/features/marketing/audience-new-feature";
import { AudienceFormSkeleton } from "@/features/marketing/audience-form-skeleton";
/** URL boundary composes the route feature inside its corresponding Suspense skeleton. */
export default async function Page() {
  return <Suspense fallback={<AudienceFormSkeleton />}><AudienceNewFeature /></Suspense>;
}

