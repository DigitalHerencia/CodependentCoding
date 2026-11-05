"use client";
import { FileText, HelpCircle, Home, ShieldCheck } from "lucide-react";
import {
  MobileBottomNav,
  type MobileBottomNavItem,
} from "@/components/nav/mobile-bottom-nav";
const publicItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/#features", label: "Features", icon: FileText },
  { href: "/faq", label: "FAQ", icon: HelpCircle },
  { href: "/sign-in", label: "Sign In", icon: ShieldCheck },
] satisfies readonly MobileBottomNavItem[];

export function PublicMobileBottomNav() {
  return (
    <MobileBottomNav
      items={publicItems}
      aria-label="Public mobile navigation"
    />
  );
}
