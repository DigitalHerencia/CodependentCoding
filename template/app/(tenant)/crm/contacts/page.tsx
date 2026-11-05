import { Suspense } from "react";

import { CrmContactsFeature } from "@/features/crm/crm-contacts-feature";
import { CrmContactsSkeleton } from "@/features/crm/crm-contacts-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<CrmContactsSkeleton />}>
      <CrmContactsFeature />
    </Suspense>
  );
}
