/** Tenant-only fallback; the group layout supplies its own shell. */
import { TenantLoadingBlock } from "@/components/blocks/tenant-blocks";
/** Import skeleton blocks directly without a skeleton template. */
export default function TenantLoading() {
  return <TenantLoadingBlock />;
}
