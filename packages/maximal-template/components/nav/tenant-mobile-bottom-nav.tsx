import { TenantMobileBottomNavBlock } from "@/components/blocks/tenant-blocks";
import type { TenantMobileNavigationItem } from "@/types/tenantTypes";

/** Tenant mobile navigation; icons and layout remain in the presentation block. */
export function TenantMobileBottomNav({
  items,
}: {
  items: readonly TenantMobileNavigationItem[];
}) {
  return <TenantMobileBottomNavBlock items={items} />;
}
