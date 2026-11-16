import type { ReactNode } from "react";
import { AdminHeader } from "@/components/nav/admin-header";
import { AdminFooter } from "@/components/nav/admin-footer";
import { adminNavigationCopy } from "@/content/admin-navigation";
export function AdminShell({
  children,
  accountMenu,
  mobileAccountMenu,
}: {
  children: ReactNode;
  accountMenu: ReactNode;
  mobileAccountMenu: ReactNode;
}) {
  return (
    <div className="flex min-h-dvh min-w-0 flex-col">
      <a
        href="#admin-main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:bg-background focus:px-4 focus:py-2"
      >
        {adminNavigationCopy.skipToContent}
      </a>
      <AdminHeader
        accountMenu={accountMenu}
        mobileAccountMenu={mobileAccountMenu}
      />
      <main id="admin-main-content" tabIndex={-1} className="min-w-0 flex-1">
        {children}
      </main>
      <AdminFooter />
    </div>
  );
}
