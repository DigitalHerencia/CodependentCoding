/** audit route delegates data and UI orchestration to its feature. */
import { Suspense } from "react";
import { AdminAuditFeature } from "@/features/admin/admin-audit-feature";
import { AdminAuditSkeleton } from "@/features/admin/admin-audit-skeleton";
import type { AdminListRouteProps } from "@/types/adminTypes";
/** Stream the page feature behind its accessible skeleton. */
export default function Page({ searchParams }: AdminListRouteProps) {
  return (
    <Suspense fallback={<AdminAuditSkeleton />}>
      <AdminAuditFeature criteria={searchParams} />
    </Suspense>
  );
}
