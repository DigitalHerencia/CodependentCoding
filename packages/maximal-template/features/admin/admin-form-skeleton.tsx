/** Accessible edit fallback with no application imports or skeleton template. */
import type { AdminSkeletonProps } from "@/types/adminTypes";
import { AdminSkeletonBlock } from "@/components/blocks/admin-blocks";
/** Announce the pending edit route while its feature streams. */
export function AdminFormSkeleton({ variant = "edit" }: AdminSkeletonProps) {
  return <AdminSkeletonBlock variant={variant} />;
}
