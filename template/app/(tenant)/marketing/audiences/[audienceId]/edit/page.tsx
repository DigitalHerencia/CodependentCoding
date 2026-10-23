import { Suspense } from "react";

import { AudienceEditFeature } from "@/features/marketing/audienceEditFeature";
import { AudienceFormSkeleton } from "@/features/marketing/audienceFormSkeleton";

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
