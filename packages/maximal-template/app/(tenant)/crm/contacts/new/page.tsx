import { Suspense } from "react";

import { NewCrmContactForm } from "@/features/crm/newCrmContactForm";
import { CrmFormSkeleton } from "@/features/crm/crm-form-skeleton";

/** Tenant CRM creation route with a standard Suspense fallback. */
export default function Page() {
  return (
    <Suspense fallback={<CrmFormSkeleton />}>
      <NewCrmContactForm />
    </Suspense>
  );
}
