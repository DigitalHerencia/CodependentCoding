import { Suspense } from "react";

import { CrmContactsFeature } from "@/features/crm/crm-contacts-feature";
import { CrmContactsSkeleton } from "@/features/crm/crm-contacts-skeleton";

/** Tenant CRM route: URL query and streaming boundary only. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[] }>;
}) {
  const { q } = await searchParams;
  const query = typeof q === "string" ? q.slice(0, 100) : "";
  return (
    <Suspense fallback={<CrmContactsSkeleton />}>
      <CrmContactsFeature query={query} />
    </Suspense>
  );
}
