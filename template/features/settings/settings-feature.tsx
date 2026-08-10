import { UserProfile } from "@clerk/nextjs"
import Link from "next/link"

import { PageHero } from "@/components/blocks/page-hero"
import { Button } from "@/components/ui/button"
import { loadedVibesCapabilities } from "@/content/loadedvibes"

const settingsLinks = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/organization", label: "Organization" },
  { href: "/settings/members", label: "Members" },
  { href: "/settings/integrations", label: "Integrations" },
  ...(loadedVibesCapabilities.billing ? [{ href: "/settings/billing", label: "Billing" }] : []),
  { href: "/settings/developer", label: "Developer" },
] as const

export function SettingsFeature() {
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="Settings"
        title="Clerk owns account controls."
        description="Account management stays with the auth provider. App authorization remains local and row-backed."
      />
      <nav className="flex flex-wrap gap-2" aria-label="Settings sections">
        {settingsLinks.map((item) => (
          <Button key={item.href} asChild variant="outline" size="sm">
            <Link href={item.href}>{item.label}</Link>
          </Button>
        ))}
      </nav>
      <UserProfile routing="path" path="/settings" />
    </div>
  )
}
