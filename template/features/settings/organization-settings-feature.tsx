import { PageHero } from "@/components/blocks/page-hero"
import { OrganizationSettingsFormClient } from "@/features/settings/organization-settings-form-client"
import { getOrganizationSettings } from "@/lib/fetchers/organizationFetchers"

export async function OrganizationSettingsFeature() {
  const organization = await getOrganizationSettings()
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="Settings"
        title="Organization"
        description="Manage application-owned tenant identity through an authorized workflow."
      />
      <OrganizationSettingsFormClient name={organization.name} />
      <dl className="grid max-w-xl gap-2 border bg-card p-6 text-sm">
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Slug</dt>
          <dd>{organization.slug}</dd>
        </div>
        <div className="flex justify-between gap-4">
          <dt className="text-muted-foreground">Status</dt>
          <dd>{organization.status}</dd>
        </div>
      </dl>
    </div>
  )
}
