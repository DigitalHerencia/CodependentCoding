import { Suspense } from "react";

import { AdminAuditFeature } from "@/features/admin/admin-audit-feature";
import { AdminAuditSkeleton } from "@/features/admin/admin-audit-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<AdminAuditSkeleton />}>
      <AdminAuditFeature />
    </Suspense>
  );
}
