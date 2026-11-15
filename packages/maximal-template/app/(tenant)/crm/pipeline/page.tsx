import { Suspense } from "react";

import { CrmPipelineFeature } from "@/features/crm/crm-pipeline-feature";
import { CrmPipelineSkeleton } from "@/features/crm/crm-pipeline-skeleton";

/** Tenant CRM route: URL query and streaming boundary only. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.slice(0, 100) : "";
  return (
    <Suspense fallback={<CrmPipelineSkeleton />}>
      <CrmPipelineFeature query={query} />
    </Suspense>
  );
}
