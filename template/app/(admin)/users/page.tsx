import { Suspense } from "react";

import { AdminUsersFeature } from "@/features/admin/admin-users-feature";
import { AdminUsersSkeleton } from "@/features/admin/admin-users-skeleton";

export default async function Page() {
  return (
    <Suspense fallback={<AdminUsersSkeleton />}>
      <AdminUsersFeature />
    </Suspense>
  );
}
