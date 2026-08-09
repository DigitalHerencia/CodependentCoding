import { PageHero } from "@/components/blocks/page-hero"
import { InvitationFormClient } from "@/features/members/invitation-form-client"

export function InvitationFeature() {
  return (
    <div className="grid gap-8">
      <PageHero
        eyebrow="Team"
        title="Invite a teammate."
        description="Application roles and capabilities remain local even though Clerk owns identity."
      />
      <InvitationFormClient />
    </div>
  )
}
