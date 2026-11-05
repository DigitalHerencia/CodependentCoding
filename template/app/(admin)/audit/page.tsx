import { Suspense } from "react";

import { AdminAuditFeature } from "@/features/admin/admin-audit-feature";
import { AdminAuditSkeleton } from "@/features/admin/admin-audit-skeleton";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const criteria = await searchParams;
  return (
    <Suspense fallback={<AdminAuditSkeleton />}>
      <AdminAuditFeature criteria={criteria} />
    </Suspense>
  );
}
