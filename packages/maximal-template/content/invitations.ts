/** Invitation administration and acceptance copy, independently owned from profiles/settings. */
export const invitationContent = {
  title: "Invite someone",
  instructions:
    "They join when they sign in with this email and open the link. The link is shown once.",
  email: "Email",
  role: "Role",
  share: "Share this link:",
  submit: "Create invitation",
  separator: "·",
  noInvitations: "No pending invitations.",
  revokeFailed: "The invitation could not be revoked.",
  expires: "· expires",
  revoke: "Revoke",
  invalid:
    "This invitation is not valid for your account. It may have expired, been revoked, or been sent to a different email.",
  joinTitle: "Join the workspace",
  joinDescription: "You were invited to a workspace. Accept to join it.",
  accept: "Accept invitation",
  loading: "Loading invitation",
} as const;
