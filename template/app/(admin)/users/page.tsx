import { Suspense } from "react";

import { AdminUsersFeature } from "@/features/admin/admin-users-feature";
import { AdminUsersSkeleton } from "@/features/admin/admin-users-skeleton";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; query?: string }>;
}) {
  const criteria = await searchParams;
  return (
    <Suspense fallback={<AdminUsersSkeleton />}>
      <AdminUsersFeature criteria={criteria} />
    </Suspense>
  );
}
