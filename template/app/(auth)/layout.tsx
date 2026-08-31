import type { ReactNode } from "react";
import { AuthShell } from "@/components/shells/auth-shell";

// Auth routes share a frame; Clerk behavior remains under lib/auth.
export default function AuthLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <AuthShell>{children}</AuthShell>;
}
