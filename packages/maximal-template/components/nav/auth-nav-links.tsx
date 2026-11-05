"use client";
import { Home, LogIn, UserPlus, HelpCircle } from "lucide-react";
import { PublicNavLink } from "@/components/nav/public-nav-link";
import type { MobileBottomNavItem } from "@/components/nav/mobile-bottom-nav";
export const authNavItems = [
  { href: "/", label: "Home", icon: Home },
  { href: "/sign-in", label: "Sign in", icon: LogIn },
  { href: "/sign-up", label: "Sign up", icon: UserPlus },
  { href: "/faq", label: "Help", icon: HelpCircle },
] satisfies readonly MobileBottomNavItem[];
export function AuthNavLinks() {
  return (
    <nav aria-label="Auth navigation" className="flex flex-wrap gap-4">
      {authNavItems.map((item) => (
        <PublicNavLink key={item.href} href={item.href} label={item.label} />
      ))}
    </nav>
  );
}
