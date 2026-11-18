/** records route delegates data and UI orchestration to its feature. */
import { Suspense } from "react";
import { AdminRecordsFeature } from "@/features/admin/adminRecordsFeature";
import { AdminRecordsSkeleton } from "@/features/admin/adminRecordsSkeleton";

/** Stream the page feature behind its accessible skeleton. */
export default function Page() {
  return (
    <Suspense fallback={<AdminRecordsSkeleton />}>
      <AdminRecordsFeature />
    </Suspense>
  );
}
