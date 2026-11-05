import type { ReactNode } from "react";

import { PublicShell } from "@/components/shells/public-shell";

export default function PublicLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <PublicShell>{children}</PublicShell>;
}
