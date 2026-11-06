import { SharedMembersTemplate } from "@/components/templates/shared-templates";
import { MembersFeatureClient } from "@/features/settings/members-feature.client";
import { NewMemberInvitationForm } from "@/features/settings/newMemberInvitationForm";
import { loadMembersWorkflow } from "@/lib/workflows/settingsWorkflows";

export async function MembersFeature() {
  const { members, pending } = await loadMembersWorkflow();
  return (
    <SharedMembersTemplate
      members={members}
      invitations={
        pending.canInvite ? (
          <>
            <MembersFeatureClient invitations={pending.invitations} />
            <NewMemberInvitationForm />
          </>
        ) : null
      }
    />
  );
}
