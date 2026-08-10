import { PageHero } from "@/components/blocks/page-hero"
import { InvitationFormClient } from "@/features/members/invitation-form-client"
import { MemberRoleFormClient } from "@/features/members/member-role-form-client"
import { getTeamMembers } from "@/lib/fetchers/organizationFetchers"

export async function TeamFeature() {
  const members = await getTeamMembers()
  return (
    <div className="grid gap-10">
      <PageHero
        eyebrow="Team"
        title="Members and invitations"
        description="Membership roles are application-owned and protected by tenant-aware transition policy."
      />
      <section className="grid gap-4">
        <h2 className="text-2xl font-semibold">Current members</h2>
        {members.map((member) => (
          <article key={member.id} className="grid gap-4 border bg-card p-5 md:grid-cols-2">
            <div>
              <p className="font-medium">
                {member.displayName}
                {member.isCurrentUser ? " (you)" : ""}
              </p>
              <p className="text-sm text-muted-foreground">{member.email ?? "No email"}</p>
            </div>
            <MemberRoleFormClient membershipId={member.id} role={member.role} />
          </article>
        ))}
      </section>
      <section className="grid gap-4 border-t pt-8">
        <h2 className="text-2xl font-semibold">Invite a teammate</h2>
        <InvitationFormClient />
      </section>
    </div>
  )
}
