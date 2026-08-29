---
title: The Ontology™ Normalized Defaults — Canonical Catalog
type: architecture-catalog
scope: application-definition
project: Codependent Coding
domain: ontologies
artifact: canonical-file-inventory
namespace: codependentcoding.ontologies.catalog
status: active
authority: canonical-index
parent: codependentcoding.ontologies.authoritative
created: 2026-08-22
updated: 2026-08-22
---

# The Ontology™ Normalized Defaults — Canonical Catalog

This catalog preserves the current canonical normalized file inventory for all nine Ontologies.

It is intentionally implementation-specific and records:

```text
Route
→ Feature
→ Page Template
→ PureUI Block(s)
→ BusinessLogic Block(s) / Workflow(s)
→ UI Primitive constitutions
→ server-operation/helper inventories
→ integrations
→ Semantic Design Token files
```

Where the source marks an artifact **`[STUB — BUILD]`**, that status remains authoritative.

The authoritative Simples definition used by this catalog is:

```text
Simples™
=
PureUI Blocks™
+
BusinessLogic Blocks™
```

Routes, Features, Templates, UI Primitives, Actions, Fetchers, schemas, types, and integrations shown below are relationships or constituents, not additional Simple families.

---

# Canonical Ontology File Inventory

## 1. CRM / Pipeline Tracker Ontology™

### Routes → Features → Templates → Blocks / Workflows

| Route                                  | Feature                                    | Page Template                                | Blocks                                                                                                                         | Workflows                                                                                                                                                 |
| -------------------------------------- | ------------------------------------------ | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/crm/pipeline`                        | `features/crm/pipelineFeature.tsx`         | `components/templates/WorkspaceTemplate.tsx` | `components/blocks/kanban-board.tsx` **[STUB — BUILD]**                                                                        | `lib/workflows/crm/advanceDealStageWorkflow.ts`, `detectStalledDealWorkflow.ts`, `calculatePipelineValueWorkflow.ts`, `calculateSalesVelocityWorkflow.ts` |
| `/crm/leads`                           | `features/crm/leadsFeature.tsx`            | `components/templates/DataGridTemplate.tsx`  | `components/blocks/data-table-section.tsx` **[STUB — BUILD]**                                                                  | `qualifyLeadWorkflow.ts`, `assignCrmRecordWorkflow.ts`                                                                                                    |
| `/crm/leads/new`                       | `features/crm/newLeadForm.tsx`             | `components/templates/FormTemplate.tsx`      | —                                                                                                                              | `qualifyLeadWorkflow.ts`                                                                                                                                  |
| `/crm/leads/[leadId]`                  | `features/crm/leadDetailFeature.tsx`       | `components/templates/ProfileTemplate.tsx`   | `components/blocks/record-detail-section.tsx` **[STUB — BUILD]**, `components/blocks/activity-timeline.tsx` **[STUB — BUILD]** | `qualifyLeadWorkflow.ts`, `recordSalesActivityWorkflow.ts`                                                                                                |
| `/crm/leads/[leadId]/edit`             | `features/crm/editLeadForm.tsx`            | `components/templates/FormTemplate.tsx`      | —                                                                                                                              | `qualifyLeadWorkflow.ts`                                                                                                                                  |
| `/crm/contacts`                        | `features/crm/contactsFeature.tsx`         | `components/templates/DataGridTemplate.tsx`  | `components/blocks/data-table-section.tsx` **[STUB — BUILD]**                                                                  | `assignCrmRecordWorkflow.ts`                                                                                                                              |
| `/crm/contacts/new`                    | `features/crm/newContactForm.tsx`          | `components/templates/FormTemplate.tsx`      | —                                                                                                                              | —                                                                                                                                                         |
| `/crm/contacts/[contactId]`            | `features/crm/contactDetailFeature.tsx`    | `components/templates/ProfileTemplate.tsx`   | `components/blocks/record-detail-section.tsx` **[STUB — BUILD]**, `components/blocks/activity-timeline.tsx` **[STUB — BUILD]** | `recordSalesActivityWorkflow.ts`                                                                                                                          |
| `/crm/contacts/[contactId]/edit`       | `features/crm/editContactForm.tsx`         | `components/templates/FormTemplate.tsx`      | —                                                                                                                              | —                                                                                                                                                         |
| `/crm/accounts`                        | `features/crm/accountsFeature.tsx`         | `components/templates/DataGridTemplate.tsx`  | `components/blocks/data-table-section.tsx` **[STUB — BUILD]**                                                                  | `assignCrmRecordWorkflow.ts`                                                                                                                              |
| `/crm/accounts/new`                    | `features/crm/newAccountForm.tsx`          | `components/templates/FormTemplate.tsx`      | —                                                                                                                              | —                                                                                                                                                         |
| `/crm/accounts/[accountId]`            | `features/crm/accountDetailFeature.tsx`    | `components/templates/ProfileTemplate.tsx`   | `components/blocks/record-detail-section.tsx` **[STUB — BUILD]**, `components/blocks/activity-timeline.tsx` **[STUB — BUILD]** | `calculatePipelineValueWorkflow.ts`, `recordSalesActivityWorkflow.ts`                                                                                     |
| `/crm/accounts/[accountId]/edit`       | `features/crm/editAccountForm.tsx`         | `components/templates/FormTemplate.tsx`      | —                                                                                                                              | —                                                                                                                                                         |
| `/crm/deals`                           | `features/crm/dealsFeature.tsx`            | `components/templates/DataGridTemplate.tsx`  | `components/blocks/data-table-section.tsx` **[STUB — BUILD]**                                                                  | `advanceDealStageWorkflow.ts`, `detectStalledDealWorkflow.ts`                                                                                             |
| `/crm/deals/new`                       | `features/crm/newDealForm.tsx`             | `components/templates/FormTemplate.tsx`      | —                                                                                                                              | `calculatePipelineValueWorkflow.ts`                                                                                                                       |
| `/crm/deals/[dealId]`                  | `features/crm/dealDetailFeature.tsx`       | `components/templates/WorkspaceTemplate.tsx` | `components/blocks/record-detail-section.tsx` **[STUB — BUILD]**, `components/blocks/activity-timeline.tsx` **[STUB — BUILD]** | `advanceDealStageWorkflow.ts`, `closeDealWorkflow.ts`, `reopenOpportunityWorkflow.ts`                                                                     |
| `/crm/deals/[dealId]/edit`             | `features/crm/editDealForm.tsx`            | `components/templates/FormTemplate.tsx`      | —                                                                                                                              | `calculatePipelineValueWorkflow.ts`                                                                                                                       |
| `/crm/activities`                      | `features/crm/activitiesFeature.tsx`       | `components/templates/CalanderTemplate.tsx`  | `components/blocks/activity-timeline.tsx` **[STUB — BUILD]**                                                                   | `recordSalesActivityWorkflow.ts`                                                                                                                          |
| `/crm/analytics`                       | `features/crm/crmAnalyticsFeature.tsx`     | `components/templates/DashboardTemplate.tsx` | `components/blocks/dashboard-layout.tsx`, `components/blocks/analytics-dashboard.tsx` **[STUB — BUILD]**                       | `calculatePipelineValueWorkflow.ts`, `calculateSalesVelocityWorkflow.ts`                                                                                  |
| `/crm/settings`                        | `features/crm/crmSettingsFeature.tsx`      | `components/templates/SettingsTemplate.tsx`  | `components/blocks/settings-page.tsx`                                                                                          | —                                                                                                                                                         |
| `/crm/settings/pipelines`              | `features/crm/pipelineSettingsFeature.tsx` | `components/templates/DataGridTemplate.tsx`  | `components/blocks/data-table-section.tsx` **[STUB — BUILD]**                                                                  | —                                                                                                                                                         |
| `/crm/settings/pipelines/[pipelineId]` | `features/crm/pipelineEditorFeature.tsx`   | `components/templates/FormTemplate.tsx`      | `components/blocks/pipeline-stage-editor.tsx` **[STUB — BUILD]**                                                               | `advanceDealStageWorkflow.ts`                                                                                                                             |

### CRM Block → UI Primitive Files

#### `components/blocks/kanban-board.tsx` **[STUB — BUILD]**

- `components/ui/card.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/button.tsx`
    
- `components/ui/dropdown-menu.tsx`
    
- `components/ui/dialog.tsx`
    
- `components/ui/scroll-area.tsx`
    
- `components/ui/motion.tsx`
    
- `components/ui/skeleton.tsx`
    

#### `components/blocks/data-table-section.tsx` **[STUB — BUILD]**

- `components/ui/data-table.tsx`
    
- `components/ui/input.tsx`
    
- `components/ui/select.tsx`
    
- `components/ui/checkbox.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/pagination.tsx`
    
- `components/ui/dropdown-menu.tsx`
    
- `components/ui/button.tsx`
    
- `components/ui/skeleton.tsx`
    

#### `components/blocks/record-detail-section.tsx` **[STUB — BUILD]**

- `components/ui/card.tsx`
    
- `components/ui/tabs.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/avatar.tsx`
    
- `components/ui/separator.tsx`
    
- `components/ui/dropdown-menu.tsx`
    
- `components/ui/button.tsx`
    
- `components/ui/skeleton.tsx`
    

#### `components/blocks/activity-timeline.tsx` **[STUB — BUILD]**

- `components/ui/timeline.tsx`
    
- `components/ui/avatar.tsx`
    
- `components/ui/card.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/scroll-area.tsx`
    
- `components/ui/skeleton.tsx`
    

#### `components/blocks/analytics-dashboard.tsx` **[STUB — BUILD]**

- `components/ui/stat-card.tsx`
    
- `components/ui/chart.tsx`
    
- `components/ui/chart-toolbar.tsx`
    
- `components/ui/donut-chart.tsx`
    
- `components/ui/radar-chart.tsx`
    
- `components/ui/radial-bar-chart.tsx`
    
- `components/ui/gauge-chart.tsx`
    
- `components/ui/sparkline.tsx`
    
- `components/ui/date-range-picker.tsx`
    
- `components/ui/card.tsx`
    
- `components/ui/tabs.tsx`
    
- `components/ui/skeleton.tsx`
    

#### `components/blocks/pipeline-stage-editor.tsx` **[STUB — BUILD]**

- `components/ui/card.tsx`
    
- `components/ui/input.tsx`
    
- `components/ui/select.tsx`
    
- `components/ui/button.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/dropdown-menu.tsx`
    
- `components/ui/dialog.tsx`
    
- `components/ui/motion.tsx`
    

#### Existing

- `components/blocks/dashboard-layout.tsx`
    
- `components/blocks/settings-page.tsx`
    

### CRM Workflows

```text
lib/workflows/crm/advanceDealStageWorkflow.ts
lib/workflows/crm/detectStalledDealWorkflow.ts
lib/workflows/crm/calculatePipelineValueWorkflow.ts
lib/workflows/crm/calculateSalesVelocityWorkflow.ts
lib/workflows/crm/qualifyLeadWorkflow.ts
lib/workflows/crm/assignCrmRecordWorkflow.ts
lib/workflows/crm/recordSalesActivityWorkflow.ts
lib/workflows/crm/closeDealWorkflow.ts
lib/workflows/crm/reopenOpportunityWorkflow.ts
```

### CRM Actions

```text
lib/actions/crm/createLead.ts
lib/actions/crm/updateLead.ts
lib/actions/crm/deleteLead.ts

lib/actions/crm/createContact.ts
lib/actions/crm/updateContact.ts
lib/actions/crm/deleteContact.ts

lib/actions/crm/createAccount.ts
lib/actions/crm/updateAccount.ts
lib/actions/crm/deleteAccount.ts

lib/actions/crm/createDeal.ts
lib/actions/crm/updateDeal.ts
lib/actions/crm/deleteDeal.ts

lib/actions/crm/createActivity.ts
lib/actions/crm/updateActivity.ts
lib/actions/crm/deleteActivity.ts

lib/actions/crm/createNote.ts
lib/actions/crm/updateNote.ts
lib/actions/crm/deleteNote.ts

lib/actions/crm/createPipeline.ts
lib/actions/crm/updatePipeline.ts
lib/actions/crm/deletePipeline.ts

lib/actions/crm/createPipelineStage.ts
lib/actions/crm/updatePipelineStage.ts
lib/actions/crm/deletePipelineStage.ts
```

### CRM Fetchers

```text
lib/fetchers/crm/getLeads.ts
lib/fetchers/crm/getLeadById.ts

lib/fetchers/crm/getContacts.ts
lib/fetchers/crm/getContactById.ts

lib/fetchers/crm/getAccounts.ts
lib/fetchers/crm/getAccountById.ts

lib/fetchers/crm/getDeals.ts
lib/fetchers/crm/getDealById.ts

lib/fetchers/crm/getPipelines.ts
lib/fetchers/crm/getPipelineById.ts
lib/fetchers/crm/getPipelineStages.ts

lib/fetchers/crm/getActivities.ts
lib/fetchers/crm/getActivityById.ts
lib/fetchers/crm/getNotesByRecord.ts

lib/fetchers/crm/getPipelineMetrics.ts
lib/fetchers/crm/getCrmAnalytics.ts
```

### CRM Authz

```text
lib/authz/crmPermissions.ts
lib/authz/crmPolicies.ts
lib/authz/crmResources.ts
```

### CRM Prisma Selects

```text
lib/db/selects/leadSelect.ts
lib/db/selects/contactSelect.ts
lib/db/selects/accountSelect.ts
lib/db/selects/dealSelect.ts
lib/db/selects/pipelineSelect.ts
lib/db/selects/activitySelect.ts
```

### CRM DTO Mappers

```text
lib/db/dto/leadDto.ts
lib/db/dto/contactDto.ts
lib/db/dto/accountDto.ts
lib/db/dto/dealDto.ts
lib/db/dto/pipelineDto.ts
lib/db/dto/activityDto.ts
lib/db/dto/crmAnalyticsDto.ts
```

### CRM Transactions

```text
lib/db/transactions/advanceDealStageTransaction.ts
lib/db/transactions/closeDealTransaction.ts
lib/db/transactions/recordSalesActivityTransaction.ts
```

### CRM Helpers

```text
lib/cache/crmCache.ts
lib/constants/crmConstants.ts
lib/utils/crmParams.ts
schemas/crmSchemas.ts
types/crmTypes.ts
types/crmInterfaces.ts
```

### CRM Optional Provider Files

```text
lib/integrations/sendgrid/client.ts
lib/integrations/sendgrid/email.ts

lib/integrations/stripe/client.ts
lib/integrations/stripe/checkout.ts
lib/integrations/stripe/portal.ts
lib/integrations/stripe/subscriptions.ts
lib/integrations/stripe/webhooks.ts
```

### CRM Semantic Design Token Files

```text
app/globals.css
components/ui/palettes.ts
```

---

# 2. Project Management / Task Tracker Ontology™

### Routes → Features → Templates → Blocks / Workflows

| Route                                       | Feature                                      | Page Template                                | Blocks                                                                                                                         | Workflows                                                                    |
| ------------------------------------------- | -------------------------------------------- | -------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------ | ---------------------------------------------------------------------------- |
| `/projects`                                 | `features/projects/projectsFeature.tsx`      | `components/templates/DataGridTemplate.tsx`  | `components/blocks/data-table-section.tsx` **[STUB — BUILD]**                                                                  | `calculateProjectHealthWorkflow.ts`                                          |
| `/projects/new`                             | `features/projects/newProjectForm.tsx`       | `components/templates/FormTemplate.tsx`      | —                                                                                                                              | —                                                                            |
| `/projects/[projectId]`                     | `features/projects/projectDetailFeature.tsx` | `components/templates/ProjectTemplate.tsx`   | `components/blocks/dashboard-layout.tsx`, `components/blocks/record-detail-section.tsx` **[STUB — BUILD]**                     | `calculateProjectHealthWorkflow.ts`, `calculateMilestoneProgressWorkflow.ts` |
| `/projects/[projectId]/edit`                | `features/projects/editProjectForm.tsx`      | `components/templates/FormTemplate.tsx`      | —                                                                                                                              | —                                                                            |
| `/projects/[projectId]/tasks`               | `features/projects/tasksFeature.tsx`         | `components/templates/WorkspaceTemplate.tsx` | `components/blocks/kanban-board.tsx` **[STUB — BUILD]**, `components/blocks/data-table-section.tsx` **[STUB — BUILD]**         | `resolveTaskDependenciesWorkflow.ts`, `advanceTaskStateWorkflow.ts`          |
| `/projects/[projectId]/tasks/new`           | `features/projects/newTaskForm.tsx`          | `components/templates/FormTemplate.tsx`      | —                                                                                                                              | `assignTaskWorkflow.ts`                                                      |
| `/projects/[projectId]/tasks/[taskId]`      | `features/projects/taskDetailFeature.tsx`    | `components/templates/ProjectTemplate.tsx`   | `components/blocks/record-detail-section.tsx` **[STUB — BUILD]**, `components/blocks/activity-timeline.tsx` **[STUB — BUILD]** | `resolveTaskDependenciesWorkflow.ts`                                         |
| `/projects/[projectId]/tasks/[taskId]/edit` | `features/projects/editTaskForm.tsx`         | `components/templates/FormTemplate.tsx`      | —                                                                                                                              | `rescheduleDependentTasksWorkflow.ts`                                        |
| `/projects/[projectId]/milestones`          | `features/projects/milestonesFeature.tsx`    | `components/templates/DataGridTemplate.tsx`  | `components/blocks/data-table-section.tsx` **[STUB — BUILD]**                                                                  | `calculateMilestoneProgressWorkflow.ts`, `completeMilestoneWorkflow.ts`      |
| `/projects/[projectId]/timeline`            | `features/projects/timelineFeature.tsx`      | `components/templates/CalanderTemplate.tsx`  | `components/blocks/project-timeline.tsx` **[STUB — BUILD]**                                                                    | `resolveTaskDependenciesWorkflow.ts`, `rescheduleDependentTasksWorkflow.ts`  |
| `/my-tasks`                                 | `features/projects/myTasksFeature.tsx`       | `components/templates/DataGridTemplate.tsx`  | `components/blocks/data-table-section.tsx` **[STUB — BUILD]**                                                                  | `advanceTaskStateWorkflow.ts`                                                |

### Project Blocks → UI Primitives

#### `components/blocks/project-timeline.tsx` **[STUB — BUILD]**

- `components/ui/timeline.tsx`
    
- `components/ui/calendar.tsx`
    
- `components/ui/date-picker.tsx`
    
- `components/ui/card.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/progress.tsx`
    
- `components/ui/scroll-area.tsx`
    
- `components/ui/motion.tsx`
    

#### Reused

```text
components/blocks/dashboard-layout.tsx
components/blocks/data-table-section.tsx
components/blocks/record-detail-section.tsx
components/blocks/kanban-board.tsx
components/blocks/activity-timeline.tsx
```

### Project Workflows

```text
lib/workflows/projects/calculateProjectHealthWorkflow.ts
lib/workflows/projects/resolveTaskDependenciesWorkflow.ts
lib/workflows/projects/calculateMilestoneProgressWorkflow.ts
lib/workflows/projects/rescheduleDependentTasksWorkflow.ts
lib/workflows/projects/assignTaskWorkflow.ts
lib/workflows/projects/advanceTaskStateWorkflow.ts
lib/workflows/projects/completeMilestoneWorkflow.ts
lib/workflows/projects/completeProjectWorkflow.ts
```

### Project Server Operations / Helpers

```text
lib/actions/projectsActions.ts
lib/fetchers/projectsFetchers.ts
lib/authz/projectsPermissions.ts
lib/authz/projectsPolicies.ts

lib/db/selects/projectsSelects.ts
lib/db/dto/projectsDto.ts
lib/db/transactions/projectsTransactions.ts

lib/cache/projectsCache.ts
lib/constants/projectsConstants.ts
lib/utils/projectsParams.ts

schemas/projectsSchemas.ts
types/projectsTypes.ts
types/projectsInterfaces.ts

lib/integrations/vercel-blob/client.ts
lib/integrations/vercel-blob/upload.ts
lib/integrations/vercel-blob/delete.ts

lib/integrations/cloudinary/client.ts
lib/integrations/cloudinary/upload.ts
lib/integrations/cloudinary/transformations.ts

lib/integrations/sendgrid/client.ts
lib/integrations/sendgrid/email.ts
```

### Project Semantic Design Token Files

```text
app/globals.css
components/ui/palettes.ts
```

---

# 3. Customer Support / Ticketing System Ontology™

### Routes → Features → Templates → Blocks / Workflows

|Route|Feature|Page Template|Blocks|Workflows|
|---|---|---|---|---|
|`/support/inbox`|`features/support/inboxFeature.tsx`|`components/templates/WorkspaceTemplate.tsx`|`components/blocks/support-inbox.tsx` **[STUB — BUILD]**|`prioritizeTicketWorkflow.ts`, `assignTicketWorkflow.ts`, `calculateSlaWorkflow.ts`|
|`/support/tickets/new`|`features/support/newTicketForm.tsx`|`components/templates/FormTemplate.tsx`|—|`createTicketFromIntakeWorkflow.ts`|
|`/support/tickets/[ticketId]`|`features/support/ticketFeature.tsx`|`components/templates/WorkspaceTemplate.tsx`|`components/blocks/ticket-workspace.tsx` **[STUB — BUILD]**|`calculateSlaWorkflow.ts`, `determineEscalationWorkflow.ts`, `resolveTicketWorkflow.ts`, `reopenTicketWorkflow.ts`|
|`/support/knowledge-base`|`features/support/knowledgeBaseFeature.tsx`|`components/templates/DocsTemplate.tsx`|`components/blocks/knowledge-base.tsx` **[STUB — BUILD]**|`publishKnowledgeArticleWorkflow.ts`|
|`/support/knowledge-base/new`|`features/support/newKnowledgeArticleForm.tsx`|`components/templates/FormTemplate.tsx`|—|`publishKnowledgeArticleWorkflow.ts`|
|`/support/knowledge-base/[articleId]`|`features/support/knowledgeArticleFeature.tsx`|`components/templates/DocsTemplate.tsx`|`components/blocks/knowledge-base.tsx` **[STUB — BUILD]**|—|
|`/support/knowledge-base/[articleId]/edit`|`features/support/editKnowledgeArticleForm.tsx`|`components/templates/FormTemplate.tsx`|—|`publishKnowledgeArticleWorkflow.ts`|
|`/support/analytics`|`features/support/supportAnalyticsFeature.tsx`|`components/templates/DashboardTemplate.tsx`|`components/blocks/analytics-dashboard.tsx` **[STUB — BUILD]**|`calculateSlaWorkflow.ts`|

### Support Blocks → UI Primitives

#### `components/blocks/support-inbox.tsx` **[STUB — BUILD]**

- `components/ui/resizable.tsx`
    
- `components/ui/data-table.tsx`
    
- `components/ui/scroll-area.tsx`
    
- `components/ui/card.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/avatar.tsx`
    
- `components/ui/tabs.tsx`
    
- `components/ui/input.tsx`
    
- `components/ui/select.tsx`
    
- `components/ui/skeleton.tsx`
    

#### `components/blocks/ticket-workspace.tsx` **[STUB — BUILD]**

- `components/ui/resizable.tsx`
    
- `components/ui/scroll-area.tsx`
    
- `components/ui/avatar.tsx`
    
- `components/ui/card.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/tabs.tsx`
    
- `components/ui/textarea.tsx`
    
- `components/ui/button.tsx`
    
- `components/ui/dropdown-menu.tsx`
    
- `components/ui/alert.tsx`
    
- `components/ui/spinner.tsx`
    

#### `components/blocks/knowledge-base.tsx` **[STUB — BUILD]**

- `components/ui/input.tsx`
    
- `components/ui/card.tsx`
    
- `components/ui/accordion.tsx`
    
- `components/ui/tabs.tsx`
    
- `components/ui/breadcrumb.tsx`
    
- `components/ui/pagination.tsx`
    
- `components/ui/skeleton.tsx`
    

### Support Workflows

```text
lib/workflows/support/createTicketFromIntakeWorkflow.ts
lib/workflows/support/prioritizeTicketWorkflow.ts
lib/workflows/support/assignTicketWorkflow.ts
lib/workflows/support/calculateSlaWorkflow.ts
lib/workflows/support/determineEscalationWorkflow.ts
lib/workflows/support/resolveTicketWorkflow.ts
lib/workflows/support/reopenTicketWorkflow.ts
lib/workflows/support/publishKnowledgeArticleWorkflow.ts
```

### Support Server Operations / Helpers

```text
lib/actions/supportActions.ts
lib/fetchers/supportFetchers.ts
lib/authz/supportPermissions.ts
lib/authz/supportPolicies.ts

lib/db/selects/supportSelects.ts
lib/db/dto/supportDto.ts
lib/db/transactions/supportTransactions.ts

lib/cache/supportCache.ts
lib/constants/supportConstants.ts
lib/utils/supportParams.ts

schemas/supportSchemas.ts
types/supportTypes.ts
types/supportInterfaces.ts

lib/integrations/sendgrid/client.ts
lib/integrations/sendgrid/email.ts

lib/integrations/vercel-blob/client.ts
lib/integrations/vercel-blob/upload.ts
lib/integrations/vercel-blob/delete.ts

lib/integrations/cloudinary/client.ts
lib/integrations/cloudinary/upload.ts
lib/integrations/cloudinary/transformations.ts
```

### Support Semantic Design Token Files

```text
app/globals.css
components/ui/palettes.ts
```

---

# 4. Marketing Automation & Analytics Ontology™

### Routes → Features → Templates → Blocks / Workflows

|Route|Feature|Page Template|Blocks|Workflows|
|---|---|---|---|---|
|`/marketing/campaigns`|`features/marketing/campaignsFeature.tsx`|`components/templates/DataGridTemplate.tsx`|`components/blocks/data-table-section.tsx` **[STUB — BUILD]**|`scheduleCampaignWorkflow.ts`, `advanceCampaignSequenceWorkflow.ts`|
|`/marketing/campaigns/new`|`features/marketing/newCampaignForm.tsx`|`components/templates/StepperTemplate.tsx`|—|`evaluateAudienceRulesWorkflow.ts`, `applyDripTimingWorkflow.ts`|
|`/marketing/campaigns/[campaignId]`|`features/marketing/campaignDetailFeature.tsx`|`components/templates/WorkspaceTemplate.tsx`|`components/blocks/campaign-workflow.tsx` **[STUB — BUILD]**|`advanceCampaignSequenceWorkflow.ts`, `processCampaignEventWorkflow.ts`|
|`/marketing/campaigns/[campaignId]/edit`|`features/marketing/editCampaignForm.tsx`|`components/templates/StepperTemplate.tsx`|—|`evaluateCampaignTriggerWorkflow.ts`, `applyDripTimingWorkflow.ts`|
|`/marketing/audiences`|`features/marketing/audiencesFeature.tsx`|`components/templates/DataGridTemplate.tsx`|`components/blocks/data-table-section.tsx` **[STUB — BUILD]**|`evaluateAudienceRulesWorkflow.ts`|
|`/marketing/audiences/new`|`features/marketing/newAudienceForm.tsx`|`components/templates/FormTemplate.tsx`|—|`evaluateAudienceRulesWorkflow.ts`|
|`/marketing/audiences/[audienceId]`|`features/marketing/audienceDetailFeature.tsx`|`components/templates/WorkspaceTemplate.tsx`|`components/blocks/audience-rule-builder.tsx` **[STUB — BUILD]**|`evaluateAudienceRulesWorkflow.ts`|
|`/marketing/audiences/[audienceId]/edit`|`features/marketing/editAudienceForm.tsx`|`components/templates/FormTemplate.tsx`|—|`evaluateAudienceRulesWorkflow.ts`|
|`/marketing/analytics`|`features/marketing/marketingAnalyticsFeature.tsx`|`components/templates/DashboardTemplate.tsx`|`components/blocks/analytics-dashboard.tsx` **[STUB — BUILD]**|`calculateAttributionWorkflow.ts`, `calculateCampaignMetricsWorkflow.ts`|

### Marketing Blocks → UI Primitives

#### `components/blocks/audience-rule-builder.tsx` **[STUB — BUILD]**

- `components/ui/card.tsx`
    
- `components/ui/select.tsx`
    
- `components/ui/combobox.tsx`
    
- `components/ui/input.tsx`
    
- `components/ui/button-group.tsx`
    
- `components/ui/button.tsx`
    
- `components/ui/dropdown-menu.tsx`
    
- `components/ui/popover.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/separator.tsx`
    

#### `components/blocks/campaign-workflow.tsx` **[STUB — BUILD]**

- `components/ui/timeline.tsx`
    
- `components/ui/card.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/button.tsx`
    
- `components/ui/dropdown-menu.tsx`
    
- `components/ui/popover.tsx`
    
- `components/ui/motion.tsx`
    
- `components/ui/scroll-area.tsx`
    

### Marketing Workflows

```text
lib/workflows/marketing/evaluateAudienceRulesWorkflow.ts
lib/workflows/marketing/scheduleCampaignWorkflow.ts
lib/workflows/marketing/advanceCampaignSequenceWorkflow.ts
lib/workflows/marketing/evaluateCampaignTriggerWorkflow.ts
lib/workflows/marketing/processCampaignEventWorkflow.ts
lib/workflows/marketing/calculateAttributionWorkflow.ts
lib/workflows/marketing/calculateCampaignMetricsWorkflow.ts
lib/workflows/marketing/applyDripTimingWorkflow.ts
```

### Marketing Server Operations / Helpers

```text
lib/actions/marketingActions.ts
lib/fetchers/marketingFetchers.ts
lib/authz/marketingPermissions.ts
lib/authz/marketingPolicies.ts

lib/db/selects/marketingSelects.ts
lib/db/dto/marketingDto.ts
lib/db/transactions/marketingTransactions.ts

lib/cache/marketingCache.ts
lib/constants/marketingConstants.ts
lib/utils/marketingParams.ts

schemas/marketingSchemas.ts
types/marketingTypes.ts
types/marketingInterfaces.ts

lib/integrations/sendgrid/client.ts
lib/integrations/sendgrid/email.ts

lib/integrations/cloudinary/client.ts
lib/integrations/cloudinary/upload.ts
lib/integrations/cloudinary/transformations.ts
```

### Marketing Semantic Design Token Files

```text
app/globals.css
components/ui/palettes.ts
```

---

# 5. Invoicing & Expense Tracker Ontology™

### Routes → Features → Templates → Blocks / Workflows

|Route|Feature|Page Template|Blocks|Workflows|
|---|---|---|---|---|
|`/invoices`|`features/invoicing/invoicesFeature.tsx`|`components/templates/DataGridTemplate.tsx`|`components/blocks/data-table-section.tsx` **[STUB — BUILD]**|`determineInvoiceStatusWorkflow.ts`|
|`/invoices/new`|`features/invoicing/newInvoiceForm.tsx`|`components/templates/FormTemplate.tsx`|`components/blocks/invoice.tsx`|`calculateInvoiceTotalsWorkflow.ts`, `calculateTaxesWorkflow.ts`|
|`/invoices/[invoiceId]`|`features/invoicing/invoiceDetailFeature.tsx`|`components/templates/BillingTemplate.tsx`|`components/blocks/invoice.tsx`|`determineInvoiceStatusWorkflow.ts`, `finalizeInvoiceWorkflow.ts`, `reconcilePaymentStateWorkflow.ts`|
|`/invoices/[invoiceId]/edit`|`features/invoicing/editInvoiceForm.tsx`|`components/templates/FormTemplate.tsx`|`components/blocks/invoice.tsx`|`calculateInvoiceTotalsWorkflow.ts`, `calculateTaxesWorkflow.ts`|
|`/expenses`|`features/invoicing/expensesFeature.tsx`|`components/templates/DataGridTemplate.tsx`|`components/blocks/data-table-section.tsx` **[STUB — BUILD]**|`enforceExpensePolicyWorkflow.ts`|
|`/expenses/new`|`features/invoicing/newExpenseForm.tsx`|`components/templates/FormTemplate.tsx`|`components/blocks/expense-upload.tsx` **[STUB — BUILD]**|`submitExpenseWorkflow.ts`, `enforceExpensePolicyWorkflow.ts`|
|`/expenses/[expenseId]`|`features/invoicing/expenseDetailFeature.tsx`|`components/templates/ProfileTemplate.tsx`|`components/blocks/record-detail-section.tsx` **[STUB — BUILD]**|`approveExpenseWorkflow.ts`|
|`/expenses/[expenseId]/edit`|`features/invoicing/editExpenseForm.tsx`|`components/templates/FormTemplate.tsx`|`components/blocks/expense-upload.tsx` **[STUB — BUILD]**|`enforceExpensePolicyWorkflow.ts`|

### Invoicing Blocks → UI Primitives

#### `components/blocks/invoice.tsx`

- `components/ui/card.tsx`
    
- `components/ui/table.tsx`
    
- `components/ui/input.tsx`
    
- `components/ui/select.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/separator.tsx`
    
- `components/ui/button.tsx`
    

#### `components/blocks/expense-upload.tsx` **[STUB — BUILD]**

- `components/ui/dropzone.tsx`
    
- `components/ui/input.tsx`
    
- `components/ui/select.tsx`
    
- `components/ui/date-picker.tsx`
    
- `components/ui/card.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/button.tsx`
    
- `components/ui/progress.tsx`
    

### Invoicing Workflows

```text
lib/workflows/invoicing/calculateInvoiceTotalsWorkflow.ts
lib/workflows/invoicing/calculateTaxesWorkflow.ts
lib/workflows/invoicing/determineInvoiceStatusWorkflow.ts
lib/workflows/invoicing/finalizeInvoiceWorkflow.ts
lib/workflows/invoicing/approveInvoiceWorkflow.ts
lib/workflows/invoicing/reconcilePaymentStateWorkflow.ts
lib/workflows/invoicing/applyCurrencyCalculationsWorkflow.ts
lib/workflows/invoicing/submitExpenseWorkflow.ts
lib/workflows/invoicing/approveExpenseWorkflow.ts
lib/workflows/invoicing/enforceExpensePolicyWorkflow.ts
```

### Invoicing Server Operations / Helpers

```text
lib/actions/invoicingActions.ts
lib/fetchers/invoicingFetchers.ts
lib/authz/invoicingPermissions.ts
lib/authz/invoicingPolicies.ts

lib/db/selects/invoicingSelects.ts
lib/db/dto/invoicingDto.ts
lib/db/transactions/invoicingTransactions.ts

lib/cache/invoicingCache.ts
lib/constants/invoicingConstants.ts
lib/utils/invoicingParams.ts

schemas/invoicingSchemas.ts
types/invoicingTypes.ts
types/invoicingInterfaces.ts

lib/integrations/stripe/client.ts
lib/integrations/stripe/checkout.ts
lib/integrations/stripe/portal.ts
lib/integrations/stripe/subscriptions.ts
lib/integrations/stripe/webhooks.ts

lib/integrations/vercel-blob/client.ts
lib/integrations/vercel-blob/upload.ts
lib/integrations/vercel-blob/delete.ts
```

### Invoicing Semantic Design Token Files

```text
app/globals.css
components/ui/palettes.ts
```

---

# 6. Social Media Scheduler Ontology™

### Routes → Features → Templates → Blocks / Workflows

|Route|Feature|Page Template|Blocks|Workflows|
|---|---|---|---|---|
|`/social/calendar`|`features/social/calendarFeature.tsx`|`components/templates/CalanderTemplate.tsx`|`components/blocks/social-calendar.tsx` **[STUB — BUILD]**|`resolvePublishTimeWorkflow.ts`, `schedulePostWorkflow.ts`|
|`/social/compose`|`features/social/composerFeature.tsx`|`components/templates/WorkspaceTemplate.tsx`|`components/blocks/post-composer.tsx` **[STUB — BUILD]**|`buildPlatformVariantWorkflow.ts`, `approvePostWorkflow.ts`, `schedulePostWorkflow.ts`|
|`/social/posts/[postId]`|`features/social/postDetailFeature.tsx`|`components/templates/WorkspaceTemplate.tsx`|`components/blocks/post-composer.tsx` **[STUB — BUILD]**, `components/blocks/activity-timeline.tsx` **[STUB — BUILD]**|`publishPostWorkflow.ts`, `reconcilePublishStateWorkflow.ts`|
|`/social/posts/[postId]/edit`|`features/social/editPostForm.tsx`|`components/templates/FormTemplate.tsx`|—|`buildPlatformVariantWorkflow.ts`, `schedulePostWorkflow.ts`|
|`/social/media`|`features/social/mediaLibraryFeature.tsx`|`components/templates/DataGridTemplate.tsx`|`components/blocks/media-library.tsx` **[STUB — BUILD]**|`associateMediaWorkflow.ts`|

### Social Blocks → UI Primitives

#### `components/blocks/social-calendar.tsx` **[STUB — BUILD]**

- `components/ui/calendar.tsx`
    
- `components/ui/date-picker.tsx`
    
- `components/ui/popover.tsx`
    
- `components/ui/card.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/avatar.tsx`
    
- `components/ui/button.tsx`
    
- `components/ui/select.tsx`
    

#### `components/blocks/post-composer.tsx` **[STUB — BUILD]**

- `components/ui/textarea.tsx`
    
- `components/ui/input.tsx`
    
- `components/ui/select.tsx`
    
- `components/ui/tabs.tsx`
    
- `components/ui/card.tsx`
    
- `components/ui/dropzone.tsx`
    
- `components/ui/button.tsx`
    
- `components/ui/date-picker.tsx`
    
- `components/ui/time-picker.tsx`
    
- `components/ui/popover.tsx`
    
- `components/ui/badge.tsx`
    

#### `components/blocks/media-library.tsx` **[STUB — BUILD]**

- `components/ui/card.tsx`
    
- `components/ui/aspect-ratio.tsx`
    
- `components/ui/dialog.tsx`
    
- `components/ui/dropzone.tsx`
    
- `components/ui/checkbox.tsx`
    
- `components/ui/dropdown-menu.tsx`
    
- `components/ui/input.tsx`
    
- `components/ui/pagination.tsx`
    

### Social Workflows

```text
lib/workflows/social/buildPlatformVariantWorkflow.ts
lib/workflows/social/resolvePublishTimeWorkflow.ts
lib/workflows/social/approvePostWorkflow.ts
lib/workflows/social/schedulePostWorkflow.ts
lib/workflows/social/publishPostWorkflow.ts
lib/workflows/social/reconcilePublishStateWorkflow.ts
lib/workflows/social/retryFailedPublicationWorkflow.ts
lib/workflows/social/associateMediaWorkflow.ts
```

### Social Server Operations / Helpers

```text
lib/actions/socialActions.ts
lib/fetchers/socialFetchers.ts
lib/authz/socialPermissions.ts
lib/authz/socialPolicies.ts

lib/db/selects/socialSelects.ts
lib/db/dto/socialDto.ts
lib/db/transactions/socialTransactions.ts

lib/cache/socialCache.ts
lib/constants/socialConstants.ts
lib/utils/socialParams.ts

schemas/socialSchemas.ts
types/socialTypes.ts
types/socialInterfaces.ts

lib/integrations/cloudinary/client.ts
lib/integrations/cloudinary/upload.ts
lib/integrations/cloudinary/transformations.ts

lib/integrations/vercel-blob/client.ts
lib/integrations/vercel-blob/upload.ts
lib/integrations/vercel-blob/delete.ts
```

### Social Semantic Design Token Files

```text
app/globals.css
components/ui/palettes.ts
```

---

# 7. AI-Powered Wrapper / Micro-SaaS Ontology™

### Routes → Features → Templates → Blocks / Workflows

|Route|Feature|Page Template|Blocks|Workflows|
|---|---|---|---|---|
|`/ai`|`features/ai/generationFeature.tsx`|`components/templates/WorkspaceTemplate.tsx`|`components/blocks/ai-chat-workspace.tsx` **[STUB — BUILD]**|`authorizeModelAccessWorkflow.ts`, `selectModelWorkflow.ts`, `executeGenerationWorkflow.ts`|
|`/ai/playground`|`features/ai/playgroundFeature.tsx`|`components/templates/WorkspaceTemplate.tsx`|`components/blocks/ai-playground.tsx` **[STUB — BUILD]**|`selectModelWorkflow.ts`, `executeGenerationWorkflow.ts`, `calculateUsageWorkflow.ts`|
|`/ai/usage`|`features/ai/usageFeature.tsx`|`components/templates/DashboardTemplate.tsx`|`components/blocks/usage-dashboard.tsx` **[STUB — BUILD]**|`calculateUsageWorkflow.ts`, `calculateCreditsWorkflow.ts`, `enforceRateLimitWorkflow.ts`, `reconcileUsageBillingWorkflow.ts`|

### AI Blocks → UI Primitives

#### `components/blocks/ai-chat-workspace.tsx` **[STUB — BUILD]**

- `components/ui/scroll-area.tsx`
    
- `components/ui/textarea.tsx`
    
- `components/ui/button.tsx`
    
- `components/ui/card.tsx`
    
- `components/ui/avatar.tsx`
    
- `components/ui/spinner.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/dropdown-menu.tsx`
    

#### `components/blocks/ai-playground.tsx` **[STUB — BUILD]**

- `components/ui/resizable.tsx`
    
- `components/ui/textarea.tsx`
    
- `components/ui/select.tsx`
    
- `components/ui/slider.tsx`
    
- `components/ui/input.tsx`
    
- `components/ui/tabs.tsx`
    
- `components/ui/card.tsx`
    
- `components/ui/button.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/kbd.tsx`
    

#### `components/blocks/usage-dashboard.tsx` **[STUB — BUILD]**

- `components/ui/stat-card.tsx`
    
- `components/ui/chart.tsx`
    
- `components/ui/gauge-chart.tsx`
    
- `components/ui/sparkline.tsx`
    
- `components/ui/progress.tsx`
    
- `components/ui/card.tsx`
    
- `components/ui/date-range-picker.tsx`
    
- `components/ui/skeleton.tsx`
    

### AI Workflows

```text
lib/workflows/ai/authorizeModelAccessWorkflow.ts
lib/workflows/ai/selectModelWorkflow.ts
lib/workflows/ai/executeGenerationWorkflow.ts
lib/workflows/ai/calculateUsageWorkflow.ts
lib/workflows/ai/calculateCreditsWorkflow.ts
lib/workflows/ai/enforceRateLimitWorkflow.ts
lib/workflows/ai/recordGenerationUsageWorkflow.ts
lib/workflows/ai/reconcileUsageBillingWorkflow.ts
```

### AI Server Operations / Helpers

```text
lib/actions/aiActions.ts
lib/fetchers/aiFetchers.ts
lib/authz/aiPermissions.ts
lib/authz/aiPolicies.ts

lib/db/selects/aiSelects.ts
lib/db/dto/aiDto.ts
lib/db/transactions/aiTransactions.ts

lib/cache/aiCache.ts
lib/constants/aiConstants.ts
lib/utils/aiParams.ts

schemas/aiSchemas.ts
types/aiTypes.ts
types/aiInterfaces.ts

lib/integrations/hugging-face/client.ts
lib/integrations/hugging-face/inference.ts
lib/integrations/hugging-face/embeddings.ts

lib/integrations/stripe/client.ts
lib/integrations/stripe/checkout.ts
lib/integrations/stripe/portal.ts
lib/integrations/stripe/subscriptions.ts
lib/integrations/stripe/webhooks.ts
```

### AI Semantic Design Token Files

```text
app/globals.css
components/ui/palettes.ts
```

---

# 8. B2B Client Portal Ontology™

### Routes → Features → Templates → Blocks / Workflows

|Route|Feature|Page Template|Blocks|Workflows|
|---|---|---|---|---|
|`/portal`|`features/portal/portalFeature.tsx`|`components/templates/DashboardTemplate.tsx`|`components/blocks/dashboard-layout.tsx`|`calculateClientProjectStatusWorkflow.ts`|
|`/portal/documents`|`features/portal/documentsFeature.tsx`|`components/templates/DataGridTemplate.tsx`|`components/blocks/file-vault.tsx` **[STUB — BUILD]**|`shareDocumentWorkflow.ts`, `publishDocumentVersionWorkflow.ts`|
|`/portal/documents/[documentId]`|`features/portal/documentDetailFeature.tsx`|`components/templates/WorkspaceTemplate.tsx`|`components/blocks/record-detail-section.tsx` **[STUB — BUILD]**, `components/blocks/approval-panel.tsx` **[STUB — BUILD]**|`requestApprovalWorkflow.ts`, `approveDeliverableWorkflow.ts`, `rejectDeliverableWorkflow.ts`|
|`/portal/approvals`|`features/portal/approvalsFeature.tsx`|`components/templates/DataGridTemplate.tsx`|`components/blocks/approval-panel.tsx` **[STUB — BUILD]**|`requestApprovalWorkflow.ts`, `approveDeliverableWorkflow.ts`, `rejectDeliverableWorkflow.ts`|
|`/portal/billing`|`features/portal/billingFeature.tsx`|`components/templates/BillingTemplate.tsx`|`components/blocks/invoice.tsx`|`settleClientInvoiceWorkflow.ts`|

### Portal Blocks → UI Primitives

#### `components/blocks/file-vault.tsx` **[STUB — BUILD]**

- `components/ui/dropzone.tsx`
    
- `components/ui/data-table.tsx`
    
- `components/ui/card.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/dropdown-menu.tsx`
    
- `components/ui/dialog.tsx`
    
- `components/ui/progress.tsx`
    
- `components/ui/pagination.tsx`
    

#### `components/blocks/approval-panel.tsx` **[STUB — BUILD]**

- `components/ui/card.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/alert-dialog.tsx`
    
- `components/ui/button.tsx`
    
- `components/ui/textarea.tsx`
    
- `components/ui/timeline.tsx`
    
- `components/ui/separator.tsx`
    

#### Existing

```text
components/blocks/dashboard-layout.tsx
components/blocks/invoice.tsx
```

### Portal Workflows

```text
lib/workflows/portal/grantClientAccessWorkflow.ts
lib/workflows/portal/calculateClientProjectStatusWorkflow.ts
lib/workflows/portal/shareDocumentWorkflow.ts
lib/workflows/portal/publishDocumentVersionWorkflow.ts
lib/workflows/portal/requestApprovalWorkflow.ts
lib/workflows/portal/approveDeliverableWorkflow.ts
lib/workflows/portal/rejectDeliverableWorkflow.ts
lib/workflows/portal/settleClientInvoiceWorkflow.ts
```

### Portal Server Operations / Helpers

```text
lib/actions/portalActions.ts
lib/fetchers/portalFetchers.ts
lib/authz/portalPermissions.ts
lib/authz/portalPolicies.ts

lib/db/selects/portalSelects.ts
lib/db/dto/portalDto.ts
lib/db/transactions/portalTransactions.ts

lib/cache/portalCache.ts
lib/constants/portalConstants.ts
lib/utils/portalParams.ts

schemas/portalSchemas.ts
types/portalTypes.ts
types/portalInterfaces.ts

lib/integrations/vercel-blob/client.ts
lib/integrations/vercel-blob/upload.ts
lib/integrations/vercel-blob/delete.ts

lib/integrations/cloudinary/client.ts
lib/integrations/cloudinary/upload.ts
lib/integrations/cloudinary/transformations.ts

lib/integrations/stripe/client.ts
lib/integrations/stripe/checkout.ts
lib/integrations/stripe/portal.ts
lib/integrations/stripe/webhooks.ts

lib/integrations/sendgrid/client.ts
lib/integrations/sendgrid/email.ts
```

### Portal Semantic Design Token Files

```text
app/globals.css
components/ui/palettes.ts
```

---

# 9. Internal Tools / Admin Portal Ontology™

### Routes → Features → Templates → Blocks / Workflows

|Route|Feature|Page Template|Blocks|Workflows|
|---|---|---|---|---|
|`/admin/records`|`features/admin/recordsFeature.tsx`|`components/templates/AdminTemplate.tsx`|`components/blocks/admin-record-inspector.tsx` **[STUB — BUILD]**|`performAdministrativeOverrideWorkflow.ts`|
|`/admin/records/[recordId]`|`features/admin/recordDetailFeature.tsx`|`components/templates/AdminTemplate.tsx`|`components/blocks/record-detail-section.tsx` **[STUB — BUILD]**|`performAdministrativeOverrideWorkflow.ts`|
|`/admin/users`|`features/admin/usersFeature.tsx`|`components/templates/AdminTemplate.tsx`|`components/blocks/admin-user-table.tsx` **[STUB — BUILD]**, `components/blocks/bulk-actions.tsx` **[STUB — BUILD]**|`suspendUserWorkflow.ts`, `restoreUserWorkflow.ts`, `executeBulkOperationWorkflow.ts`|
|`/admin/users/[userId]`|`features/admin/userDetailFeature.tsx`|`components/templates/AdminTemplate.tsx`|`components/blocks/record-detail-section.tsx` **[STUB — BUILD]**|`suspendUserWorkflow.ts`, `restoreUserWorkflow.ts`, `changeMembershipWorkflow.ts`|
|`/admin/audit`|`features/admin/auditFeature.tsx`|`components/templates/AdminTemplate.tsx`|`components/blocks/audit-log.tsx` **[STUB — BUILD]**|`classifyAuditEventWorkflow.ts`|

### Admin Blocks → UI Primitives

#### `components/blocks/admin-record-inspector.tsx` **[STUB — BUILD]**

- `components/ui/data-table.tsx`
    
- `components/ui/resizable.tsx`
    
- `components/ui/card.tsx`
    
- `components/ui/tabs.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/drawer.tsx`
    
- `components/ui/dropdown-menu.tsx`
    
- `components/ui/input.tsx`
    
- `components/ui/pagination.tsx`
    

#### `components/blocks/admin-user-table.tsx` **[STUB — BUILD]**

- `components/ui/data-table.tsx`
    
- `components/ui/avatar.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/checkbox.tsx`
    
- `components/ui/dropdown-menu.tsx`
    
- `components/ui/input.tsx`
    
- `components/ui/select.tsx`
    
- `components/ui/pagination.tsx`
    

#### `components/blocks/bulk-actions.tsx` **[STUB — BUILD]**

- `components/ui/checkbox.tsx`
    
- `components/ui/select.tsx`
    
- `components/ui/dialog.tsx`
    
- `components/ui/alert-dialog.tsx`
    
- `components/ui/progress.tsx`
    
- `components/ui/button.tsx`
    
- `components/ui/dropdown-menu.tsx`
    

#### `components/blocks/audit-log.tsx` **[STUB — BUILD]**

- `components/ui/data-table.tsx`
    
- `components/ui/badge.tsx`
    
- `components/ui/date-range-picker.tsx`
    
- `components/ui/input.tsx`
    
- `components/ui/select.tsx`
    
- `components/ui/pagination.tsx`
    
- `components/ui/drawer.tsx`
    
- `components/ui/card.tsx`
    

### Admin Workflows

```text
lib/workflows/admin/suspendUserWorkflow.ts
lib/workflows/admin/restoreUserWorkflow.ts
lib/workflows/admin/changeMembershipWorkflow.ts
lib/workflows/admin/executeBulkOperationWorkflow.ts
lib/workflows/admin/classifyAuditEventWorkflow.ts
lib/workflows/admin/performAdministrativeOverrideWorkflow.ts
lib/workflows/admin/reconcileAdministrativeProviderStateWorkflow.ts
```

### Admin Server Operations / Helpers

```text
lib/actions/adminActions.ts
lib/fetchers/adminFetchers.ts
lib/authz/adminPermissions.ts
lib/authz/adminPolicies.ts

lib/db/selects/adminSelects.ts
lib/db/dto/adminDto.ts
lib/db/transactions/adminTransactions.ts

lib/cache/adminCache.ts
lib/constants/adminConstants.ts
lib/utils/adminParams.ts

schemas/adminSchemas.ts
types/adminTypes.ts
types/adminInterfaces.ts

lib/integrations/stripe/client.ts
lib/integrations/stripe/subscriptions.ts
```

### Admin Semantic Design Token Files

```text
app/globals.css
components/ui/palettes.ts
```
