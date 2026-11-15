import { Suspense } from "react";

import { CrmAccountsFeature } from "@/features/crm/crmAccountsFeature";
import { CrmAccountsSkeleton } from "@/features/crm/crmSkeletons";

/** Thin CRM tenant route: URL parsing happens in the named server workflow. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const criteria = await searchParams;
  return (
    <Suspense fallback={<CrmAccountsSkeleton />}>
      <CrmAccountsFeature criteria={criteria} />
    </Suspense>
  );
}
