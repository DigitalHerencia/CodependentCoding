/** Direct skeleton boundary for the edit member route. */
import { AdminSkeletonBlock } from "@/components/blocks/admin-blocks";
/** Announce pending form presentation without a skeleton template. */
export function AdminEditUserSkeleton() {
  return <AdminSkeletonBlock variant="edit" />;
}
