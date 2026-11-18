/** Invitations Acceptance Feature contracts and composition for the owning application slice. */
import { InvitationsEditAcceptanceForm } from "@/features/invitations/invitationsEditAcceptanceForm";
import { loadInvitationAcceptanceWorkflow } from "@/lib/workflows/authWorkflows";

export async function InvitationsAcceptanceFeature({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await loadInvitationAcceptanceWorkflow(params);
  return <InvitationsEditAcceptanceForm token={token} />;
}
