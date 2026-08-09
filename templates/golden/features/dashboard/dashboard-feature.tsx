import { PageHero } from "@/components/blocks/page-hero"
import { StatGrid } from "@/components/blocks/stat-grid"

export function DashboardFeature() {
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="Tenant dashboard"
        title="Your product starts here."
        description="A protected server-rendered surface ready for your product workflows."
      />
      <StatGrid
        stats={[
          { label: "Identity", value: "Clerk" },
          { label: "Authorization", value: "Local" },
          { label: "Tenancy", value: "Rows" },
        ]}
      />
    </div>
  )
}
