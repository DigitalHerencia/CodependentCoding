/** Members feature contracts and composition for the owning application slice. */
import { SharedMembersTemplate } from "@/components/templates/shared-templates";
import { InvitationsFeatureClient } from "@/features/invitations/invitationsFeatureClient";
import { InvitationsNewMemberForm } from "@/features/invitations/invitationsNewMemberForm";
import { loadMembersWorkflow } from "@/lib/workflows/authzWorkflows";

export async function MembersFeature() {
  const { members, pending } = await loadMembersWorkflow();
  return (
    <SharedMembersTemplate
      members={members}
      invitations={
        pending.canInvite ? (
          <>
            <InvitationsFeatureClient invitations={pending.invitations} />
            <InvitationsNewMemberForm />
          </>
        ) : null
      }
    />
  );
}
