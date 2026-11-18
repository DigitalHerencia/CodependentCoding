/** Overview loading consumes the shared skeleton block directly. */
import { AdminSkeletonBlock } from "@/components/blocks/admin-blocks";

/** Announce the pending overview while hiding decorative placeholders. */
export function AdminDashboardSkeleton() {
  return <AdminSkeletonBlock variant="dashboard" />;
}
