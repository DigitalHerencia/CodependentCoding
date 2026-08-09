import { PageHero } from "@/components/blocks/page-hero"
import { StatGrid } from "@/components/blocks/stat-grid"
import { getAdminOverview } from "@/lib/fetchers/adminFetchers"

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
    </div>
  )
}
