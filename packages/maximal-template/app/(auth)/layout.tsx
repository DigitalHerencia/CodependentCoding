/** Layout contracts and composition for the owning application slice. */
import type { ReactNode } from "react";

import { AuthShellFeature } from "@/features/auth/authShellFeature";

export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <AuthShellFeature>{children}</AuthShellFeature>;
}
