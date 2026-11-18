"use client";
/** Browser navigation tracks the active admin route without application dependencies. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { AdminNavigationProps } from "@/types/adminTypes";
/** Navigation visibility is discovery; workflows enforce access independently. */
export function AdminNavigation({ label, items }: AdminNavigationProps) {
  const pathname = usePathname();
  return (
    <nav
      aria-label={label}
      className="flex min-w-0 flex-col gap-2 lg:flex-row lg:flex-wrap lg:gap-4"
    >
      {items.map((item) => (
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
