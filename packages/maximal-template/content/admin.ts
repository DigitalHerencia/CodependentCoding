/** Admin presentation copy is consumed only in domain blocks. */
import type { AdminNavigationLinksProps } from "@/types/adminTypes";
export const adminCopy = {
  searchAuditEvents: "Search audit events",
  searchActionResourceOrActor: "Search action, resource or actor",
  addRegisteredMember: "Add registered member",
  searchMembers: "Search members",
  searchNameOrEmail: "Search name or email",
  applicationRole: "Application role",
  roleUpdated: "Role updated.",
  saveRole: "Save role",
  accessUpdated: "Membership access updated.",
  restore: "Restore access",
  suspend: "Suspend access",
  approveWorkspaceAccess: "Approve workspace access",
  approvalDescription:
    "Assign a role in this workspace. The user can claim access from their waiting page using this verified email.",
  approvalComplete: "Access approved. The user can check their access now.",
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
  memberAdministration: "Member administration",
  email: "Email",
  accessStatus: "Access status",
  joinedHeading: "Joined",
  unnamedUser: "Unnamed user",
  search: "Search",
  pagination: "Administration pages",
  previous: "Previous",
  next: "Next",
  page: "Page",
  registeredEmail: "Registered email",
  noMembers: "No matching members.",
  noRecords: "No registered record resources.",
  edit: "Edit access",
  owner: "Ownership cannot be changed through routine administration.",
  self: "You cannot change your own membership through administration.",
  footer: "Workspace administration",
  metrics: {
    events: "Events on this page",
    actors: "Identified actors on this page",
    members: "Members on this page",
    active: "Active members on this page",
    resources: "Registered resources",
    records: "Persisted workspace records",
  },
  descriptions: {
    audit:
      "Review activity in the active workspace. Counts reflect the current result page.",
    records: "Inspect the persisted inventory of the active workspace.",
    record: "Read the organization-scoped count for this registered resource.",
    users:
      "Manage workspace membership. Counts reflect the current result page.",
    user: "Review this workspace member and their access.",
    new: "Approve workspace access for a verified email address.",
    edit: "Update another member’s role or access in this workspace.",
  },
} as const;
/** Route heading vocabulary is resolved only in blocks. */
export const adminPageCopy = {
  audit: adminCopy.auditTrail,
  records: adminCopy.workspaceRecordInventory,
  record: "Resource inventory",
  users: adminCopy.memberAdministration,
  user: adminCopy.member,
  new: adminCopy.approveWorkspaceAccess,
  edit: "Edit workspace access",
} as const;
/** Page-specific loading announcements share one skeleton composition. */
export const adminLoadingCopy = {
  layout: "Loading administration",
  audit: "Loading audit events",
  records: "Loading records",
  record: "Loading resource inventory",
  users: "Loading members",
  user: "Loading member",
  new: "Loading access form",
  edit: "Loading membership form",
} as const;

/** Admin navigation destinations and shell copy consumed only by blocks. */

/** Administration destinations remain protected by the server-side admin gate. */
export const adminNavigationItems = [
  { href: "/admin/users", label: "Users" },
  { href: "/admin/records", label: "Records" },
  { href: "/admin/audit", label: "Audit" },
  { href: "/dashboard", label: "Workspace" },
] as const satisfies AdminNavigationLinksProps["items"];

/** Shell accessibility and recovery labels have one content owner. */
export const adminNavigationCopy = {
  navigation: "Admin navigation",
  skipToContent: "Skip to admin content",
  loadingContent: "Loading admin content",
  errorTitle: "Something went wrong",
  errorDescription:
    "Administration could not be loaded. Try again or return to admin.",
  tryAgain: "Try again",
  returnToAdmin: "Return to admin",
} as const;
