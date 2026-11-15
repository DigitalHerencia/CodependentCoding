import { Suspense } from "react";

import { CrmPipelineFeature } from "@/features/crm/crmPipelineFeature";
import { CrmPipelineSkeleton } from "@/features/crm/crmSkeletons";

/** Thin CRM tenant route: URL parsing happens in the named server workflow. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const criteria = await searchParams;
  return (
    <Suspense fallback={<CrmPipelineSkeleton />}>
      <CrmPipelineFeature criteria={criteria} />
    </Suspense>
  );
}
