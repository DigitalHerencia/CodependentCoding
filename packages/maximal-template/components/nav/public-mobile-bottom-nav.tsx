"use client";

import type { LucideIcon } from "lucide-react";
import { FileText, HelpCircle, Home, ShieldCheck } from "lucide-react";

import {
  MobileBottomNav,
  type MobileBottomNavItem,
} from "@/components/nav/mobile-bottom-nav";
import { publicNavigation } from "@/content/public";
import type { PublicMobileNavIcon } from "@/types/publicTypes";

// ============================================================================
// PUBLIC MOBILE DESTINATION ICONS
// ============================================================================

/** The view resolves icon references; copy owns destinations and labels. */
const publicIcons = {
  home: Home,
  features: FileText,
  faq: HelpCircle,
  signIn: ShieldCheck,
} satisfies Record<PublicMobileNavIcon, LucideIcon>;

const publicItems = publicNavigation.mobileLinks.map(({ icon, ...link }) => ({
  ...link,
  icon: publicIcons[icon],
})) satisfies readonly MobileBottomNavItem[];

// ============================================================================
// PUBLIC MOBILE BOTTOM NAVIGATION
// ============================================================================

/**
 * Renders the public-only mobile destinations from centralized copy.
 *
 * @returns Accessible mobile navigation.
 * @public
 */
export function PublicMobileBottomNav() {
  return (
    <MobileBottomNav
      items={publicItems}
      aria-label={publicNavigation.mobileLabel}
    />
  );
}
