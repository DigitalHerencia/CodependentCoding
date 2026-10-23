import type { OntologyId, ResolvedModules } from '@hipster-stack/schema';

export interface OntologyRouteConstitution {
  path: string;
  feature: string;
  template: string;
  pureUiBlocks: readonly string[];
  businessLogicWorkflows: readonly string[];
}

export interface OntologyDefinition {
  id: OntologyId;
  label: string;
  description: string;
  primarySurfaces: readonly string[];
  integrations: readonly string[];
  modules: ResolvedModules;
  routes: readonly OntologyRouteConstitution[];
  source: string;
}

const foundation: ResolvedModules = {
  organizations: true,
  invitations: false,
  rbac: true,
  billing: false,
  stripeConnect: false,
  onboarding: false,
  admin: false,
  uploads: false,
  ai: false,
  maps: false,
  marketing: false,
  sampleDomain: false,
  governance: true,
};

function modules(overrides: Partial<ResolvedModules> = {}): ResolvedModules {
  return { ...foundation, ...overrides };
}

const source =
  'context/10-authority/ontologies/10.PROJECTS.CODEPENDENTCODING.Ontologies.Canonical-Catalog.md';

export const ontologyCatalog = {
  'crm-pipeline-tracker': {
    id: 'crm-pipeline-tracker',
    label: 'CRM / Pipeline Tracker',
    description:
      'Leads, contacts, accounts, deals, activities, and pipeline analytics.',
    primarySurfaces: ['pipeline', 'contacts', 'accounts', 'analytics'],
    integrations: ['email', 'optional Stripe'],
    modules: modules(),
    routes: [
      {
        path: '/crm/pipeline',
        feature: 'crm/pipelineFeature',
        template: 'WorkspaceTemplate',
        pureUiBlocks: ['kanban-board'],
        businessLogicWorkflows: [
          'advanceDealStageWorkflow',
          'detectStalledDealWorkflow',
        ],
      },
      {
        path: '/crm/leads',
        feature: 'crm/leadsFeature',
        template: 'DataGridTemplate',
        pureUiBlocks: ['data-table-section'],
        businessLogicWorkflows: [
          'qualifyLeadWorkflow',
          'assignCrmRecordWorkflow',
        ],
      },
      {
        path: '/crm/analytics',
        feature: 'crm/crmAnalyticsFeature',
        template: 'DashboardTemplate',
        pureUiBlocks: ['analytics-dashboard'],
        businessLogicWorkflows: [
          'calculatePipelineValueWorkflow',
          'calculateSalesVelocityWorkflow',
        ],
      },
    ],
    source,
  },
  'project-management-task-tracker': {
    id: 'project-management-task-tracker',
    label: 'Project Management / Task Tracker',
    description:
      'Projects, tasks, dependencies, milestones, timelines, and project health.',
    primarySurfaces: [
      'projects',
      'backlog',
      'task detail',
      'timeline',
      'my tasks',
    ],
    integrations: ['Blob', 'Cloudinary', 'email'],
    modules: modules({ uploads: true, sampleDomain: 'projects' }),
    routes: [
      {
        path: '/projects',
        feature: 'projects/projectsFeature',
        template: 'DataGridTemplate',
        pureUiBlocks: ['data-table-section'],
        businessLogicWorkflows: ['calculateProjectHealthWorkflow'],
      },
      {
        path: '/projects/[projectId]/tasks',
        feature: 'projects/tasksFeature',
        template: 'WorkspaceTemplate',
        pureUiBlocks: ['kanban-board', 'data-table-section'],
        businessLogicWorkflows: [
          'resolveTaskDependenciesWorkflow',
          'advanceTaskStateWorkflow',
        ],
      },
      {
        path: '/projects/[projectId]/timeline',
        feature: 'projects/timelineFeature',
        template: 'CalanderTemplate',
        pureUiBlocks: ['project-timeline'],
        businessLogicWorkflows: ['rescheduleDependentTasksWorkflow'],
      },
    ],
    source,
  },
  'customer-support-ticketing': {
    id: 'customer-support-ticketing',
    label: 'Customer Support / Ticketing',
    description:
      'Ticket intake, assignment, knowledge, escalation, SLA, and support analytics.',
    primarySurfaces: [
      'inbox',
      'ticket workspace',
      'knowledge base',
      'SLA analytics',
    ],
    integrations: ['email', 'Blob', 'Cloudinary'],
    modules: modules({ uploads: true }),
    routes: [
      {
        path: '/support/inbox',
        feature: 'support/inboxFeature',
        template: 'WorkspaceTemplate',
        pureUiBlocks: ['support-inbox'],
        businessLogicWorkflows: [
          'prioritizeTicketWorkflow',
          'assignTicketWorkflow',
          'calculateSlaWorkflow',
        ],
      },
      {
        path: '/support/tickets/[ticketId]',
        feature: 'support/ticketFeature',
        template: 'WorkspaceTemplate',
        pureUiBlocks: ['ticket-workspace'],
        businessLogicWorkflows: [
          'determineEscalationWorkflow',
          'resolveTicketWorkflow',
          'reopenTicketWorkflow',
        ],
      },
      {
        path: '/support/knowledge-base',
        feature: 'support/knowledgeBaseFeature',
        template: 'DocsTemplate',
        pureUiBlocks: ['knowledge-base'],
        businessLogicWorkflows: ['publishKnowledgeArticleWorkflow'],
      },
    ],
    source,
  },
  'marketing-automation-analytics': {
    id: 'marketing-automation-analytics',
    label: 'Marketing Automation & Analytics',
    description:
      'Campaigns, audiences, sequences, attribution, and marketing analytics.',
    primarySurfaces: ['campaigns', 'audiences', 'analytics'],
    integrations: ['email', 'Cloudinary', 'analytics providers'],
    modules: modules({ uploads: true, marketing: true }),
    routes: [
      {
        path: '/marketing/campaigns',
        feature: 'marketing/campaignsFeature',
        template: 'DataGridTemplate',
        pureUiBlocks: ['data-table-section'],
        businessLogicWorkflows: [
          'scheduleCampaignWorkflow',
          'advanceCampaignSequenceWorkflow',
        ],
      },
      {
        path: '/marketing/audiences',
        feature: 'marketing/audiencesFeature',
        template: 'DataGridTemplate',
        pureUiBlocks: ['data-table-section'],
        businessLogicWorkflows: ['evaluateAudienceRulesWorkflow'],
      },
      {
        path: '/marketing/analytics',
        feature: 'marketing/marketingAnalyticsFeature',
        template: 'DashboardTemplate',
        pureUiBlocks: ['analytics-dashboard'],
        businessLogicWorkflows: [
          'calculateAttributionWorkflow',
          'calculateCampaignMetricsWorkflow',
        ],
      },
    ],
    source,
  },
  'invoicing-expense-tracker': {
    id: 'invoicing-expense-tracker',
    label: 'Invoicing & Expense Tracker',
    description:
      'Invoices, expenses, billing state, totals, taxes, and expense rules.',
    primarySurfaces: ['invoices', 'invoice editor', 'expenses', 'billing'],
    integrations: ['Stripe', 'Blob', 'optional OCR'],
    modules: modules({ billing: true, uploads: true }),
    routes: [
      {
        path: '/invoices',
        feature: 'invoicing/invoicesFeature',
        template: 'DataGridTemplate',
        pureUiBlocks: ['data-table-section'],
        businessLogicWorkflows: [
          'calculateInvoiceTotalsWorkflow',
          'advanceInvoiceStatusWorkflow',
        ],
      },
      {
        path: '/expenses',
        feature: 'invoicing/expensesFeature',
        template: 'DataGridTemplate',
        pureUiBlocks: ['data-table-section'],
        businessLogicWorkflows: [
          'classifyExpenseWorkflow',
          'calculateExpenseTotalsWorkflow',
        ],
      },
    ],
    source,
  },
  'social-media-scheduler': {
    id: 'social-media-scheduler',
    label: 'Social Media Scheduler',
    description:
      'Content calendars, composition, media variants, and publishing lifecycle.',
    primarySurfaces: ['calendar', 'composer', 'media'],
    integrations: ['Cloudinary', 'Blob', 'social providers'],
    modules: modules({ uploads: true, marketing: true }),
    routes: [
      {
        path: '/social/calendar',
        feature: 'social/calendarFeature',
        template: 'CalanderTemplate',
        pureUiBlocks: ['content-calendar'],
        businessLogicWorkflows: ['calculatePublishTimeWorkflow'],
      },
      {
        path: '/social/compose',
        feature: 'social/composeFeature',
        template: 'FormTemplate',
        pureUiBlocks: ['content-composer'],
        businessLogicWorkflows: [
          'validateContentVariantsWorkflow',
          'schedulePostWorkflow',
        ],
      },
    ],
    source,
  },
  'ai-powered-wrapper': {
    id: 'ai-powered-wrapper',
    label: 'AI-Powered Wrapper / Micro-SaaS',
    description:
      'Generation, playground, usage, credits, rate limits, and model selection.',
    primarySurfaces: ['generation', 'playground', 'usage'],
    integrations: ['Hugging Face', 'optional model providers', 'Stripe'],
    modules: modules({ ai: true, billing: true }),
    routes: [
      {
        path: '/ai/generation',
        feature: 'ai/generationFeature',
        template: 'WorkspaceTemplate',
        pureUiBlocks: ['generation-workspace'],
        businessLogicWorkflows: [
          'resolveModelSelectionWorkflow',
          'recordUsageWorkflow',
        ],
      },
      {
        path: '/ai/usage',
        feature: 'ai/usageFeature',
        template: 'DashboardTemplate',
        pureUiBlocks: ['analytics-dashboard'],
        businessLogicWorkflows: [
          'calculateUsageWorkflow',
          'enforceRateLimitWorkflow',
        ],
      },
    ],
    source,
  },
  'b2b-client-portal': {
    id: 'b2b-client-portal',
    label: 'B2B Client Portal',
    description:
      'Shared dashboards, documents, billing, approvals, and client project state.',
    primarySurfaces: ['shared dashboard', 'documents', 'billing'],
    integrations: ['Blob', 'Cloudinary', 'Stripe', 'email'],
    modules: modules({
      invitations: true,
      onboarding: true,
      admin: true,
      uploads: true,
      billing: true,
      sampleDomain: 'projects',
    }),
    routes: [
      {
        path: '/portal',
        feature: 'portal/dashboardFeature',
        template: 'DashboardTemplate',
        pureUiBlocks: ['dashboard-layout'],
        businessLogicWorkflows: [
          'resolveClientApprovalWorkflow',
          'calculateProjectStateWorkflow',
        ],
      },
      {
        path: '/portal/documents',
        feature: 'portal/documentsFeature',
        template: 'DocsTemplate',
        pureUiBlocks: ['document-library'],
        businessLogicWorkflows: ['advanceDocumentLifecycleWorkflow'],
      },
    ],
    source,
  },
  'internal-tools-admin-portal': {
    id: 'internal-tools-admin-portal',
    label: 'Internal Tools / Admin Portal',
    description:
      'Operational records, users, audit classification, and safe bulk operations.',
    primarySurfaces: ['records', 'users', 'audit'],
    integrations: ['provider admin surfaces as required'],
    modules: modules({ admin: true }),
    routes: [
      {
        path: '/admin/records',
        feature: 'admin/recordsFeature',
        template: 'DataGridTemplate',
        pureUiBlocks: ['data-table-section'],
        businessLogicWorkflows: [
          'classifyAuditRecordWorkflow',
          'executeBulkOperationWorkflow',
        ],
      },
      {
        path: '/admin/users',
        feature: 'admin/usersFeature',
        template: 'DataGridTemplate',
        pureUiBlocks: ['data-table-section'],
        businessLogicWorkflows: ['reviewUserAccessWorkflow'],
      },
    ],
    source,
  },
} as const satisfies Record<OntologyId, OntologyDefinition>;

export function getOntology(id: OntologyId): OntologyDefinition {
  return ontologyCatalog[id];
}
