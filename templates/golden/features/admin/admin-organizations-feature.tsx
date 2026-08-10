import { PageHero } from "@/components/blocks/page-hero"
import { getAdminOrganizations } from "@/lib/fetchers/adminFetchers"

export async function AdminOrganizationsFeature() {
  const organizations = await getAdminOrganizations()
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="Application administration"
        title="Organizations"
        description="Tenant status and bounded usage counts without crossing organization mutation boundaries."
      />
      <div className="grid gap-3">
        {organizations.map((organization) => (
          <article key={organization.id} className="grid gap-1 border bg-card p-4 md:grid-cols-3">
            <div>
              <p className="font-medium">{organization.name}</p>
              <p className="text-sm text-muted-foreground">{organization.slug}</p>
            </div>
            <p className="text-sm">{organization.memberCount} members</p>
            <p className="text-sm">
              {organization.projectCount} projects · {organization.status}
            </p>
          </article>
        ))}
        {organizations.length === 0 ? (
          <p className="text-muted-foreground">No organizations recorded.</p>
        ) : null}
      </div>
    </div>
  )
}
