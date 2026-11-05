import { Suspense } from "react";

import { AdminEditUserForm } from "@/features/admin/admin-edit-user-form";
import { AdminUserDetailSkeleton } from "@/features/admin/admin-user-detail-skeleton";

export default async function Page({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const { userId } = await params;
  return (
    <Suspense fallback={<AdminUserDetailSkeleton />}>
      <AdminEditUserForm userId={userId} />
    </Suspense>
  );
}
