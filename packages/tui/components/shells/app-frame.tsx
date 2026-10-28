// Why: the frame every screen sits in: theme, navigation, the termcn app shell and key hints.
import type { ReactNode } from "react";

import { ThemeProvider } from "@/components/shells/theme-provider";
import { AppShell } from "@/components/ui/app-shell";

export function AppFrame({
  nav,
  children,
}: {
  nav: ReactNode;
  children: ReactNode;
}) {
  return (
    <ThemeProvider>
      <AppShell>
        <AppShell.Header>{nav}</AppShell.Header>
        <AppShell.Content>{children}</AppShell.Content>
        <AppShell.Hints
          items={[" 1-4 screens ", " ↑↓ move ", " enter open ", " q quit "]}
        />
      </AppShell>
    </ThemeProvider>
  );
}
