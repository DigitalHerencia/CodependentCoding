/** Administration overview streams authorized data through its feature. */
import { Suspense } from "react";
import { AdminDashboardFeature } from "@/features/admin/adminDashboardFeature";
import { AdminDashboardSkeleton } from "@/features/admin/adminDashboardSkeleton";

/** Keep the route limited to its feature and loading boundary. */
export default function Page() {
  return (
    <Suspense fallback={<AdminDashboardSkeleton />}>
      <AdminDashboardFeature />
    </Suspense>
  );
}
