import {
  acceptInvitation,
  createInvitation,
  revokeInvitation,
} from "@/lib/actions/invitationActions";

/** Server actions revalidate authority, tenancy, role and input on every call. */
export async function createInvitationWorkflow(input: unknown) {
  return createInvitation(input);
}

export async function revokeInvitationWorkflow(input: unknown) {
  return revokeInvitation(input);
}

export async function acceptInvitationWorkflow(input: unknown) {
  return acceptInvitation(input);
}
