"use client";
import { Users, FileText, ShieldCheck, Home } from "lucide-react";
import { PublicNavLink } from "@/components/nav/public-nav-link";
import type { MobileBottomNavItem } from "@/components/nav/mobile-bottom-nav";
export const adminNavItems = [
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/records", label: "Records", icon: FileText },
  { href: "/admin/audit", label: "Audit", icon: ShieldCheck },
  { href: "/dashboard", label: "Workspace", icon: Home },
] satisfies readonly MobileBottomNavItem[];
export function AdminNavLinks() {
  return (
    <nav aria-label="Admin navigation" className="flex flex-wrap gap-4">
      {adminNavItems.map((item) => (
        <PublicNavLink key={item.href} href={item.href} label={item.label} />
      ))}
    </nav>
  );
}
