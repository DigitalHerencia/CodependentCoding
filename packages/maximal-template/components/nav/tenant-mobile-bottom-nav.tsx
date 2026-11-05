"use client";
import { MobileBottomNav } from "@/components/nav/mobile-bottom-nav";
import { tenantMobileItems } from "@/components/nav/tenant-nav-links";
export function TenantMobileBottomNav() {
  return (
    <MobileBottomNav
      items={tenantMobileItems}
      aria-label="Tenant mobile navigation"
    />
  );
}
