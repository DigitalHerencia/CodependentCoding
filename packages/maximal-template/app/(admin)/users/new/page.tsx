/** users/new route delegates data and UI orchestration to its feature. */
import { Suspense } from "react";
import { AdminNewUserForm } from "@/features/admin/adminNewUserForm";
import { AdminNewUserSkeleton } from "@/features/admin/adminNewUserSkeleton";

/** Stream the page feature behind its accessible skeleton. */
export default function Page() {
  return (
    <Suspense fallback={<AdminNewUserSkeleton />}>
      <AdminNewUserForm />
    </Suspense>
  );
}
