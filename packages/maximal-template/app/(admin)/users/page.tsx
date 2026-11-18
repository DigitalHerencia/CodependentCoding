/** users route delegates data and UI orchestration to its feature. */
import { Suspense } from "react";
import { AdminUsersFeature } from "@/features/admin/admin-users-feature";
import { AdminUsersSkeleton } from "@/features/admin/admin-users-skeleton";
import type { AdminListRouteProps } from "@/types/adminTypes";
/** Stream the page feature behind its accessible skeleton. */
export default function Page({ searchParams }: AdminListRouteProps) {
  return (
    <Suspense fallback={<AdminUsersSkeleton />}>
      <AdminUsersFeature criteria={searchParams} />
    </Suspense>
  );
}
