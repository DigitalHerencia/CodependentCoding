---
title: The Simples™ — Canonical Catalog
type: architecture-catalog
scope: domain-library
project: Codependent Coding
domain: simples
artifact: catalog-index
namespace: codependentcoding.simples.catalog
status: active
authority: canonical-index
parent: codependentcoding.simples.authoritative
created: 2026-08-22
updated: 2026-08-22
---

# The Simples™ — Canonical Catalog

This catalog indexes the current supported Simples under the canonical equation:

```text
SIMPLES™
=
PureUI Blocks™
+
BusinessLogic Blocks™
```

The catalog also records the lower-level constituents that constitute each family, but those constituents are not themselves top-level Simples.

Where the canonical ontology inventory marks an artifact **`[STUB — BUILD]`**, that implementation status remains authoritative.

---

# 1. Catalog Taxonomy

```text
Simples™
├── PureUI Blocks™
│   ├── Component Blocks
│   ├── UI Primitive constitutions
│   ├── Variants
│   └── Semantic Design Tokens
│
└── BusinessLogic Blocks™
    ├── Domain Workflows
    └── Workflow constituent inventories
        ├── Server Operations
        ├── Integrations
        ├── Data Transport
        ├── Helpers
        ├── Types
        ├── Interfaces
        └── Schemas
```


# 2. PureUI Blocks™ — File-Backed Domain Block Inventory

The following Component Block paths are explicitly present in the canonical normalized Ontology inventory.

- `components/blocks/activity-timeline.tsx`
- `components/blocks/admin-record-inspector.tsx`
- `components/blocks/admin-user-table.tsx`
- `components/blocks/ai-chat-workspace.tsx`
- `components/blocks/ai-playground.tsx`
- `components/blocks/analytics-dashboard.tsx`
- `components/blocks/approval-panel.tsx`
- `components/blocks/audience-rule-builder.tsx`
- `components/blocks/audit-log.tsx`
- `components/blocks/bulk-actions.tsx`
- `components/blocks/campaign-workflow.tsx`
- `components/blocks/dashboard-layout.tsx`
- `components/blocks/data-table-section.tsx`
- `components/blocks/expense-upload.tsx`
- `components/blocks/file-vault.tsx`
- `components/blocks/invoice.tsx`
- `components/blocks/kanban-board.tsx`
- `components/blocks/knowledge-base.tsx`
- `components/blocks/media-library.tsx`
- `components/blocks/pipeline-stage-editor.tsx`
- `components/blocks/post-composer.tsx`
- `components/blocks/project-timeline.tsx`
- `components/blocks/record-detail-section.tsx`
- `components/blocks/settings-page.tsx`
- `components/blocks/social-calendar.tsx`
- `components/blocks/support-inbox.tsx`
- `components/blocks/ticket-workspace.tsx`
- `components/blocks/usage-dashboard.tsx`

# 3. UI Primitive Constituents — File-Backed Inventory

These UI Primitive paths are explicitly referenced by Block → Primitive constitutions. They are constituents of PureUI Blocks, not top-level Simples.

- `components/ui/accordion.tsx`
- `components/ui/alert-dialog.tsx`
- `components/ui/alert.tsx`
- `components/ui/aspect-ratio.tsx`
- `components/ui/avatar.tsx`
- `components/ui/badge.tsx`
- `components/ui/breadcrumb.tsx`
- `components/ui/button-group.tsx`
- `components/ui/button.tsx`
- `components/ui/calendar.tsx`
- `components/ui/card.tsx`
- `components/ui/chart-toolbar.tsx`
- `components/ui/chart.tsx`
- `components/ui/checkbox.tsx`
- `components/ui/combobox.tsx`
- `components/ui/data-table.tsx`
- `components/ui/date-picker.tsx`
- `components/ui/date-range-picker.tsx`
- `components/ui/dialog.tsx`
- `components/ui/donut-chart.tsx`
- `components/ui/drawer.tsx`
- `components/ui/dropdown-menu.tsx`
- `components/ui/dropzone.tsx`
- `components/ui/gauge-chart.tsx`
- `components/ui/input.tsx`
- `components/ui/kbd.tsx`
- `components/ui/motion.tsx`
- `components/ui/pagination.tsx`
- `components/ui/popover.tsx`
- `components/ui/progress.tsx`
- `components/ui/radar-chart.tsx`
- `components/ui/radial-bar-chart.tsx`
- `components/ui/resizable.tsx`
- `components/ui/scroll-area.tsx`
- `components/ui/select.tsx`
- `components/ui/separator.tsx`
- `components/ui/skeleton.tsx`
- `components/ui/slider.tsx`
- `components/ui/sparkline.tsx`
- `components/ui/spinner.tsx`
- `components/ui/stat-card.tsx`
- `components/ui/table.tsx`
- `components/ui/tabs.tsx`
- `components/ui/textarea.tsx`
- `components/ui/time-picker.tsx`
- `components/ui/timeline.tsx`

# 4. Semantic Design Token Inventory

The following token names are explicitly listed in the current source material.

- `breakpoint-lg`
- `breakpoint-md`
- `breakpoint-sm`
- `breakpoint-xl`
- `color-accent`
- `color-accent-foreground`
- `color-background`
- `color-border`
- `color-card`
- `color-card-foreground`
- `color-chart-1`
- `color-chart-2`
- `color-chart-3`
- `color-chart-4`
- `color-chart-5`
- `color-clash-1`
- `color-clash-2`
- `color-clash-3`
- `color-clash-4`
- `color-destructive`
- `color-destructive-foreground`
- `color-foreground`
- `color-info`
- `color-info-foreground`
- `color-input`
- `color-muted`
- `color-muted-foreground`
- `color-neon-blue`
- `color-neon-green`
- `color-neon-orange`
- `color-neon-pink`
- `color-neon-purple`
- `color-popover`
- `color-popover-foreground`
- `color-primary`
- `color-primary-foreground`
- `color-ring`
- `color-secondary`
- `color-secondary-foreground`
- `color-success`
- `color-success-foreground`
- `color-warning`
- `color-warning-foreground`
- `radius-lg`
- `radius-md`
- `radius-sm`
- `radius-xl`
- `var-active`
- `var-border`
- `var-focused`
- `var-hover`
- `var-rounded`

# 5. BusinessLogic Blocks™ — Canonical Workflow Inventory

The current canonical normalized library contains **74 BusinessLogic Blocks™ / Domain Workflows**.

- `lib/workflows/admin/changeMembershipWorkflow.ts`
- `lib/workflows/admin/classifyAuditEventWorkflow.ts`
- `lib/workflows/admin/executeBulkOperationWorkflow.ts`
- `lib/workflows/admin/performAdministrativeOverrideWorkflow.ts`
- `lib/workflows/admin/reconcileAdministrativeProviderStateWorkflow.ts`
- `lib/workflows/admin/restoreUserWorkflow.ts`
- `lib/workflows/admin/suspendUserWorkflow.ts`
- `lib/workflows/ai/authorizeModelAccessWorkflow.ts`
- `lib/workflows/ai/calculateCreditsWorkflow.ts`
- `lib/workflows/ai/calculateUsageWorkflow.ts`
- `lib/workflows/ai/enforceRateLimitWorkflow.ts`
- `lib/workflows/ai/executeGenerationWorkflow.ts`
- `lib/workflows/ai/reconcileUsageBillingWorkflow.ts`
- `lib/workflows/ai/recordGenerationUsageWorkflow.ts`
- `lib/workflows/ai/selectModelWorkflow.ts`
- `lib/workflows/crm/advanceDealStageWorkflow.ts`
- `lib/workflows/crm/assignCrmRecordWorkflow.ts`
- `lib/workflows/crm/calculatePipelineValueWorkflow.ts`
- `lib/workflows/crm/calculateSalesVelocityWorkflow.ts`
- `lib/workflows/crm/closeDealWorkflow.ts`
- `lib/workflows/crm/detectStalledDealWorkflow.ts`
- `lib/workflows/crm/qualifyLeadWorkflow.ts`
- `lib/workflows/crm/recordSalesActivityWorkflow.ts`
- `lib/workflows/crm/reopenOpportunityWorkflow.ts`
- `lib/workflows/invoicing/applyCurrencyCalculationsWorkflow.ts`
- `lib/workflows/invoicing/approveExpenseWorkflow.ts`
- `lib/workflows/invoicing/approveInvoiceWorkflow.ts`
- `lib/workflows/invoicing/calculateInvoiceTotalsWorkflow.ts`
- `lib/workflows/invoicing/calculateTaxesWorkflow.ts`
- `lib/workflows/invoicing/determineInvoiceStatusWorkflow.ts`
- `lib/workflows/invoicing/enforceExpensePolicyWorkflow.ts`
- `lib/workflows/invoicing/finalizeInvoiceWorkflow.ts`
- `lib/workflows/invoicing/reconcilePaymentStateWorkflow.ts`
- `lib/workflows/invoicing/submitExpenseWorkflow.ts`
- `lib/workflows/marketing/advanceCampaignSequenceWorkflow.ts`
- `lib/workflows/marketing/applyDripTimingWorkflow.ts`
- `lib/workflows/marketing/calculateAttributionWorkflow.ts`
- `lib/workflows/marketing/calculateCampaignMetricsWorkflow.ts`
- `lib/workflows/marketing/evaluateAudienceRulesWorkflow.ts`
- `lib/workflows/marketing/evaluateCampaignTriggerWorkflow.ts`
- `lib/workflows/marketing/processCampaignEventWorkflow.ts`
- `lib/workflows/marketing/scheduleCampaignWorkflow.ts`
- `lib/workflows/portal/approveDeliverableWorkflow.ts`
- `lib/workflows/portal/calculateClientProjectStatusWorkflow.ts`
- `lib/workflows/portal/grantClientAccessWorkflow.ts`
- `lib/workflows/portal/publishDocumentVersionWorkflow.ts`
- `lib/workflows/portal/rejectDeliverableWorkflow.ts`
- `lib/workflows/portal/requestApprovalWorkflow.ts`
- `lib/workflows/portal/settleClientInvoiceWorkflow.ts`
- `lib/workflows/portal/shareDocumentWorkflow.ts`
- `lib/workflows/projects/advanceTaskStateWorkflow.ts`
- `lib/workflows/projects/assignTaskWorkflow.ts`
- `lib/workflows/projects/calculateMilestoneProgressWorkflow.ts`
- `lib/workflows/projects/calculateProjectHealthWorkflow.ts`
- `lib/workflows/projects/completeMilestoneWorkflow.ts`
- `lib/workflows/projects/completeProjectWorkflow.ts`
- `lib/workflows/projects/rescheduleDependentTasksWorkflow.ts`
- `lib/workflows/projects/resolveTaskDependenciesWorkflow.ts`
- `lib/workflows/social/approvePostWorkflow.ts`
- `lib/workflows/social/associateMediaWorkflow.ts`
- `lib/workflows/social/buildPlatformVariantWorkflow.ts`
- `lib/workflows/social/publishPostWorkflow.ts`
- `lib/workflows/social/reconcilePublishStateWorkflow.ts`
- `lib/workflows/social/resolvePublishTimeWorkflow.ts`
- `lib/workflows/social/retryFailedPublicationWorkflow.ts`
- `lib/workflows/social/schedulePostWorkflow.ts`
- `lib/workflows/support/assignTicketWorkflow.ts`
- `lib/workflows/support/calculateSlaWorkflow.ts`
- `lib/workflows/support/createTicketFromIntakeWorkflow.ts`
- `lib/workflows/support/determineEscalationWorkflow.ts`
- `lib/workflows/support/prioritizeTicketWorkflow.ts`
- `lib/workflows/support/publishKnowledgeArticleWorkflow.ts`
- `lib/workflows/support/reopenTicketWorkflow.ts`
- `lib/workflows/support/resolveTicketWorkflow.ts`

# 6. BusinessLogic Constituent Inventory

The following architecture-owned files are explicitly listed in the canonical BusinessLogic specification as domain constituent inventory. They are not top-level Simples. The exact subset used by any one Workflow requires an explicit Workflow constitution and MUST NOT be inferred from filenames.

- `lib/actions/adminActions.ts`
- `lib/actions/aiActions.ts`
- `lib/actions/crm/createAccount.ts`
- `lib/actions/crm/createActivity.ts`
- `lib/actions/crm/createContact.ts`
- `lib/actions/crm/createDeal.ts`
- `lib/actions/crm/createLead.ts`
- `lib/actions/crm/createNote.ts`
- `lib/actions/crm/createPipeline.ts`
- `lib/actions/crm/createPipelineStage.ts`
- `lib/actions/crm/deleteAccount.ts`
- `lib/actions/crm/deleteActivity.ts`
- `lib/actions/crm/deleteContact.ts`
- `lib/actions/crm/deleteDeal.ts`
- `lib/actions/crm/deleteLead.ts`
- `lib/actions/crm/deleteNote.ts`
- `lib/actions/crm/deletePipeline.ts`
- `lib/actions/crm/deletePipelineStage.ts`
- `lib/actions/crm/updateAccount.ts`
- `lib/actions/crm/updateActivity.ts`
- `lib/actions/crm/updateContact.ts`
- `lib/actions/crm/updateDeal.ts`
- `lib/actions/crm/updateLead.ts`
- `lib/actions/crm/updateNote.ts`
- `lib/actions/crm/updatePipeline.ts`
- `lib/actions/crm/updatePipelineStage.ts`
- `lib/actions/invoicingActions.ts`
- `lib/actions/marketingActions.ts`
- `lib/actions/portalActions.ts`
- `lib/actions/projectsActions.ts`
- `lib/actions/socialActions.ts`
- `lib/actions/supportActions.ts`
- `lib/authz/adminPermissions.ts`
- `lib/authz/adminPolicies.ts`
- `lib/authz/aiPermissions.ts`
- `lib/authz/aiPolicies.ts`
- `lib/authz/crmPermissions.ts`
- `lib/authz/crmPolicies.ts`
- `lib/authz/crmResources.ts`
- `lib/authz/invoicingPermissions.ts`
- `lib/authz/invoicingPolicies.ts`
- `lib/authz/marketingPermissions.ts`
- `lib/authz/marketingPolicies.ts`
- `lib/authz/portalPermissions.ts`
- `lib/authz/portalPolicies.ts`
- `lib/authz/projectsPermissions.ts`
- `lib/authz/projectsPolicies.ts`
- `lib/authz/socialPermissions.ts`
- `lib/authz/socialPolicies.ts`
- `lib/authz/supportPermissions.ts`
- `lib/authz/supportPolicies.ts`
- `lib/cache/adminCache.ts`
- `lib/cache/aiCache.ts`
- `lib/cache/crmCache.ts`
- `lib/cache/invoicingCache.ts`
- `lib/cache/marketingCache.ts`
- `lib/cache/portalCache.ts`
- `lib/cache/projectsCache.ts`
- `lib/cache/socialCache.ts`
- `lib/cache/supportCache.ts`
- `lib/constants/adminConstants.ts`
- `lib/constants/aiConstants.ts`
- `lib/constants/crmConstants.ts`
- `lib/constants/invoicingConstants.ts`
- `lib/constants/marketingConstants.ts`
- `lib/constants/portalConstants.ts`
- `lib/constants/projectsConstants.ts`
- `lib/constants/socialConstants.ts`
- `lib/constants/supportConstants.ts`
- `lib/db/dto/accountDto.ts`
- `lib/db/dto/activityDto.ts`
- `lib/db/dto/adminDto.ts`
- `lib/db/dto/aiDto.ts`
- `lib/db/dto/contactDto.ts`
- `lib/db/dto/crmAnalyticsDto.ts`
- `lib/db/dto/dealDto.ts`
- `lib/db/dto/invoicingDto.ts`
- `lib/db/dto/leadDto.ts`
- `lib/db/dto/marketingDto.ts`
- `lib/db/dto/pipelineDto.ts`
- `lib/db/dto/portalDto.ts`
- `lib/db/dto/projectsDto.ts`
- `lib/db/dto/socialDto.ts`
- `lib/db/dto/supportDto.ts`
- `lib/db/selects/accountSelect.ts`
- `lib/db/selects/activitySelect.ts`
- `lib/db/selects/adminSelects.ts`
- `lib/db/selects/aiSelects.ts`
- `lib/db/selects/contactSelect.ts`
- `lib/db/selects/dealSelect.ts`
- `lib/db/selects/invoicingSelects.ts`
- `lib/db/selects/leadSelect.ts`
- `lib/db/selects/marketingSelects.ts`
- `lib/db/selects/pipelineSelect.ts`
- `lib/db/selects/portalSelects.ts`
- `lib/db/selects/projectsSelects.ts`
- `lib/db/selects/socialSelects.ts`
- `lib/db/selects/supportSelects.ts`
- `lib/db/transactions/adminTransactions.ts`
- `lib/db/transactions/advanceDealStageTransaction.ts`
- `lib/db/transactions/aiTransactions.ts`
- `lib/db/transactions/closeDealTransaction.ts`
- `lib/db/transactions/invoicingTransactions.ts`
- `lib/db/transactions/marketingTransactions.ts`
- `lib/db/transactions/portalTransactions.ts`
- `lib/db/transactions/projectsTransactions.ts`
- `lib/db/transactions/recordSalesActivityTransaction.ts`
- `lib/db/transactions/socialTransactions.ts`
- `lib/db/transactions/supportTransactions.ts`
- `lib/fetchers/adminFetchers.ts`
- `lib/fetchers/aiFetchers.ts`
- `lib/fetchers/crm/getAccountById.ts`
- `lib/fetchers/crm/getAccounts.ts`
- `lib/fetchers/crm/getActivities.ts`
- `lib/fetchers/crm/getActivityById.ts`
- `lib/fetchers/crm/getContactById.ts`
- `lib/fetchers/crm/getContacts.ts`
- `lib/fetchers/crm/getCrmAnalytics.ts`
- `lib/fetchers/crm/getDealById.ts`
- `lib/fetchers/crm/getDeals.ts`
- `lib/fetchers/crm/getLeadById.ts`
- `lib/fetchers/crm/getLeads.ts`
- `lib/fetchers/crm/getNotesByRecord.ts`
- `lib/fetchers/crm/getPipelineById.ts`
- `lib/fetchers/crm/getPipelineMetrics.ts`
- `lib/fetchers/crm/getPipelines.ts`
- `lib/fetchers/crm/getPipelineStages.ts`
- `lib/fetchers/invoicingFetchers.ts`
- `lib/fetchers/marketingFetchers.ts`
- `lib/fetchers/portalFetchers.ts`
- `lib/fetchers/projectsFetchers.ts`
- `lib/fetchers/socialFetchers.ts`
- `lib/fetchers/supportFetchers.ts`
- `lib/integrations/cloudinary/client.ts`
- `lib/integrations/cloudinary/transformations.ts`
- `lib/integrations/cloudinary/upload.ts`
- `lib/integrations/hugging-face/client.ts`
- `lib/integrations/hugging-face/embeddings.ts`
- `lib/integrations/hugging-face/inference.ts`
- `lib/integrations/sendgrid/client.ts`
- `lib/integrations/sendgrid/email.ts`
- `lib/integrations/stripe/checkout.ts`
- `lib/integrations/stripe/client.ts`
- `lib/integrations/stripe/portal.ts`
- `lib/integrations/stripe/subscriptions.ts`
- `lib/integrations/stripe/webhooks.ts`
- `lib/integrations/vercel-blob/client.ts`
- `lib/integrations/vercel-blob/delete.ts`
- `lib/integrations/vercel-blob/upload.ts`
- `lib/utils/adminParams.ts`
- `lib/utils/aiParams.ts`
- `lib/utils/crmParams.ts`
- `lib/utils/invoicingParams.ts`
- `lib/utils/marketingParams.ts`
- `lib/utils/portalParams.ts`
- `lib/utils/projectsParams.ts`
- `lib/utils/socialParams.ts`
- `lib/utils/supportParams.ts`
- `schemas/adminSchemas.ts`
- `schemas/aiSchemas.ts`
- `schemas/crmSchemas.ts`
- `schemas/invoicingSchemas.ts`
- `schemas/marketingSchemas.ts`
- `schemas/portalSchemas.ts`
- `schemas/projectsSchemas.ts`
- `schemas/socialSchemas.ts`
- `schemas/supportSchemas.ts`
- `types/adminInterfaces.ts`
- `types/adminTypes.ts`
- `types/aiInterfaces.ts`
- `types/aiTypes.ts`
- `types/crmInterfaces.ts`
- `types/crmTypes.ts`
- `types/invoicingInterfaces.ts`
- `types/invoicingTypes.ts`
- `types/marketingInterfaces.ts`
- `types/marketingTypes.ts`
- `types/portalInterfaces.ts`
- `types/portalTypes.ts`
- `types/projectsInterfaces.ts`
- `types/projectsTypes.ts`
- `types/socialInterfaces.ts`
- `types/socialTypes.ts`
- `types/supportInterfaces.ts`
- `types/supportTypes.ts`

# 7. Canonical Counts

- PureUI Component Block file paths indexed from the normalized Ontology inventory: **28**
- UI Primitive file paths referenced by Block constitutions: **46**
- Semantic Design Token names explicitly listed: **52**
- BusinessLogic Blocks™ / Domain Workflows: **74**
- Architecture-owned BusinessLogic constituent files indexed: **185**

# 8. Status Semantics


The surrounding normalized Ontology inventory remains the authority for implementation status.

Use these states when presenting the catalog:

```text
IMPLEMENTED
STUB — BUILD
SHARED / REUSED
OPTIONAL
REQUIRED
DERIVED
```

A catalog entry does not become implemented merely because it is normalized.

Generator support and repository implementation remain the truth test.
