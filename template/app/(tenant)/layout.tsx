import type { ReactNode } from "react";

import { TenantShell } from "@/components/shells/tenant-shell";

/** Template recipe surfaces are public so the superset can be inspected without auth. */
export default function TenantLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return <TenantShell>{children}</TenantShell>;
}
