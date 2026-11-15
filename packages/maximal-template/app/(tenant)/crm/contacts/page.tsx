import { Suspense } from "react";

import { CrmContactsFeature } from "@/features/crm/crmContactsFeature";
import { CrmContactsSkeleton } from "@/features/crm/crmSkeletons";

/** Thin CRM tenant route: URL parsing happens in the named server workflow. */
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const criteria = await searchParams;
  return (
    <Suspense fallback={<CrmContactsSkeleton />}>
      <CrmContactsFeature criteria={criteria} />
    </Suspense>
  );
}
