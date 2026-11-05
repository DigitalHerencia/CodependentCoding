import type { ReactNode } from "react";
import { Wordmark } from "@/components/brand/wordmark";
import { AdminNavLinks } from "@/components/nav/admin-nav-links";
export function AdminHeader({ accountMenu }: { accountMenu: ReactNode }) {
  return (
    <header className="flex flex-wrap items-center justify-between gap-4 border-b bg-background px-6 py-4">
      <Wordmark />
      <AdminNavLinks />
      {accountMenu}
    </header>
  );
}
