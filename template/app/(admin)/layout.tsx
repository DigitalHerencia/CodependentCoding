import type { ReactNode } from "react"
import { notFound } from "next/navigation"
import { TenantShell } from "@/components/shells/tenant-shell"
import { loadedVibesCapabilities } from "@/content/loadedvibes"

export default function AdminLayout({ children }: { children: ReactNode }) {
  if (!loadedVibesCapabilities.admin) notFound()
  return <TenantShell>{children}</TenantShell>
}
