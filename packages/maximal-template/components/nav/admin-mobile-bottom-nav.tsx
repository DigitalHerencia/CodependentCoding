"use client";
import { MobileBottomNav } from "@/components/nav/mobile-bottom-nav";
import { adminNavItems } from "@/components/nav/admin-nav-links";
export function AdminMobileBottomNav() {
  return (
    <MobileBottomNav
      items={adminNavItems}
      aria-label="Admin mobile navigation"
    />
  );
}
