export const supportBlockCopy = {
  searchTickets: "Search tickets",
  searchSubjectNumberOrRequester: "Search subject, number or requester",
  ticketStatus: "Ticket status",
  allOpenStatuses: "All open statuses",
  newTicket: "New ticket",
  searchKnowledgeBase: "Search knowledge base",
  searchArticles: "Search articles",
  writeArticle: "Write article",
} as const;

export const supportPresentationCopy = {
  articleCouldNotBeSavedCheckTheUniqueSlug:
    "Article could not be saved. Check the unique slug, permissions, or reload if the article changed.",
  editArticle: "Edit article",
  writeAKnowledgeArticle: "Write a knowledge article",

  article: "Article",
  articlesAreAvailableToThisWorkspaceSKnowledgeBase:
    "Articles are available to this workspace’s knowledge-base readers.",
  saving: "Saving…",
  saveArticle: "Save article",
  publishArticle: "Publish article",

  ticketCouldNotBeSavedCheckYourInputAnd:
    "Ticket could not be saved. Check your input and permissions.",
  requestSupport: "Request support",

  priority: "Priority",
  createTicket: "Create ticket",
  supportQueueAnalysis: "Support queue analysis",
  currentNonClosedQueueLimitedTo: "Current non-closed queue, limited to ",
  loadedTicketsThisIsAQueueSnapshotNotHistorical:
    " loaded tickets. This is a queue snapshot, not historical response-time reporting.",
  workloadByPriority: "Workload by priority",
  tickets: "Tickets",
  unassigned: "Unassigned",
  waitingOnCustomer: "Waiting on customer",
  supportInbox: "Support inbox",
  openConversationsOrderedByPriorityShowingUpTo100:
    "Open conversations ordered by priority. Showing up to 100 tickets.",
  numberPrefix: "#",
  requester: "Requester",
  separator: "· ",
  messages: " messages",
  responseDue: "Response due:",
  notSet: "Not set",
  noMatchingOpenTickets: "No matching open tickets.",
  knowledgeBase: "Knowledge base",
  updated: "Updated ",
  noMatchingArticles: "No matching articles.",
  conversation: "Conversation",
  noOpeningDescription: "No opening description.",
  triage: "Triage",
  unknown: "Unknown",
  assignee: "Assignee",
  status: "Status",
  resolutionDue: "Resolution due",
} as const;

export const supportControlCopy = {
  replyToConversation: "Reply to conversation",
  saveReply: "Save reply",
  ticketStatus: "Ticket status",
  updateStatus: "Update status",
} as const;

export const supportRemainingCopy = {
  ticketTitle: (value0: unknown, value1: unknown) => `#${value0} · ${value1}`,

  title: "Title",
  slug: "Slug",
  article: "Article",
  subject: "Subject",
  whatHappenedAndWhatDidYouExpect: "What happened, and what did you expect?",
  priority: "Priority",
} as const;
