export const marketingBlockCopy = {
  searchAudiences: "Search audiences",
  defineAudience: "Define audience",
  searchCampaigns: "Search campaigns",
  searchCampaignOrAudience: "Search campaign or audience",
  planCampaign: "Plan campaign",
} as const;

export const marketingPresentationCopy = {
  audienceCouldNotBeSavedCheckPermissionsOrReload:
    "Audience could not be saved. Check permissions or reload if it changed.",
  editAudience: "Edit audience",
  defineAnAudience: "Define an audience",

  includeContactsMatching: "Include contacts matching",

  audienceStatus: "Audience status",

  thisAudienceUsesRulesThisEditorDoesNotSupport:
    "This audience uses rules this editor does not support. Its definition has been preserved.",
  saving: "Saving…",
  saveAudience: "Save audience",

  campaignCouldNotBeSavedCheckAccessAudienceOr:
    "Campaign could not be saved. Check access, audience, or reload the current campaign. Only draft, scheduled or paused campaigns can be edited.",
  editCampaign: "Edit campaign",
  planACampaign: "Plan a campaign",

  campaignBrief: "Campaign brief",

  saveCampaign: "Save campaign",
  campaignOperations: "Campaign operations",
  lifecycleSnapshotOf: "Lifecycle snapshot of ",
  loadedCampaignsDeliveryAndEngagementRatesRequireRecordedProvider:
    " loaded campaigns. Delivery and engagement rates require recorded provider events.",
  campaign: "Campaign",
  audience: "Audience",
  lifecycle: "Lifecycle",
  scheduled: "Scheduled",
  steps: "Steps",
  editSegment: "Edit segment",
  membershipRule: "Membership rule",
  thisAudienceHasCustomRulesThatTheCurrentEditor:
    "This audience has custom rules that the current editor cannot modify.",
  audienceStatus2: "Audience status: ",
  audienceSegments: "Audience segments",
  contactRelationship: "Contact relationship:",
  customRules: "Custom rules",
  noMatchingAudiences: "No matching audiences.",
  editPlan: "Edit plan",
  noBriefRecorded: "No brief recorded.",
  targetAndSchedule: "Target and schedule",
  status: "Status: ",
  scheduled2: "Scheduled: ",
  notScheduled: "Not scheduled",
  started: "Started: ",
  notStarted: "Not started",
  completed: "Completed: ",
  notCompleted: "Not completed",
  workflow: "Workflow",
  sentenceSeparator: ". ",
  template: "Template: ",
  noWorkflowStepsAreConfigured: "No workflow steps are configured.",
  campaignPlanner: "Campaign planner",
  noCampaignBrief: "No campaign brief.",
  audience2: "Audience: ",
  notSelected: "Not selected",
  planned: "Planned:",
  unscheduled: "Unscheduled",
  workflowSteps: " workflow steps",
  noCampaignsInThisPhase: "No campaigns in this phase.",
} as const;

export const marketingControlCopy = {
  campaignLifecycle: "Campaign lifecycle",
  saveLifecycle: "Save lifecycle",
  thisUpdatesCampaignPlanningStateItDoesNot:
    "This updates campaign planning state. It does not send messages or publish content.",
} as const;

export const marketingRemainingCopy = {
  relationshipRule: (value0: unknown) =>
    `Include contacts whose relationship is ${value0}.`,
  nameAndStatus: (value0: unknown, value1: unknown) => `${value0} · ${value1}`,

  audienceName: "Audience name",
  contactRelationshipEquals: "Contact relationship equals",
  active: "Active",
  lead: "Lead",
  inactive: "Inactive",
  audienceStatus: "Audience status",
  dRAFT: "DRAFT",
  aCTIVE: "ACTIVE",
  aRCHIVED: "ARCHIVED",
  campaignName: "Campaign name",
  campaignBrief: "Campaign brief",
  targetAudience: "Target audience",
  noAudienceSelected: "No audience selected",
  plannedStartUTC: "Planned start (UTC)",
} as const;
