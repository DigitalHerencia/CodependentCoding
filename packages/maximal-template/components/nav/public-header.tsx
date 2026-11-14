/**
 * Public account navigation and branded header.
 *
 * @remarks
 * Links and labels are supplied by `content/public.ts`; props live in
 * `types/publicTypes.ts`.
 */

import Link from "next/link";
import { LogoLockup } from "@/components/brand/logo-lockup";
import { Button } from "@/components/ui/button";
import { applicationProduct } from "@/content/application";
import { publicNavigation } from "@/content/public";
import type { PublicHeaderProps } from "@/types/publicTypes";

// ============================================================================
// PUBLIC HEADER
// ============================================================================

/**
 * Renders the branded public header and account actions.
 *
 * @param props - Optional brand lockup override.
 * @returns Public account navigation.
 * @public
 */
export function PublicHeader({ logo = <LogoLockup /> }: PublicHeaderProps) {
  return (
    <header className="public-header">
      <div className="public-header-inner">
        <Link
          href="/"
          aria-label={applicationProduct.brand.homeLabel}
          className="brand-home"
        >
          {logo}
        </Link>
        <nav
          className="public-header-actions"
          aria-label={publicNavigation.headerLabel}
        >
          {publicNavigation.headerLinks.map((item, index) => (
            <Button
              key={item.href}
              variant={index === 0 ? "default" : "outline"}
              size="default"
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>
      </div>
    </header>
  );
}
