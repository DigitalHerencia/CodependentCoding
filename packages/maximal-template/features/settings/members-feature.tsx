import { SharedMembersTemplate } from "@/components/templates/shared-templates";
import { InvitationsFeatureClient } from "@/features/invitations/invitations-feature.client";
import { NewMemberInvitationForm } from "@/features/invitations/newMemberInvitationForm";
import { loadMembersWorkflow } from "@/lib/workflows/settingsWorkflows";

export async function MembersFeature() {
  const { members, pending } = await loadMembersWorkflow();
  return (
    <SharedMembersTemplate
      members={members}
      invitations={
        pending.canInvite ? (
          <>
            <InvitationsFeatureClient invitations={pending.invitations} />
            <NewMemberInvitationForm />
          </>
        ) : null
      }
    />
  );
}
