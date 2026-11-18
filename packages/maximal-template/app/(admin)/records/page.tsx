/** records route delegates data and UI orchestration to its feature. */
import { Suspense } from "react";
import { AdminRecordsFeature } from "@/features/admin/admin-records-feature";
import { AdminRecordsSkeleton } from "@/features/admin/admin-records-skeleton";

/** Stream the page feature behind its accessible skeleton. */
export default function Page() {
  return (
    <Suspense fallback={<AdminRecordsSkeleton />}>
      <AdminRecordsFeature />
    </Suspense>
  );
}
