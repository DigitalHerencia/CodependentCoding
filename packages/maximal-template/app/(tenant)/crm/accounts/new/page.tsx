import { Suspense } from "react";

import { CrmNewAccountForm } from "@/features/crm/crmNewAccountForm";
import { CrmFormSkeleton } from "@/features/crm/crmSkeletons";

/** Tenant CRM creation route with a standard Suspense fallback. */
export default function Page() {
  return (
    <Suspense fallback={<CrmFormSkeleton />}>
      <CrmNewAccountForm />
    </Suspense>
  );
}
