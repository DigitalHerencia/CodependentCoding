/** users/new route delegates data and UI orchestration to its feature. */
import { Suspense } from "react";
import { NewAdminUserForm } from "@/features/admin/newAdminUserForm";
import { AdminFormSkeleton } from "@/features/admin/admin-form-skeleton";

/** Stream the page feature behind its accessible skeleton. */
export default function Page() {
  return (
    <Suspense fallback={<AdminFormSkeleton variant="new" />}>
      <NewAdminUserForm />
    </Suspense>
  );
}
