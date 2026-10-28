// Why: global terminal composition; every screen renders inside the app frame.
import type { ReactNode } from "react";

import { AppFrame } from "@/components/shells/app-frame";

export function RootLayout({ children }: { children: ReactNode }) {
  return <AppFrame>{children}</AppFrame>;
}
