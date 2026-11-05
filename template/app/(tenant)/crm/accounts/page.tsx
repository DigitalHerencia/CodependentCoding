import { Suspense } from "react";

import { CrmAccountsFeature } from "@/features/crm/crm-accounts-feature";
import { CrmAccountsSkeleton } from "@/features/crm/crm-accounts-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<CrmAccountsSkeleton />}>
      <CrmAccountsFeature />
    </Suspense>
  );
}
