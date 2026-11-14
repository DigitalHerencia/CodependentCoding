import { TenantHeaderBlock } from "@/components/blocks/tenant-blocks";
import type { TenantHeaderBlockProps } from "@/types/tenantTypes";

/** Tenant header component; presentation resides in the corresponding block. */
export function TenantHeader(props: TenantHeaderBlockProps) {
  return <TenantHeaderBlock {...props} />;
}
