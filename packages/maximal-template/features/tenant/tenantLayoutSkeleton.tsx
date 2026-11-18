/** Direct skeleton block boundary without application imports. */
import { TenantLoadingBlock } from "@/components/blocks/tenant-blocks";
/** Announce pending workspace content while authentication resolves. */
export function TenantLayoutSkeleton() {
  return <TenantLoadingBlock />;
}
