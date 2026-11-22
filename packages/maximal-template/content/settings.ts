/** Copy for the existing settings projections and their loading states. */
export const settingsCopy = {
  members: "Workspace directory",
  integrations: "Integration configuration",
  billing: "Billing",
  pendingInvitations: "Pending invitations",
  member: "Member",
  role: "Role",
  access: "Access",
  emptyDirectory: "No members are visible on this page.",
  directoryPages: "Directory pages",
  previous: "Previous",
  next: "Next",
  page: (page: number) => `Page ${page}`,
  installed: "Installed",
  configurationPresent: "Required configuration present",
  configurationMissing: "Required configuration missing",
  configurationNotice:
    "Configuration presence is inspected without contacting providers. Connectivity and operational status have not been tested.",
  noIntegrations: "No provider integrations are installed.",
  billingConfigurationMissing: "Billing provider configuration is missing.",
  billingConfigurationPresent:
    "Billing provider configuration is present. Provider availability has not been tested.",
  billingProviderUnavailable:
    "The billing provider integration is unavailable.",
  loadingMembers: "Loading workspace directory",
  loadingIntegrations: "Loading integration configuration",
  loadingBilling: "Loading billing",
} as const;
