export const adminBlockCopy = {
  searchAuditEvents: "Search audit events",
  searchActionResourceOrActor: "Search action, resource or actor",
  addRegisteredMember: "Add registered member",
  searchMembers: "Search members",
  searchNameEmailOrRole: "Search name, email or role",
} as const;

export const adminSessionCopy = {
  title: "Verify administrator access",
  enrollment:
    "Enable two-factor authentication in your account before entering administration.",
  verification:
    "Verify both factors to continue. Administrator access expires after ten minutes; sensitive changes require verification within five minutes.",
  account: "Manage account security",
  verify: "Verify and continue",
  cancelled: "Verification was not completed. Try again when ready.",
} as const;

export const adminMembershipCopy = {
  role: "Application role",
  roleUpdated: "Role updated.",
  saveRole: "Save role",
  accessUpdated: "Membership access updated.",
  restore: "Restore access",
  suspend: "Suspend access",
} as const;

export const adminPresentationCopy = {
  approveWorkspaceAccess: "Approve workspace access",
  assignARoleInThisWorkspaceTheUserCan:
    "Assign a role in this workspace. The user can claim access from their waiting page using this verified email.",

  applicationRole: "Application role",
  accessApprovedTheUserCanCheckTheirAccessNow:
    "Access approved. The user can check their access now.",
  approveAccess: "Approve access",
  auditTrail: "Audit trail",
  system: "System",
  separator: " · ",
  resource: "Resource: ",
  emptyValue: "—",
  noMatchingAuditEvents: "No matching audit events.",
  tenantInventory: "Tenant inventory",
  persistedRecordsInTheActiveWorkspace:
    "Persisted records in the active workspace.",
  workspaceRecordInventory: "Workspace record inventory",
  inspectResource: "Inspect resource",
  member: "Member",
  identity: "Identity",
  joined: "Joined ",
  access: "Access: ",
  accessManagement: "Access management",
  memberAdministration: "Member administration",
  email: "Email",
  accessStatus: "Access status",
  joined2: "Joined",
  unnamedUser: "Unnamed user",
} as const;

export const adminPaginationCopy = {
  search: "Search",
  pagination: "Administration pages",
  previous: "Previous",
  next: "Next",
  page: "Page",
} as const;

export const adminRemainingCopy = {
  registeredEmail: "Registered email",
  applicationRole: "Application role",
} as const;
