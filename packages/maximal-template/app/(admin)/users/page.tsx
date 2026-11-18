/** users route delegates data and UI orchestration to its feature. */
import { Suspense } from "react";
import { AdminUsersFeature } from "@/features/admin/adminUsersFeature";
import { AdminUsersSkeleton } from "@/features/admin/adminUsersSkeleton";
import type { AdminListRouteProps } from "@/types/adminTypes";
/** Stream the page feature behind its accessible skeleton. */
export default function Page({ searchParams }: AdminListRouteProps) {
  return (
    <Suspense fallback={<AdminUsersSkeleton />}>
      <AdminUsersFeature criteria={searchParams} />
    </Suspense>
  );
}
