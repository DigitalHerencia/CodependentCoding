"use client";

import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export interface MobileBottomNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
}

export interface MobileBottomNavProps {
  items: readonly MobileBottomNavItem[];
  "aria-label"?: string;
}

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function MobileBottomNav({
  items,
  "aria-label": ariaLabel = "Mobile navigation",
}: MobileBottomNavProps) {
  const pathname = usePathname();
  return (
    <nav
      aria-label={ariaLabel}
      className="fixed inset-x-0 bottom-0 z-50 grid h-[calc(3.5rem+env(safe-area-inset-bottom))] auto-cols-fr grid-flow-col border-t border-muted bg-background pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={
              isActivePath(pathname, item.href) ? "page" : undefined
            }
            className="flex flex-col items-center justify-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase aria-[current=page]:text-foreground"
          >
            <Icon className="size-4" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
