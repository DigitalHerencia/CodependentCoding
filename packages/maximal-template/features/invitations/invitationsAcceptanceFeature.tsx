/** Invitations Acceptance Feature contracts and composition for the owning application slice. */
import { InvitationsEditAcceptanceForm } from "@/features/invitations/invitationsEditAcceptanceForm";
import { loadInvitationAcceptanceWorkflow } from "@/lib/workflows/authWorkflows";

import type { InvitationAcceptanceRouteProps } from "@/types/invitationTypes";

/** Resolve the invitation acceptance parameters before rendering its form. */
export async function InvitationsAcceptanceFeature({
  params,
}: InvitationAcceptanceRouteProps) {
  const { token } = await loadInvitationAcceptanceWorkflow(params);
  return <InvitationsEditAcceptanceForm token={token} />;
}
