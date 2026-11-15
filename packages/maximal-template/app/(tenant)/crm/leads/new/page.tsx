import { Suspense } from "react";

import { NewCrmLeadForm } from "@/features/crm/newCrmLeadForm";
import { CrmFormSkeleton } from "@/features/crm/crm-form-skeleton";

/** Tenant CRM creation route with a standard Suspense fallback. */
export default function Page() {
  return (
    <Suspense fallback={<CrmFormSkeleton />}>
      <NewCrmLeadForm />
    </Suspense>
  );
}
