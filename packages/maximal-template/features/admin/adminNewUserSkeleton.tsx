/** Direct skeleton boundary for the new member route. */
import { AdminSkeletonBlock } from "@/components/blocks/admin-blocks";
/** Announce pending form presentation without a skeleton template. */
export function AdminNewUserSkeleton() {
  return <AdminSkeletonBlock variant="new" />;
}
