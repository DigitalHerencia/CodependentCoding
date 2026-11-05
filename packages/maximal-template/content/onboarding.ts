export const onboardingPresentationCopy = {
  thisInvitationIsNotValidForYourAccountIt:
    "This invitation is not valid for your account. It may have expired, been revoked, or been sent to a different email.",
  joinTheWorkspace: "Join the workspace",
  youWereInvitedToAWorkspaceAcceptToJoin:
    "You were invited to a workspace. Accept to join it.",
  acceptInvitation: "Accept invitation",
  completeYourProfile: "Complete your profile",

  saveProfile: "Save profile",

  checkAccess: "Check access",
  preparingYourAccount: "Preparing your account",
  waitingForApproval: "Waiting for approval",
  refreshThisPageInAMomentToContinue:
    "Refresh this page in a moment to continue.",
  yourProfileIsCompleteAWorkspaceAdministratorMustGrant:
    "Your profile is complete. A workspace administrator must grant you access. Check your access after the administrator approves it.",
} as const;

export const onboardingStepCopy = {
  steps: "Profile completion",
  profile: "Profile",
  review: "Review",
  continue: "Review profile",
  back: "Edit profile",
  reviewTitle: "Review your profile",
  noApproval: "No approval is available for your verified primary email yet.",
} as const;

export const onboardingLibraryCopy = {
  step: "Step ",
  of: " of ",
  complete: "% complete",
  progressSteps: "Progress steps",
  back: "Back",
  skip: "Skip",
  complete2: "Complete",
  continue: "Continue",
  welcomeToTheApp: "Welcome to the app",
  developer: "Developer",
  designer: "Designer",
  productManager: "Product Manager",
  marketing: "Marketing",
  other: "Other",
  webDevelopment: "Web Development",
  mobileApps: "Mobile Apps",
  aIMachineLearning: "AI & Machine Learning",
  uIUXDesign: "UI/UX Design",
  dataScience: "Data Science",
  devOps: "DevOps",
  setUpYourProfile: "Set Up Your Profile",
  tellUsABitAboutYourself: "Tell us a bit about yourself",
  avatarPreview: "Avatar preview",
  yourName: "Your Name",
  whatShouldWeCallYou: "What should we call you?",
  yourRole: "Your Role",
  yourInterests: "Your Interests",
  selectAllThatApply: "(Select all that apply)",
  createYourWorkspace: "Create Your Workspace",
  setUpYourTeamWorkspaceAndInviteMembers:
    "Set up your team workspace and invite members",
  createWorkspace: "Create Workspace",
  workspaceName: "Workspace Name",
  eGAcmeInc: "e.g., Acme Inc.",
  inviteTeamMembers: "Invite Team Members",
  optional: "(Optional)",
  colleagueEmailCom: "colleague@email.com",
  add: "Add",
  pendingInvites: "Pending Invites (",
  separator: ")",
  separator2: "×",
  skipForNow: "Skip for Now",
  saving: "Saving…",
  whatAreYourGoals: "What are your goals?",
  selectUpTo: "Select up to ",
  goalsToPersonalizeYourExperience: " goals to personalize your experience",
  continueWith: "Continue with ",
  goal: " goal",
  s: "s",
  youReAllSet: "You're all set!",
} as const;

export const onboardingRemainingCopy = {
  step: (value0: unknown, value1: unknown, value2: unknown) =>
    `Step ${value0} of ${value1}: ${value2}`,

  displayName: "Display name",
} as const;
