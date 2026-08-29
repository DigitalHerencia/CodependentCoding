import { notFound } from "next/navigation"
import type { ReactNode } from "react"

import { TenantShell } from "@/components/shells/tenant-shell"
import { loadedVibesCapabilities } from "@/content/loadedvibes"

export default function BillingLayout({ children }: { children: ReactNode }) {
  if (!loadedVibesCapabilities.billing) notFound()
  return <TenantShell>{children}</TenantShell>
}
