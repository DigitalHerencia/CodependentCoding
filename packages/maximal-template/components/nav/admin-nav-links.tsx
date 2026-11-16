"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  adminNavigationCopy,
  adminNavigationItems,
} from "@/content/admin-navigation";

export const adminNavItems = adminNavigationItems;

/** Link visibility is discovery only; AdminGateFeature and server commands remain authoritative. */
export function AdminNavLinks() {
  const pathname = usePathname();
  return (
    <nav
      aria-label={adminNavigationCopy.navigation}
      className="flex min-w-0 flex-col gap-2 lg:flex-row lg:flex-wrap lg:gap-4"
    >
      {adminNavItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          aria-current={
            pathname === item.href || pathname.startsWith(`${item.href}/`)
              ? "page"
              : undefined
          }
          className="min-h-11 type-link rounded-sm px-3 py-2 break-words focus-visible:outline-2 focus-visible:outline-offset-2 aria-[current=page]:text-primary aria-[current=page]:underline"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
