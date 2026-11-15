import { Suspense } from "react";

import { CrmNewContactForm } from "@/features/crm/crmNewContactForm";
import { CrmFormSkeleton } from "@/features/crm/crmSkeletons";

/** Tenant CRM creation route with a standard Suspense fallback. */
export default function Page() {
  return (
    <Suspense fallback={<CrmFormSkeleton />}>
      <CrmNewContactForm />
    </Suspense>
  );
}
