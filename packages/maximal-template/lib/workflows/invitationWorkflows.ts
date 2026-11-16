import "server-only";
import { getPendingInvitations } from "@/lib/fetchers/invitationFetchers";

/** Only the current organization's authorized administrators receive invitation data. */
export async function loadInvitationsWorkflow() {
  return getPendingInvitations();
}
