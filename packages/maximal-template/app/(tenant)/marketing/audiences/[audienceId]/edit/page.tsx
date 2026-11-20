import { Suspense } from "react";
import { AudienceEditFeature } from "@/features/marketing/audience-edit-feature";
import { AudienceFormSkeleton } from "@/features/marketing/audience-form-skeleton";
/** URL boundary composes the route feature inside its corresponding Suspense skeleton. */
export default async function Page({
  params,
}: {
  params: Promise<{ audienceId: string }>;
}) {
  const { audienceId } = await params;
  return (
    <Suspense fallback={<AudienceFormSkeleton />}>
      <AudienceEditFeature audienceId={audienceId} />
    </Suspense>
  );
}
