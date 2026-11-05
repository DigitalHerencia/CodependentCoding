import { settingsPresentationCopy } from "@/content/settings";
import {
  getOrganizationMembers,
  getPendingInvitations,
} from "@/lib/fetchers/organizationFetchers";
import { SharedMembersTemplate } from "@/components/templates/shared-templates";
import { InvitationsFeatureClient } from "@/features/settings/invitations-feature.client";
import { MemberInviteForm } from "@/features/settings/member-invite-form";

export async function MembersFeature() {
  const [members, pending] = await Promise.all([
    getOrganizationMembers(),
    getPendingInvitations(),
  ]);
  return (
    <div className="space-y-6">
      <SharedMembersTemplate members={members} />
      {pending.canInvite && (
        <section aria-labelledby="invitations-heading" className="space-y-3">
          <h2 className="type-heading" id="invitations-heading">
            {settingsPresentationCopy.pendingInvitations}
          </h2>
          <InvitationsFeatureClient invitations={pending.invitations} />
          <MemberInviteForm />
        </section>
      )}
    </div>
  );
}
