import Link from "next/link"

import { PageHero } from "@/components/blocks/page-hero"
import { StatGrid } from "@/components/blocks/stat-grid"
import { Button } from "@/components/ui/button"
import { getAdminOverview } from "@/lib/fetchers/adminFetchers"

const adminSections = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/organizations", label: "Organizations" },
  { href: "/admin/billing", label: "Billing" },
  { href: "/admin/webhooks", label: "Webhooks" },
] as const

export async function AdminDashboardFeature() {
  const overview = await getAdminOverview()
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="Application administration"
        title="Operate the application boundary."
        description="This surface uses an application-owned administrator flag, not identity-provider metadata."
      />
      <StatGrid
        stats={[
          { label: "Users", value: String(overview.users) },
          { label: "Tenant access", value: "Explicit" },
          { label: "Webhook attention", value: String(overview.webhooks) },
        ]}
      />
      <nav className="flex flex-wrap gap-2" aria-label="Administration sections">
        {adminSections.map((item) => (
          <Button key={item.href} asChild variant="outline" size="sm">
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
      </nav>
    </div>
  )
}
