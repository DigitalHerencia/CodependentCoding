/** users/[userId]/edit route delegates data and UI orchestration to its feature. */
import { Suspense } from "react";
import { AdminEditUserFeature } from "@/features/admin/adminEditUserFeature";
import { AdminEditUserSkeleton } from "@/features/admin/adminEditUserSkeleton";
import type { AdminUserRouteProps } from "@/types/adminTypes";
/** Stream the page feature behind its accessible skeleton. */
export default function Page({ params }: AdminUserRouteProps) {
  return (
    <Suspense fallback={<AdminEditUserSkeleton />}>
      <AdminEditUserFeature params={params} />
    </Suspense>
  );
}
