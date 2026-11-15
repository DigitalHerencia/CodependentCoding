import { Suspense } from "react";

import { CrmLeadsFeature } from "@/features/crm/crm-leads-feature";
import { CrmLeadsSkeleton } from "@/features/crm/crm-leads-skeleton";

/** Tenant CRM route: URL query and streaming boundary only. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.slice(0, 100) : "";
  return (
    <Suspense fallback={<CrmLeadsSkeleton />}>
      <CrmLeadsFeature query={query} />
    </Suspense>
  );
}
