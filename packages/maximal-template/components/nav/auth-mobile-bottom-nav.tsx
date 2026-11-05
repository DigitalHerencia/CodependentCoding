"use client";
import { MobileBottomNav } from "@/components/nav/mobile-bottom-nav";
import { authNavItems } from "@/components/nav/auth-nav-links";
export function AuthMobileBottomNav() {
  return (
    <MobileBottomNav items={authNavItems} aria-label="Auth mobile navigation" />
  );
}
