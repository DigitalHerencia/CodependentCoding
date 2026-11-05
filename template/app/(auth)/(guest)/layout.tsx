import type { ReactNode } from "react";

import { AuthShell } from "@/components/shells/auth-shell";
import { getIdentity } from "@/lib/auth/auth";
import { redirectAfterAuth } from "@/lib/auth/redirects";

export default async function GuestLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  if (await getIdentity()) redirectAfterAuth();
  return <AuthShell>{children}</AuthShell>;
}
