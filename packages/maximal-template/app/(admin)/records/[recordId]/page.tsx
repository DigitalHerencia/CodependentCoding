/** records/[recordId] route delegates data and UI orchestration to its feature. */
import { Suspense } from "react";
import { AdminRecordDetailFeature } from "@/features/admin/admin-record-detail-feature";
import { AdminRecordDetailSkeleton } from "@/features/admin/admin-record-detail-skeleton";
import type { AdminRecordRouteProps } from "@/types/adminTypes";
/** Stream the page feature behind its accessible skeleton. */
export default function Page({ params }: AdminRecordRouteProps) {
  return (
    <Suspense fallback={<AdminRecordDetailSkeleton />}>
      <AdminRecordDetailFeature params={params} />
    </Suspense>
  );
}
