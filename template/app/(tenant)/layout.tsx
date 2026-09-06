import type { ReactNode } from "react";

import { TenantShell } from "@/components/shells/tenant-shell";
import { getIdentity } from "@/lib/auth/auth";
import { redirectToSignIn } from "@/lib/auth/redirects";

export default async function TenantLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  const identity = await getIdentity();
  if (!identity) redirectToSignIn();

  return <TenantShell>{children}</TenantShell>;
}
