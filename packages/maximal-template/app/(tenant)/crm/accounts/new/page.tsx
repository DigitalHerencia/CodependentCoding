import { Suspense } from "react";

import { NewCrmAccountForm } from "@/features/crm/newCrmAccountForm";
import { CrmFormSkeleton } from "@/features/crm/crm-form-skeleton";

/** Tenant CRM creation route with a standard Suspense fallback. */
export default function Page() {
  return (
    <Suspense fallback={<CrmFormSkeleton />}>
      <NewCrmAccountForm />
    </Suspense>
  );
}
