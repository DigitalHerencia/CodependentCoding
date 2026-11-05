import type { ReactNode } from "react";
import { AdminHeader } from "@/components/nav/admin-header";
import { AdminFooter } from "@/components/nav/admin-footer";
import { AdminMobileBottomNav } from "@/components/nav/admin-mobile-bottom-nav";
export function AdminShell({
  children,
  accountMenu,
}: {
  children: ReactNode;
  accountMenu: ReactNode;
}) {
  return (
    <div className="min-h-dvh pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <AdminHeader accountMenu={accountMenu} />
      <main>{children}</main>
      <AdminFooter />
      <AdminMobileBottomNav />
    </div>
  );
}
