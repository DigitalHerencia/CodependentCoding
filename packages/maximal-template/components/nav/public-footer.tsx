/**
 * Public footer navigation and copyright presentation.
 *
 * @remarks
 * Labels and link destinations are owned by `content/public.ts`.
 */

import { cacheLife } from "next/cache";

import { PublicNavLink } from "@/components/nav/public-nav-link";
import { publicNavigation } from "@/content/public";
import type { PublicFooterProps } from "@/types/publicTypes";

// ============================================================================
// CACHED COPYRIGHT YEAR
// ============================================================================

/** The year is part of the static page; the cached value refreshes daily. */
async function CopyrightYear() {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
}

// ============================================================================
// PUBLIC FOOTER
// ============================================================================

/**
 * Renders the public copyright and informational destinations.
 *
 * @param props - Optional links for the footer navigation.
 * @returns Public footer presentation.
 * @public
 */
export function PublicFooter({
  links = publicNavigation.footerLinks,
}: PublicFooterProps) {
  return (
    <footer className="public-footer">
      <div className="public-footer-inner">
        <p className="public-copyright">
          © <CopyrightYear /> {publicNavigation.copyright}
        </p>
        <nav className="public-nav" aria-label={publicNavigation.footerLabel}>
          {links.map((item) => (
            <PublicNavLink key={item.href} {...item} />
          ))}
        </nav>
      </div>
    </footer>
  );
}
