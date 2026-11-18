"use server";

import { getPendingInvitations } from "@/lib/fetchers/invitationFetchers";

import {
  acceptInvitation,
  createInvitation,
  revokeInvitation,
  editInvitation,
} from "@/lib/actions/invitationActions";

/** Server actions revalidate authority, tenancy, role and input on every call. */
export async function createInvitationWorkflow(input: unknown) {
  return createInvitation(input);
}

/** Cancel a pending invitation through the authenticated mutation boundary. */
export async function revokeInvitationWorkflow(input: unknown) {
  return revokeInvitation(input);
}

/** Accept a token only after checking the authenticated recipient identity. */
export async function acceptInvitationWorkflow(input: unknown) {
  return acceptInvitation(input);
}

/** Only the current organization's authorized administrators receive invitation data. */
export async function loadInvitationsWorkflow() {
  return getPendingInvitations();
}

/** Update a pending invitation after fresh server-side authorization. */
export async function editInvitationWorkflow(input: unknown) {
  return editInvitation(input);
}
