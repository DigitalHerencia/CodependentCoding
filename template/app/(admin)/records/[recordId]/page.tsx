import { Suspense } from "react";

import { AdminRecordDetailFeature } from "@/features/admin/admin-record-detail-feature";
import { AdminRecordDetailSkeleton } from "@/features/admin/admin-record-detail-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ recordId: string }>;
}) {
  const { recordId } = await params;
  return (
    <Suspense fallback={<AdminRecordDetailSkeleton />}>
      <AdminRecordDetailFeature recordId={recordId} />
    </Suspense>
  );
}
