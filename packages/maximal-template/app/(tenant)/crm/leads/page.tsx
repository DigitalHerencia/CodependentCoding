import { Suspense } from "react";

import { CrmLeadsFeature } from "@/features/crm/crm-leads-feature";
import { CrmLeadsSkeleton } from "@/features/crm/crm-leads-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<CrmLeadsSkeleton />}>
      <CrmLeadsFeature />
    </Suspense>
  );
}
