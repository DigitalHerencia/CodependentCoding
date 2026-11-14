"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { PublicNavLinkProps } from "@/types/publicTypes";

// ============================================================================
// PUBLIC NAVIGATION LINK
// ============================================================================

/**
 * Renders a public destination with an accessible active-page indication.
 *
 * @param props - Public link text and destination.
 * @returns A route-aware link.
 * @public
 */
export function PublicNavLink({ href, label }: PublicNavLinkProps) {
  const pathname = usePathname();
  const targetPath = href.split(/[?#]/, 1)[0] || "/";
  const active = pathname === targetPath;

  return (
    <Link
      href={href}
      className="public-nav-link"
      aria-current={active ? "page" : undefined}
    >
      {label}
    </Link>
  );
}
