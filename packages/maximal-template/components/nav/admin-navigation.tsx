"use client";
/** Browser navigation tracks the active admin route without application dependencies. */
import Link from "next/link";
import { usePathname } from "next/navigation";
import type {
  AdminChildrenProps,
  AdminNavigationLinksProps,
} from "@/types/adminTypes";
/** Navigation visibility is discovery; workflows enforce access independently. */
export function AdminNavigationLinks({
  label,
  items,
  onNavigate,
}: AdminNavigationLinksProps) {
  const pathname = usePathname();
  return (
    <nav aria-label={label} className="flex min-w-0 flex-col gap-2">
      {items.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          {...(onNavigate ? { onClick: onNavigate } : {})}
          aria-current={
            pathname === item.href ||
            (item.href !== "/admin" && pathname.startsWith(`${item.href}/`))
              ? "page"
              : undefined
          }
          className="min-h-11 type-link rounded-sm px-3 py-2 break-words focus-visible:outline-2 focus-visible:outline-offset-2 aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground"
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}

/** Own the responsive sidebar's location while blocks supply its primitive composition. */
export function AdminNavigation({ children }: AdminChildrenProps) {
  return (
    <aside className="sticky top-0 h-dvh shrink-0 self-start">{children}</aside>
  );
}
