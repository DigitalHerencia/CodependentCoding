// components/shells/public-shell.tsx

import type { ReactNode } from "react";

import { PublicFooter } from "@/components/nav/public-footer";
import { PublicHeader } from "@/components/nav/public-header";
import { PublicMobileBottomNav } from "@/components/nav/public-mobile-bottom-nav";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="pb-[calc(3.5rem+env(safe-area-inset-bottom))] md:pb-0">
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
      <PublicMobileBottomNav />
    </div>
  );
}
