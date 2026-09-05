import type { ReactNode } from "react";
import { PublicShell } from "@/components/shells/public-shell";
import { PublicHeader } from "@/components/nav/public-header";
import { PublicFooter } from "@/components/nav/public-footer";
import { PublicMobileBottomNav } from "@/components/nav/mobile-bottom-nav";
export default function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <PublicShell>
      <PublicHeader />
      <main className="flex-1">{children}</main>
      <PublicFooter />
      <PublicMobileBottomNav />
    </PublicShell>
  );
}
