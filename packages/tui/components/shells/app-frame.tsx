// Why: the frame every screen sits in: theme, the termcn app shell and key hints.
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/shells/theme-provider";
import { AppShell } from "@/components/ui/app-shell";

export function AppFrame({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AppShell>
        <AppShell.Content>{children}</AppShell.Content>
        <AppShell.Hints items={[" ctrl+c quit "]} />
      </AppShell>
    </ThemeProvider>
  );
}
