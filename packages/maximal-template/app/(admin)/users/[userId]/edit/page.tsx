/** users/[userId]/edit route delegates data and UI orchestration to its feature. */
import { Suspense } from "react";
import { AdminEditUserFeature } from "@/features/admin/admin-edit-user-feature";
import { AdminFormSkeleton } from "@/features/admin/admin-form-skeleton";
import type { AdminUserRouteProps } from "@/types/adminTypes";
/** Stream the page feature behind its accessible skeleton. */
export default function Page({ params }: AdminUserRouteProps) {
  return (
    <Suspense fallback={<AdminFormSkeleton />}>
      <AdminEditUserFeature params={params} />
    </Suspense>
  );
}
