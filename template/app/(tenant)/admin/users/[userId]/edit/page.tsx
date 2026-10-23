import { Suspense } from "react";

import { AdminEditUserForm } from "@/features/admin/adminEditUserForm";
import { AdminUserDetailSkeleton } from "@/features/admin/adminUserDetailSkeleton";

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
