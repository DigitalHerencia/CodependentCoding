import Link from "next/link"

import { PageHero } from "@/components/blocks/page-hero"
import { ProcessPanel } from "@/components/blocks/process-panel"
import { StatGrid } from "@/components/blocks/stat-grid"
import { Button } from "@/components/ui/button"
import { loadedVibesCapabilities } from "@/content/loadedvibes"
import { site } from "@/content/site"

export default function HomePage() {
  return (
    <div className="grid gap-10">
      <PageHero eyebrow="Generic SaaS starter" title={site.name} description={site.description} />
      <div className="flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/sign-up">Start the app</Link>
        </Button>
        {loadedVibesCapabilities.marketing ? (
          <Button asChild variant="outline">
            <Link href="/pricing">View pricing</Link>
          </Button>
        ) : null}
      </div>
      <StatGrid
        stats={[
          { label: "Runtime", value: "RSC" },
          { label: "Writes", value: "Actions" },
          { label: "Authz", value: "Rows" },
        ]}
      />
      <ProcessPanel
        title="How the stack works"
        steps={[
          {
            title: "Identify",
            description: "Clerk owns identity and session lifecycle without organizations.",
          },
          {
            title: "Authorize",
            description: "Local Prisma rows decide whether a user can read or write a resource.",
          },
          {
            title: "Persist",
            description:
              "Server Actions validate inputs and transactions write deterministic state.",
          },
        ]}
      />
    </div>
  )
}
