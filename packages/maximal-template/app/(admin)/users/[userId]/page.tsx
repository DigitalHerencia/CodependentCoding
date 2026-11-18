/** users/[userId] route delegates data and UI orchestration to its feature. */
import { Suspense } from "react";
import { AdminUserDetailFeature } from "@/features/admin/admin-user-detail-feature";
import { AdminUserDetailSkeleton } from "@/features/admin/admin-user-detail-skeleton";
import type { AdminUserRouteProps } from "@/types/adminTypes";
/** Stream the page feature behind its accessible skeleton. */
export default function Page({ params }: AdminUserRouteProps) {
  return (
    <Suspense fallback={<AdminUserDetailSkeleton />}>
      <AdminUserDetailFeature params={params} />
    </Suspense>
  );
}
