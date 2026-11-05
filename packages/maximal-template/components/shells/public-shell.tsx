// components/shells/public-shell.tsx

import type { ReactNode } from "react";

import { PublicFooter } from "@/components/nav/public-footer";
import { PublicHeader } from "@/components/nav/public-header";
import { PublicMobileBottomNav } from "@/components/nav/mobile-bottom-nav";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div>
      <PublicHeader />
      <main>{children}</main>
      <PublicFooter />
      <PublicMobileBottomNav />
    </div>
  );
}
