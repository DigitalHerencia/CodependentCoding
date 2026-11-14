import { PublicFooter } from "@/components/nav/public-footer";
import { PublicHeader } from "@/components/nav/public-header";
import { PublicMobileBottomNav } from "@/components/nav/public-mobile-bottom-nav";
import { publicNavigation } from "@/content/public";
import type { PublicShellProps } from "@/types/publicTypes";

// ============================================================================
// PUBLIC SHELL
// ============================================================================

/**
 * Frames public routes with shared navigation and a main landmark.
 *
 * @param props - Child route content.
 * @returns Public header, content, footer, and mobile navigation.
 * @public
 */
export function PublicShell({ children }: PublicShellProps) {
  return (
    <div className="flex min-h-dvh flex-col pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <a
        href="#public-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-background focus:px-4 focus:py-2 focus:text-foreground"
      >
        {publicNavigation.skipToContent}
      </a>
      <PublicHeader />
      <main id="public-main-content" className="flex-1">
        {children}
      </main>
      <PublicFooter />
      <PublicMobileBottomNav />
    </div>
  );
}
