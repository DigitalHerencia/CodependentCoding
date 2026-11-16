import type { ReactNode } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { AdminNavLinks } from "@/components/nav/admin-nav-links";
import { AuthenticatedMobileNavigation } from "@/components/nav/authenticated-mobile-navigation";
import { adminNavigationCopy } from "@/content/admin-navigation";

/** Desktop administration and the shared phone/tablet overlay have one visible navigation each. */
export function AdminHeader({
  accountMenu,
  mobileAccountMenu,
}: {
  accountMenu: ReactNode;
  mobileAccountMenu: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-40 flex min-w-0 items-center justify-between gap-4 border-b bg-background px-4 py-4 lg:static lg:flex-wrap lg:px-6">
      <Wordmark />
      <div className="hidden min-w-0 lg:block">
        <AdminNavLinks />
      </div>
      <div className="hidden lg:block">{accountMenu}</div>
      <AuthenticatedMobileNavigation title={adminNavigationCopy.navigation}>
        <AdminNavLinks />
        {mobileAccountMenu}
      </AuthenticatedMobileNavigation>
    </header>
  );
}
