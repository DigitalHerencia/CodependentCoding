/** Auth Shell Feature contracts and composition for the owning application slice. */
import type { ReactNode } from "react";
import { AuthShellTemplate } from "@/components/templates/auth-shell-template";

export function AuthShellFeature({ children }: { children: ReactNode }) {
  return <AuthShellTemplate>{children}</AuthShellTemplate>;
}
