import { Suspense } from "react";

import { CrmNewLeadForm } from "@/features/crm/crmNewLeadForm";
import { CrmFormSkeleton } from "@/features/crm/crmSkeletons";

/** Tenant CRM creation route with a standard Suspense fallback. */
export default function Page() {
  return (
    <Suspense fallback={<CrmFormSkeleton />}>
      <CrmNewLeadForm />
    </Suspense>
  );
}
