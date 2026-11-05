import { Suspense } from "react";

import { AdminRecordsFeature } from "@/features/admin/admin-records-feature";
import { AdminRecordsSkeleton } from "@/features/admin/admin-records-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<AdminRecordsSkeleton />}>
      <AdminRecordsFeature />
    </Suspense>
  );
}
