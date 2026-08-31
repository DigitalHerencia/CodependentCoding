export const ontologies = [
  {
    id: 'crm-pipeline-tracker',
    label: 'CRM / Pipeline Tracker',
    description:
      'Leads, contacts, accounts, deals, activities, and pipeline analytics.',
    surfaces: ['pipeline', 'contacts', 'accounts', 'analytics'],
    integrations: ['email', 'optional Stripe'],
    workflows: [
      'advanceDealStageWorkflow',
      'calculatePipelineValueWorkflow',
      'qualifyLeadWorkflow',
    ],
  },
  {
    id: 'project-management-task-tracker',
    label: 'Project Management / Task Tracker',
    description:
      'Projects, tasks, milestones, dependencies, and delivery health.',
    surfaces: ['projects', 'backlog', 'task detail', 'timeline', 'my tasks'],
    integrations: ['Blob', 'Cloudinary', 'email'],
    workflows: [
      'advanceTaskStateWorkflow',
      'calculateProjectHealthWorkflow',
      'resolveTaskDependenciesWorkflow',
    ],
  },
  {
    id: 'customer-support-ticketing',
    label: 'Customer Support / Ticketing',
    description:
      'Support intake, prioritization, assignment, SLA, and resolution.',
    surfaces: ['inbox', 'ticket workspace', 'knowledge base', 'SLA analytics'],
    integrations: ['email', 'Blob', 'Cloudinary'],
    workflows: [
      'createTicketFromIntakeWorkflow',
      'calculateSlaWorkflow',
      'resolveTicketWorkflow',
    ],
  },
  {
    id: 'marketing-automation-analytics',
    label: 'Marketing Automation & Analytics',
    description: 'Campaigns, audiences, triggers, attribution, and analytics.',
    surfaces: ['campaigns', 'audiences', 'analytics'],
    integrations: ['email', 'Cloudinary', 'analytics providers'],
    workflows: [
      'evaluateAudienceRulesWorkflow',
      'scheduleCampaignWorkflow',
      'calculateAttributionWorkflow',
    ],
  },
  {
    id: 'invoicing-expense-tracker',
    label: 'Invoicing & Expense Tracker',
    description:
      'Invoices, expenses, approvals, totals, and payment-state reconciliation.',
    surfaces: ['invoices', 'invoice editor', 'expenses', 'billing'],
    integrations: ['Stripe', 'Blob', 'optional OCR'],
    workflows: [
      'calculateInvoiceTotalsWorkflow',
      'determineInvoiceStatusWorkflow',
      'reconcilePaymentStateWorkflow',
    ],
  },
  {
    id: 'social-media-scheduler',
    label: 'Social Media Scheduler',
    description:
      'Composition, media, approval, scheduling, publishing, and reconciliation.',
    surfaces: ['calendar', 'composer', 'media'],
    integrations: ['Cloudinary', 'Blob', 'social providers'],
    workflows: [
      'buildPlatformVariantWorkflow',
      'schedulePostWorkflow',
      'reconcilePublishStateWorkflow',
    ],
  },
  {
    id: 'ai-powered-wrapper',
    label: 'AI-Powered Wrapper / Micro-SaaS',
    description: 'Model access, generation, usage, credits, and rate limits.',
    surfaces: ['generation', 'playground', 'usage'],
    integrations: ['Hugging Face', 'optional model providers', 'Stripe'],
    workflows: [
      'authorizeModelAccessWorkflow',
      'executeGenerationWorkflow',
      'calculateUsageWorkflow',
    ],
  },
  {
    id: 'b2b-client-portal',
    label: 'B2B Client Portal',
    description:
      'Shared delivery status, documents, approvals, access, and billing.',
    surfaces: ['shared dashboard', 'documents', 'billing'],
    integrations: ['Blob', 'Cloudinary', 'Stripe', 'email'],
    workflows: [
      'grantClientAccessWorkflow',
      'shareDocumentWorkflow',
      'approveDeliverableWorkflow',
    ],
  },
  {
    id: 'internal-tools-admin-portal',
    label: 'Internal Tools / Admin Portal',
    description:
      'Records, users, audit, bulk operations, and administrative policy.',
    surfaces: ['records', 'users', 'audit'],
    integrations: ['provider admin surfaces as required'],
    workflows: [
      'suspendUserWorkflow',
      'executeBulkOperationWorkflow',
      'classifyAuditEventWorkflow',
    ],
  },
] as const;

export type Ontology = (typeof ontologies)[number];

export const pureUiSimples = [
  ['auth-forms', 'Auth Forms'],
  ['cta-section', 'CTA'],
  ['error-pages', 'Error States'],
  ['faq-section', 'FAQ'],
  ['feature-grid', 'Feature Grid'],
  ['hero-section', 'Hero'],
  ['invoice', 'Invoice'],
  ['onboarding-flow', 'Onboarding'],
  ['settings-page', 'Settings'],
  ['stats-section', 'Stats'],
] as const;

const workflowGroups = {
  CRM: [
    'advance-deal-stage',
    'calculate-pipeline-value',
    'qualify-lead',
    'close-deal',
  ],
  Projects: [
    'advance-task-state',
    'assign-task',
    'calculate-project-health',
    'resolve-task-dependencies',
  ],
  Support: [
    'create-ticket-from-intake',
    'prioritize-ticket',
    'calculate-sla',
    'resolve-ticket',
  ],
  Marketing: [
    'evaluate-audience-rules',
    'schedule-campaign',
    'calculate-attribution',
    'apply-drip-timing',
  ],
  Invoicing: [
    'calculate-invoice-totals',
    'determine-invoice-status',
    'reconcile-payment-state',
    'enforce-expense-policy',
  ],
  Social: [
    'build-platform-variant',
    'approve-post',
    'schedule-post',
    'reconcile-publish-state',
  ],
  AI: [
    'authorize-model-access',
    'select-model',
    'execute-generation',
    'enforce-rate-limit',
  ],
  'Client Portal': [
    'grant-client-access',
    'share-document',
    'request-approval',
    'approve-deliverable',
  ],
  'Internal Tools': [
    'suspend-user',
    'change-membership',
    'execute-bulk-operation',
    'classify-audit-event',
  ],
} as const;

const titleCase = (value: string) =>
  value.replaceAll('-', ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());

export const workflowSimples = Object.entries(workflowGroups).flatMap(
  ([domain, workflows]) =>
    workflows.map((slug) => ({ domain, slug, label: titleCase(slug) })),
);

export function getOntology(id: string) {
  return ontologies.find((ontology) => ontology.id === id);
}

export function getPureUiSimple(slug: string) {
  const item = pureUiSimples.find(([id]) => id === slug);
  return item ? { slug: item[0], label: item[1] } : undefined;
}

export function getWorkflowSimple(slug: string) {
  return workflowSimples.find((workflow) => workflow.slug === slug);
}
