import { Suspense } from "react";

import { AdminUserDetailFeature } from "@/features/admin/admin-user-detail-feature";
import { AdminUserDetailSkeleton } from "@/features/admin/admin-user-detail-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return (
    <Suspense fallback={<AdminUserDetailSkeleton />}>
      <AdminUserDetailFeature userId={userId} />
    </Suspense>
  );
}
