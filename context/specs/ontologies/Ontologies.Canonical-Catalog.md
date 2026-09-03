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
updated: 2026-09-03
---

# The Ontology™ Normalized Defaults — Canonical Catalog

# Canonical Ontology File Inventory
## 0. Shared Foundation Ontology™

### Routes → Features → Templates → Blocks / Workflows

| Route | Feature / Form | Client Island | Suspense Skeleton | Page Template | Existing Block(s) | Workflow File |
| --- | --- | --- | --- | --- | --- | --- |
| `/dashboard` | `features/dashboard/dashboardFeature.tsx` | `features/dashboard/dashboardFeature.client.tsx` | `features/dashboard/dashboardSkeleton.tsx` | `components/templates/sharedDashboardTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/organizationWorkflows.ts` |
| `/onboarding` | `features/onboarding/onboardingFeature.tsx` | `features/onboarding/onboardingFeature.client.tsx` | `features/onboarding/onboardingSkeleton.tsx` | `components/templates/sharedOnboardingTemplate.tsx` | `components/blocks/onboarding-flow.tsx` | `lib/workflows/organizationWorkflows.ts` |
| `/settings/billing` | `features/settings/billingFeature.tsx` | `features/settings/billingFeature.client.tsx` | `features/settings/billingSkeleton.tsx` | `components/templates/sharedBillingSettingsTemplate.tsx` | `components/blocks/settings-page.tsx` | `lib/workflows/organizationWorkflows.ts` |
| `/settings/integrations` | `features/settings/integrationsFeature.tsx` | `features/settings/integrationsFeature.client.tsx` | `features/settings/integrationsSkeleton.tsx` | `components/templates/sharedIntegrationsTemplate.tsx` | `components/blocks/settings-page.tsx` | `lib/workflows/organizationWorkflows.ts` |
| `/settings/members` | `features/settings/membersFeature.tsx` | `features/settings/membersFeature.client.tsx` | `features/settings/membersSkeleton.tsx` | `components/templates/sharedMembersTemplate.tsx` | `components/blocks/settings-page.tsx` | `lib/workflows/organizationWorkflows.ts` |
| `/settings/profile` | `features/settings/profileFeature.tsx` | `features/settings/profileFeature.client.tsx` | `features/settings/profileSkeleton.tsx` | `components/templates/sharedProfileSettingsTemplate.tsx` | `components/blocks/settings-page.tsx` | `lib/workflows/organizationWorkflows.ts` |

### Target Route Files

```text
app/(tenant)/dashboard/page.tsx
app/(tenant)/onboarding/page.tsx
app/(tenant)/settings/billing/page.tsx
app/(tenant)/settings/integrations/page.tsx
app/(tenant)/settings/members/page.tsx
app/(tenant)/settings/profile/page.tsx
```
### Target Feature Files

```text
features/dashboard/dashboardFeature.tsx
features/dashboard/dashboardFeature.client.tsx
features/dashboard/dashboardSkeleton.tsx
features/onboarding/onboardingFeature.tsx
features/onboarding/onboardingFeature.client.tsx
features/onboarding/onboardingSkeleton.tsx
features/settings/billingFeature.tsx
features/settings/billingFeature.client.tsx
features/settings/billingSkeleton.tsx
features/settings/integrationsFeature.tsx
features/settings/integrationsFeature.client.tsx
features/settings/integrationsSkeleton.tsx
features/settings/membersFeature.tsx
features/settings/membersFeature.client.tsx
features/settings/membersSkeleton.tsx
features/settings/profileFeature.tsx
features/settings/profileFeature.client.tsx
features/settings/profileSkeleton.tsx
```
### Target Page Template Files

```text
components/templates/sharedDashboardTemplate.tsx
components/templates/sharedOnboardingTemplate.tsx
components/templates/sharedBillingSettingsTemplate.tsx
components/templates/sharedIntegrationsTemplate.tsx
components/templates/sharedMembersTemplate.tsx
components/templates/sharedProfileSettingsTemplate.tsx
```
### Existing Block Files Used

```text
components/blocks/dashboard-layout.tsx
components/blocks/onboarding-flow.tsx
components/blocks/settings-page.tsx
```
### Canonical Server / Schema / Type Files

```text
lib/actions/commonActions.ts
lib/fetchers/organizationFetchers.ts
lib/fetchers/integrationFetchers.ts
lib/workflows/organizationWorkflows.ts
lib/db/selects/organization.selects.ts
lib/db/dto/organization.dto.ts
lib/authz/permissions.ts
lib/authz/policies.ts
lib/authz/resources.ts
lib/authz/roles.ts
schemas/commonSchemas.ts
schemas/integrationSchemas.ts
types/commonTypes.ts
types/integrationTypes.ts
types/access.ts
types/uiTypes.ts
```

---

## 1. CRM / Pipeline Tracker Ontology™

### Routes → Features → Templates → Blocks / Workflows

| Route | Feature / Form | Client Island | Suspense Skeleton | Page Template | Existing Block(s) | Workflow File |
| --- | --- | --- | --- | --- | --- | --- |
| `/crm/pipeline` | `features/crm/crmPipelineFeature.tsx` | `features/crm/crmPipelineFeature.client.tsx` | `features/crm/crmPipelineSkeleton.tsx` | `components/templates/crmPipelineTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/crmWorkflows.ts` |
| `/crm/analytics` | `features/crm/crmAnalyticsFeature.tsx` | `features/crm/crmAnalyticsFeature.client.tsx` | `features/crm/crmAnalyticsSkeleton.tsx` | `components/templates/crmAnalyticsTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/crmWorkflows.ts` |
| `/crm/leads` | `features/crm/crmLeadsFeature.tsx` | `features/crm/crmLeadsFeature.client.tsx` | `features/crm/crmLeadsSkeleton.tsx` | `components/templates/crmLeadsTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/crmWorkflows.ts` |
| `/crm/leads/new` | `features/crm/crmNewLeadForm.tsx` | — | — | — | — | `lib/workflows/crmWorkflows.ts` |
| `/crm/leads/[leadId]` | `features/crm/crmLeadDetailFeature.tsx` | `features/crm/crmLeadDetailFeature.client.tsx` | `features/crm/crmLeadDetailSkeleton.tsx` | `components/templates/crmLeadDetailTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/crmWorkflows.ts` |
| `/crm/leads/[leadId]/edit` | `features/crm/crmEditLeadForm.tsx` | — | — | — | — | `lib/workflows/crmWorkflows.ts` |
| `/crm/contacts` | `features/crm/crmContactsFeature.tsx` | `features/crm/crmContactsFeature.client.tsx` | `features/crm/crmContactsSkeleton.tsx` | `components/templates/crmContactsTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/crmWorkflows.ts` |
| `/crm/contacts/new` | `features/crm/crmNewContactForm.tsx` | — | — | — | — | `lib/workflows/crmWorkflows.ts` |
| `/crm/contacts/[contactId]` | `features/crm/crmContactDetailFeature.tsx` | `features/crm/crmContactDetailFeature.client.tsx` | `features/crm/crmContactDetailSkeleton.tsx` | `components/templates/crmContactDetailTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/crmWorkflows.ts` |
| `/crm/contacts/[contactId]/edit` | `features/crm/crmEditContactForm.tsx` | — | — | — | — | `lib/workflows/crmWorkflows.ts` |
| `/crm/accounts` | `features/crm/crmAccountsFeature.tsx` | `features/crm/crmAccountsFeature.client.tsx` | `features/crm/crmAccountsSkeleton.tsx` | `components/templates/crmAccountsTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/crmWorkflows.ts` |
| `/crm/accounts/new` | `features/crm/crmNewAccountForm.tsx` | — | — | — | — | `lib/workflows/crmWorkflows.ts` |
| `/crm/accounts/[accountId]` | `features/crm/crmAccountDetailFeature.tsx` | `features/crm/crmAccountDetailFeature.client.tsx` | `features/crm/crmAccountDetailSkeleton.tsx` | `components/templates/crmAccountDetailTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/crmWorkflows.ts` |
| `/crm/accounts/[accountId]/edit` | `features/crm/crmEditAccountForm.tsx` | — | — | — | — | `lib/workflows/crmWorkflows.ts` |

### Target Route Files

```text
app/(tenant)/crm/pipeline/page.tsx
app/(tenant)/crm/analytics/page.tsx
app/(tenant)/crm/leads/page.tsx
app/(tenant)/crm/leads/new/page.tsx
app/(tenant)/crm/leads/[leadId]/page.tsx
app/(tenant)/crm/leads/[leadId]/edit/page.tsx
app/(tenant)/crm/contacts/page.tsx
app/(tenant)/crm/contacts/new/page.tsx
app/(tenant)/crm/contacts/[contactId]/page.tsx
app/(tenant)/crm/contacts/[contactId]/edit/page.tsx
app/(tenant)/crm/accounts/page.tsx
app/(tenant)/crm/accounts/new/page.tsx
app/(tenant)/crm/accounts/[accountId]/page.tsx
app/(tenant)/crm/accounts/[accountId]/edit/page.tsx
```
### Target Feature Files

```text
features/crm/crmPipelineFeature.tsx
features/crm/crmAnalyticsFeature.tsx
features/crm/crmLeadsFeature.tsx
features/crm/crmNewLeadForm.tsx
features/crm/crmLeadDetailFeature.tsx
features/crm/crmEditLeadForm.tsx
features/crm/crmContactsFeature.tsx
features/crm/crmNewContactForm.tsx
features/crm/crmContactDetailFeature.tsx
features/crm/crmEditContactForm.tsx
features/crm/crmAccountsFeature.tsx
features/crm/crmNewAccountForm.tsx
features/crm/crmAccountDetailFeature.tsx
features/crm/crmEditAccountForm.tsx
features/crm/crmPipelineFeature.client.tsx
features/crm/crmAnalyticsFeature.client.tsx
features/crm/crmLeadsFeature.client.tsx
features/crm/crmLeadDetailFeature.client.tsx
features/crm/crmContactsFeature.client.tsx
features/crm/crmContactDetailFeature.client.tsx
features/crm/crmAccountsFeature.client.tsx
features/crm/crmAccountDetailFeature.client.tsx
features/crm/crmPipelineSkeleton.tsx
features/crm/crmAnalyticsSkeleton.tsx
features/crm/crmLeadsSkeleton.tsx
features/crm/crmLeadDetailSkeleton.tsx
features/crm/crmContactsSkeleton.tsx
features/crm/crmContactDetailSkeleton.tsx
features/crm/crmAccountsSkeleton.tsx
features/crm/crmAccountDetailSkeleton.tsx
```
### Target Page Template Files

```text
components/templates/crmAccountDetailTemplate.tsx
components/templates/crmAccountsTemplate.tsx
components/templates/crmAnalyticsTemplate.tsx
components/templates/crmContactDetailTemplate.tsx
components/templates/crmContactsTemplate.tsx
components/templates/crmLeadDetailTemplate.tsx
components/templates/crmLeadsTemplate.tsx
components/templates/crmPipelineTemplate.tsx
```
### Existing Block Files Used

```text
components/blocks/dashboard-layout.tsx
```
### Canonical Server / Schema / Type Files

```text
lib/actions/crmActions.ts
lib/fetchers/crmFetchers.ts
lib/workflows/crmWorkflows.ts
lib/db/selects/crm.selects.ts
lib/db/dto/crm.dto.ts
lib/db/transactions/assign-crm-record.tx.ts
lib/db/transactions/record-sales-activity.tx.ts
lib/db/transactions/update-deal-stage.tx.ts
lib/authz/permissions.ts
lib/authz/policies.ts
lib/authz/resources.ts
lib/authz/roles.ts
schemas/crmSchemas.ts
types/crmTypes.ts
```

---

## 2. Project Management / Task Tracker Ontology™

### Routes → Features → Templates → Blocks / Workflows

| Route | Feature / Form | Client Island | Suspense Skeleton | Page Template | Existing Block(s) | Workflow File |
| --- | --- | --- | --- | --- | --- | --- |
| `/projects` | `features/projects/projectsFeature.tsx` | `features/projects/projectsFeature.client.tsx` | `features/projects/projectsSkeleton.tsx` | `components/templates/projectsTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/projectsWorkflows.ts` |
| `/projects/new` | `features/projects/projectNewForm.tsx` | — | — | — | — | `lib/workflows/projectsWorkflows.ts` |
| `/projects/[projectId]` | `features/projects/projectFeature.tsx` | `features/projects/projectFeature.client.tsx` | `features/projects/projectSkeleton.tsx` | `components/templates/projectDetailTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/projectsWorkflows.ts` |
| `/projects/[projectId]/edit` | `features/projects/projectEditForm.tsx` | — | — | — | — | `lib/workflows/projectsWorkflows.ts` |
| `/projects/[projectId]/tasks` | `features/projects/tasksFeature.tsx` | `features/projects/tasksFeature.client.tsx` | `features/projects/tasksSkeleton.tsx` | `components/templates/projectTasksTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/projectsWorkflows.ts` |
| `/projects/[projectId]/tasks/new` | `features/projects/taskNewForm.tsx` | — | — | — | — | `lib/workflows/projectsWorkflows.ts` |
| `/projects/[projectId]/tasks/[taskId]` | `features/projects/taskFeature.tsx` | `features/projects/taskFeature.client.tsx` | `features/projects/taskSkeleton.tsx` | `components/templates/projectTaskDetailTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/projectsWorkflows.ts` |
| `/projects/[projectId]/tasks/[taskId]/edit` | `features/projects/taskEditForm.tsx` | — | — | — | — | `lib/workflows/projectsWorkflows.ts` |
| `/projects/[projectId]/timeline` | `features/projects/timelineFeature.tsx` | `features/projects/timelineFeature.client.tsx` | `features/projects/timelineSkeleton.tsx` | `components/templates/projectTimelineTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/projectsWorkflows.ts` |
| `/my-tasks` | `features/projects/myTasksFeature.tsx` | `features/projects/myTasksFeature.client.tsx` | `features/projects/myTasksSkeleton.tsx` | `components/templates/myTasksTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/projectsWorkflows.ts` |

### Target Route Files

```text
app/(tenant)/projects/page.tsx
app/(tenant)/projects/new/page.tsx
app/(tenant)/projects/[projectId]/page.tsx
app/(tenant)/projects/[projectId]/edit/page.tsx
app/(tenant)/projects/[projectId]/tasks/page.tsx
app/(tenant)/projects/[projectId]/tasks/new/page.tsx
app/(tenant)/projects/[projectId]/tasks/[taskId]/page.tsx
app/(tenant)/projects/[projectId]/tasks/[taskId]/edit/page.tsx
app/(tenant)/projects/[projectId]/timeline/page.tsx
app/(tenant)/my-tasks/page.tsx
```
### Target Feature Files

```text
features/projects/projectsFeature.tsx
features/projects/projectsFeature.client.tsx
features/projects/projectsSkeleton.tsx
features/projects/projectNewForm.tsx
features/projects/projectFeature.tsx
features/projects/projectFeature.client.tsx
features/projects/projectSkeleton.tsx
features/projects/projectEditForm.tsx
features/projects/tasksFeature.tsx
features/projects/tasksFeature.client.tsx
features/projects/tasksSkeleton.tsx
features/projects/taskNewForm.tsx
features/projects/taskFeature.tsx
features/projects/taskFeature.client.tsx
features/projects/taskSkeleton.tsx
features/projects/taskEditForm.tsx
features/projects/timelineFeature.tsx
features/projects/timelineFeature.client.tsx
features/projects/timelineSkeleton.tsx
features/projects/myTasksFeature.tsx
features/projects/myTasksFeature.client.tsx
features/projects/myTasksSkeleton.tsx
```
### Target Page Template Files

```text
components/templates/myTasksTemplate.tsx
components/templates/projectDetailTemplate.tsx
components/templates/projectTaskDetailTemplate.tsx
components/templates/projectTasksTemplate.tsx
components/templates/projectTimelineTemplate.tsx
components/templates/projectsTemplate.tsx
```
### Existing Block Files Used

```text
components/blocks/dashboard-layout.tsx
```
### Canonical Server / Schema / Type Files

```text
lib/actions/projectsActions.ts
lib/fetchers/projectsFetchers.ts
lib/workflows/projectsWorkflows.ts
lib/db/selects/projects.selects.ts
lib/db/dto/projects.dto.ts
lib/db/transactions/projects.tx.ts
lib/db/transactions/update-task-status.tx.ts
lib/authz/permissions.ts
lib/authz/policies.ts
lib/authz/resources.ts
lib/authz/roles.ts
schemas/projectsSchemas.ts
types/projectsTypes.ts
```

---

## 3. Customer Support / Ticketing Ontology™

### Routes → Features → Templates → Blocks / Workflows

| Route | Feature / Form | Client Island | Suspense Skeleton | Page Template | Existing Block(s) | Workflow File |
| --- | --- | --- | --- | --- | --- | --- |
| `/support/inbox` | `features/support/inboxFeature.tsx` | `features/support/inboxFeature.client.tsx` | `features/support/inboxSkeleton.tsx` | `components/templates/supportInboxTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/supportWorkflows.ts` |
| `/support/tickets/new` | `features/support/ticketNewForm.tsx` | — | — | — | — | `lib/workflows/supportWorkflows.ts` |
| `/support/tickets/[ticketId]` | `features/support/ticketFeature.tsx` | `features/support/ticketFeature.client.tsx` | `features/support/ticketSkeleton.tsx` | `components/templates/supportTicketTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/supportWorkflows.ts` |
| `/support/knowledge-base` | `features/support/knowledgeBaseFeature.tsx` | `features/support/knowledgeBaseFeature.client.tsx` | `features/support/knowledgeBaseSkeleton.tsx` | `components/templates/supportKnowledgeBaseTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/supportWorkflows.ts` |
| `/support/knowledge-base/new` | `features/support/knowledgeArticleNewForm.tsx` | — | — | — | — | `lib/workflows/supportWorkflows.ts` |
| `/support/knowledge-base/[articleId]` | `features/support/knowledgeArticleFeature.tsx` | `features/support/knowledgeArticleFeature.client.tsx` | `features/support/knowledgeArticleSkeleton.tsx` | `components/templates/supportKnowledgeArticleTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/supportWorkflows.ts` |
| `/support/knowledge-base/[articleId]/edit` | `features/support/knowledgeArticleEditForm.tsx` | — | — | — | — | `lib/workflows/supportWorkflows.ts` |
| `/support/analytics` | `features/support/supportAnalyticsFeature.tsx` | `features/support/supportAnalyticsFeature.client.tsx` | `features/support/supportAnalyticsSkeleton.tsx` | `components/templates/supportAnalyticsTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/supportWorkflows.ts` |

### Target Route Files

```text
app/(tenant)/support/inbox/page.tsx
app/(tenant)/support/tickets/new/page.tsx
app/(tenant)/support/tickets/[ticketId]/page.tsx
app/(tenant)/support/knowledge-base/page.tsx
app/(tenant)/support/knowledge-base/new/page.tsx
app/(tenant)/support/knowledge-base/[articleId]/page.tsx
app/(tenant)/support/knowledge-base/[articleId]/edit/page.tsx
app/(tenant)/support/analytics/page.tsx
```
### Target Feature Files

```text
features/support/inboxFeature.tsx
features/support/inboxFeature.client.tsx
features/support/inboxSkeleton.tsx
features/support/ticketNewForm.tsx
features/support/ticketFeature.tsx
features/support/ticketFeature.client.tsx
features/support/ticketSkeleton.tsx
features/support/knowledgeBaseFeature.tsx
features/support/knowledgeBaseFeature.client.tsx
features/support/knowledgeBaseSkeleton.tsx
features/support/knowledgeArticleNewForm.tsx
features/support/knowledgeArticleFeature.tsx
features/support/knowledgeArticleFeature.client.tsx
features/support/knowledgeArticleSkeleton.tsx
features/support/knowledgeArticleEditForm.tsx
features/support/supportAnalyticsFeature.tsx
features/support/supportAnalyticsFeature.client.tsx
features/support/supportAnalyticsSkeleton.tsx
```
### Target Page Template Files

```text
components/templates/supportAnalyticsTemplate.tsx
components/templates/supportInboxTemplate.tsx
components/templates/supportKnowledgeArticleTemplate.tsx
components/templates/supportKnowledgeBaseTemplate.tsx
components/templates/supportTicketTemplate.tsx
```
### Existing Block Files Used

```text
components/blocks/dashboard-layout.tsx
```
### Canonical Server / Schema / Type Files

```text
lib/actions/supportActions.ts
lib/fetchers/supportFetchers.ts
lib/workflows/supportWorkflows.ts
lib/db/selects/support.selects.ts
lib/db/dto/support.dto.ts
lib/db/transactions/support.tx.ts
lib/db/transactions/update-ticket-status.tx.ts
lib/authz/permissions.ts
lib/authz/policies.ts
lib/authz/resources.ts
lib/authz/roles.ts
schemas/supportSchemas.ts
types/supportTypes.ts
```

---

## 4. Marketing Automation & Analytics Ontology™

### Routes → Features → Templates → Blocks / Workflows

| Route | Feature / Form | Client Island | Suspense Skeleton | Page Template | Existing Block(s) | Workflow File |
| --- | --- | --- | --- | --- | --- | --- |
| `/marketing/analytics` | `features/marketing/marketingAnalyticsFeature.tsx` | `features/marketing/marketingAnalyticsFeature.client.tsx` | `features/marketing/marketingAnalyticsSkeleton.tsx` | `components/templates/marketingAnalyticsTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/marketingWorkflows.ts` |
| `/marketing/audiences` | `features/marketing/audiencesFeature.tsx` | `features/marketing/audiencesFeature.client.tsx` | `features/marketing/audiencesSkeleton.tsx` | `components/templates/marketingAudiencesTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/marketingWorkflows.ts` |
| `/marketing/audiences/new` | `features/marketing/audienceNewForm.tsx` | — | — | — | — | `lib/workflows/marketingWorkflows.ts` |
| `/marketing/audiences/[audienceId]` | `features/marketing/audienceFeature.tsx` | `features/marketing/audienceFeature.client.tsx` | `features/marketing/audienceSkeleton.tsx` | `components/templates/marketingAudienceDetailTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/marketingWorkflows.ts` |
| `/marketing/audiences/[audienceId]/edit` | `features/marketing/audienceEditForm.tsx` | — | — | — | — | `lib/workflows/marketingWorkflows.ts` |
| `/marketing/campaigns` | `features/marketing/campaignsFeature.tsx` | `features/marketing/campaignsFeature.client.tsx` | `features/marketing/campaignsSkeleton.tsx` | `components/templates/marketingCampaignsTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/marketingWorkflows.ts` |
| `/marketing/campaigns/new` | `features/marketing/campaignNewForm.tsx` | — | — | — | — | `lib/workflows/marketingWorkflows.ts` |
| `/marketing/campaigns/[campaignId]` | `features/marketing/campaignFeature.tsx` | `features/marketing/campaignFeature.client.tsx` | `features/marketing/campaignSkeleton.tsx` | `components/templates/marketingCampaignDetailTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/marketingWorkflows.ts` |
| `/marketing/campaigns/[campaignId]/edit` | `features/marketing/campaignEditForm.tsx` | — | — | — | — | `lib/workflows/marketingWorkflows.ts` |

### Target Route Files

```text
app/(tenant)/marketing/analytics/page.tsx
app/(tenant)/marketing/audiences/page.tsx
app/(tenant)/marketing/audiences/new/page.tsx
app/(tenant)/marketing/audiences/[audienceId]/page.tsx
app/(tenant)/marketing/audiences/[audienceId]/edit/page.tsx
app/(tenant)/marketing/campaigns/page.tsx
app/(tenant)/marketing/campaigns/new/page.tsx
app/(tenant)/marketing/campaigns/[campaignId]/page.tsx
app/(tenant)/marketing/campaigns/[campaignId]/edit/page.tsx
```
### Target Feature Files

```text
features/marketing/marketingAnalyticsFeature.tsx
features/marketing/marketingAnalyticsFeature.client.tsx
features/marketing/marketingAnalyticsSkeleton.tsx
features/marketing/audiencesFeature.tsx
features/marketing/audiencesFeature.client.tsx
features/marketing/audiencesSkeleton.tsx
features/marketing/audienceNewForm.tsx
features/marketing/audienceFeature.tsx
features/marketing/audienceFeature.client.tsx
features/marketing/audienceSkeleton.tsx
features/marketing/audienceEditForm.tsx
features/marketing/campaignsFeature.tsx
features/marketing/campaignsFeature.client.tsx
features/marketing/campaignsSkeleton.tsx
features/marketing/campaignNewForm.tsx
features/marketing/campaignFeature.tsx
features/marketing/campaignFeature.client.tsx
features/marketing/campaignSkeleton.tsx
features/marketing/campaignEditForm.tsx
```
### Target Page Template Files

```text
components/templates/marketingAnalyticsTemplate.tsx
components/templates/marketingAudienceDetailTemplate.tsx
components/templates/marketingAudiencesTemplate.tsx
components/templates/marketingCampaignDetailTemplate.tsx
components/templates/marketingCampaignsTemplate.tsx
```
### Existing Block Files Used

```text
components/blocks/dashboard-layout.tsx
```
### Canonical Server / Schema / Type Files

```text
lib/actions/marketingActions.ts
lib/fetchers/marketingFetchers.ts
lib/workflows/marketingWorkflows.ts
lib/db/selects/marketing.selects.ts
lib/db/dto/marketing.dto.ts
lib/db/transactions/marketing.tx.ts
lib/authz/permissions.ts
lib/authz/policies.ts
lib/authz/resources.ts
lib/authz/roles.ts
schemas/marketingSchemas.ts
types/marketingTypes.ts
```

---

## 5. Invoicing & Expense Tracker Ontology™

### Routes → Features → Templates → Blocks / Workflows

| Route | Feature / Form | Client Island | Suspense Skeleton | Page Template | Existing Block(s) | Workflow File |
| --- | --- | --- | --- | --- | --- | --- |
| `/invoices` | `features/invoicing/invoicesFeature.tsx` | `features/invoicing/invoicesFeature.client.tsx` | `features/invoicing/invoicesSkeleton.tsx` | `components/templates/invoicingInvoicesTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/invoicingWorkflows.ts` |
| `/invoices/new` | `features/invoicing/invoiceNewForm.tsx` | — | — | — | — | `lib/workflows/invoicingWorkflows.ts` |
| `/invoices/[invoiceId]` | `features/invoicing/invoiceFeature.tsx` | `features/invoicing/invoiceFeature.client.tsx` | `features/invoicing/invoiceSkeleton.tsx` | `components/templates/invoicingInvoiceDetailTemplate.tsx` | `components/blocks/invoice.tsx` | `lib/workflows/invoicingWorkflows.ts` |
| `/invoices/[invoiceId]/edit` | `features/invoicing/invoiceEditForm.tsx` | — | — | — | — | `lib/workflows/invoicingWorkflows.ts` |
| `/expenses` | `features/invoicing/expensesFeature.tsx` | `features/invoicing/expensesFeature.client.tsx` | `features/invoicing/expensesSkeleton.tsx` | `components/templates/invoicingExpensesTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/invoicingWorkflows.ts` |
| `/expenses/new` | `features/invoicing/expenseNewForm.tsx` | — | — | — | — | `lib/workflows/invoicingWorkflows.ts` |
| `/expenses/[expenseId]` | `features/invoicing/expenseFeature.tsx` | `features/invoicing/expenseFeature.client.tsx` | `features/invoicing/expenseSkeleton.tsx` | `components/templates/invoicingExpenseDetailTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/invoicingWorkflows.ts` |
| `/expenses/[expenseId]/edit` | `features/invoicing/expenseEditForm.tsx` | — | — | — | — | `lib/workflows/invoicingWorkflows.ts` |

### Target Route Files

```text
app/(tenant)/invoices/page.tsx
app/(tenant)/invoices/new/page.tsx
app/(tenant)/invoices/[invoiceId]/page.tsx
app/(tenant)/invoices/[invoiceId]/edit/page.tsx
app/(tenant)/expenses/page.tsx
app/(tenant)/expenses/new/page.tsx
app/(tenant)/expenses/[expenseId]/page.tsx
app/(tenant)/expenses/[expenseId]/edit/page.tsx
```
### Target Feature Files

```text
features/invoicing/invoicesFeature.tsx
features/invoicing/invoicesFeature.client.tsx
features/invoicing/invoicesSkeleton.tsx
features/invoicing/invoiceNewForm.tsx
features/invoicing/invoiceFeature.tsx
features/invoicing/invoiceFeature.client.tsx
features/invoicing/invoiceSkeleton.tsx
features/invoicing/invoiceEditForm.tsx
features/invoicing/expensesFeature.tsx
features/invoicing/expensesFeature.client.tsx
features/invoicing/expensesSkeleton.tsx
features/invoicing/expenseNewForm.tsx
features/invoicing/expenseFeature.tsx
features/invoicing/expenseFeature.client.tsx
features/invoicing/expenseSkeleton.tsx
features/invoicing/expenseEditForm.tsx
```
### Target Page Template Files

```text
components/templates/invoicingExpenseDetailTemplate.tsx
components/templates/invoicingExpensesTemplate.tsx
components/templates/invoicingInvoiceDetailTemplate.tsx
components/templates/invoicingInvoicesTemplate.tsx
```
### Existing Block Files Used

```text
components/blocks/dashboard-layout.tsx
components/blocks/invoice.tsx
```
### Canonical Server / Schema / Type Files

```text
lib/actions/invoicingActions.ts
lib/fetchers/invoicingFetchers.ts
lib/workflows/invoicingWorkflows.ts
lib/db/selects/invoicing.selects.ts
lib/db/dto/invoicing.dto.ts
lib/db/transactions/create-invoice.tx.ts
lib/db/transactions/invoicing.tx.ts
lib/db/transactions/update-invoice-status.tx.ts
lib/authz/permissions.ts
lib/authz/policies.ts
lib/authz/resources.ts
lib/authz/roles.ts
schemas/invoicingSchemas.ts
types/invoicingTypes.ts
```

---

## 6. Social Media Scheduler Ontology™

### Routes → Features → Templates → Blocks / Workflows

| Route | Feature / Form | Client Island | Suspense Skeleton | Page Template | Existing Block(s) | Workflow File |
| --- | --- | --- | --- | --- | --- | --- |
| `/social/calendar` | `features/social/calendarFeature.tsx` | `features/social/calendarFeature.client.tsx` | `features/social/calendarSkeleton.tsx` | `components/templates/socialCalendarTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/socialWorkflows.ts` |
| `/social/compose` | `features/social/composerFeature.tsx` | `features/social/composerFeature.client.tsx` | `features/social/composerSkeleton.tsx` | `components/templates/socialComposeTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/socialWorkflows.ts` |
| `/social/media` | `features/social/mediaLibraryFeature.tsx` | `features/social/mediaLibraryFeature.client.tsx` | `features/social/mediaLibrarySkeleton.tsx` | `components/templates/socialMediaTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/socialWorkflows.ts` |

### Target Route Files

```text
app/(tenant)/social/calendar/page.tsx
app/(tenant)/social/compose/page.tsx
app/(tenant)/social/media/page.tsx
```
### Target Feature Files

```text
features/social/calendarFeature.tsx
features/social/calendarFeature.client.tsx
features/social/calendarSkeleton.tsx
features/social/composerFeature.tsx
features/social/composerFeature.client.tsx
features/social/composerSkeleton.tsx
features/social/mediaLibraryFeature.tsx
features/social/mediaLibraryFeature.client.tsx
features/social/mediaLibrarySkeleton.tsx
```
### Target Page Template Files

```text
components/templates/socialCalendarTemplate.tsx
components/templates/socialComposeTemplate.tsx
components/templates/socialMediaTemplate.tsx
```
### Existing Block Files Used

```text
components/blocks/dashboard-layout.tsx
```
### Canonical Server / Schema / Type Files

```text
lib/actions/socialActions.ts
lib/fetchers/socialFetchers.ts
lib/workflows/socialWorkflows.ts
lib/db/selects/social.selects.ts
lib/db/dto/social.dto.ts
lib/db/transactions/schedule-social-post.tx.ts
lib/db/transactions/social.tx.ts
lib/authz/permissions.ts
lib/authz/policies.ts
lib/authz/resources.ts
lib/authz/roles.ts
schemas/socialSchemas.ts
types/socialTypes.ts
```

---

## 7. AI-Powered Wrapper / Micro-SaaS Ontology™

### Routes → Features → Templates → Blocks / Workflows

| Route | Feature / Form | Client Island | Suspense Skeleton | Page Template | Existing Block(s) | Workflow File |
| --- | --- | --- | --- | --- | --- | --- |
| `/ai` | `features/ai/aiGenerationFeature.tsx` | `features/ai/aiGenerationFeature.client.tsx` | `features/ai/aiGenerationSkeleton.tsx` | `components/templates/aiGenerationTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/aiWorkflows.ts` |
| `/ai/playground` | `features/ai/aiPlaygroundFeature.tsx` | `features/ai/aiPlaygroundFeature.client.tsx` | `features/ai/aiPlaygroundSkeleton.tsx` | `components/templates/aiPlaygroundTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/aiWorkflows.ts` |
| `/ai/usage` | `features/ai/aiUsageFeature.tsx` | `features/ai/aiUsageFeature.client.tsx` | `features/ai/aiUsageSkeleton.tsx` | `components/templates/aiUsageTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/aiWorkflows.ts` |

### Target Route Files

```text
app/(tenant)/ai/page.tsx
app/(tenant)/ai/playground/page.tsx
app/(tenant)/ai/usage/page.tsx
```
### Target Feature Files

```text
features/ai/aiGenerationFeature.tsx
features/ai/aiGenerationFeature.client.tsx
features/ai/aiGenerationSkeleton.tsx
features/ai/aiPlaygroundFeature.tsx
features/ai/aiPlaygroundFeature.client.tsx
features/ai/aiPlaygroundSkeleton.tsx
features/ai/aiUsageFeature.tsx
features/ai/aiUsageFeature.client.tsx
features/ai/aiUsageSkeleton.tsx
```
### Target Page Template Files

```text
components/templates/aiGenerationTemplate.tsx
components/templates/aiPlaygroundTemplate.tsx
components/templates/aiUsageTemplate.tsx
```
### Existing Block Files Used

```text
components/blocks/dashboard-layout.tsx
```
### Canonical Server / Schema / Type Files

```text
lib/actions/aiActions.ts
lib/fetchers/aiFetchers.ts
lib/workflows/aiWorkflows.ts
lib/db/selects/ai.selects.ts
lib/db/dto/ai.dto.ts
lib/db/transactions/ai.tx.ts
lib/db/transactions/complete-ai-generation.tx.ts
lib/authz/permissions.ts
lib/authz/policies.ts
lib/authz/resources.ts
lib/authz/roles.ts
schemas/aiSchemas.ts
types/aiTypes.ts
lib/integrations/hugging-face/client.ts
lib/integrations/hugging-face/embeddings.ts
lib/integrations/hugging-face/inference.ts
```

---

## 8. B2B Client Portal Ontology™

### Routes → Features → Templates → Blocks / Workflows

| Route | Feature / Form | Client Island | Suspense Skeleton | Page Template | Existing Block(s) | Workflow File |
| --- | --- | --- | --- | --- | --- | --- |
| `/portal` | `features/portal/portalFeature.tsx` | `features/portal/portalFeature.client.tsx` | `features/portal/portalSkeleton.tsx` | `components/templates/portalHomeTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/portalWorkflows.ts` |
| `/portal/billing` | `features/portal/billingFeature.tsx` | `features/portal/billingFeature.client.tsx` | `features/portal/billingSkeleton.tsx` | `components/templates/portalBillingTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/portalWorkflows.ts` |
| `/portal/documents` | `features/portal/documentsFeature.tsx` | `features/portal/documentsFeature.client.tsx` | `features/portal/documentsSkeleton.tsx` | `components/templates/portalDocumentsTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/portalWorkflows.ts` |
| `/portal/documents/[documentId]` | `features/portal/documentFeature.tsx` | `features/portal/documentFeature.client.tsx` | `features/portal/documentSkeleton.tsx` | `components/templates/portalDocumentDetailTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/portalWorkflows.ts` |

### Target Route Files

```text
app/(tenant)/portal/page.tsx
app/(tenant)/portal/billing/page.tsx
app/(tenant)/portal/documents/page.tsx
app/(tenant)/portal/documents/[documentId]/page.tsx
```
### Target Feature Files

```text
features/portal/portalFeature.tsx
features/portal/portalFeature.client.tsx
features/portal/portalSkeleton.tsx
features/portal/billingFeature.tsx
features/portal/billingFeature.client.tsx
features/portal/billingSkeleton.tsx
features/portal/documentsFeature.tsx
features/portal/documentsFeature.client.tsx
features/portal/documentsSkeleton.tsx
features/portal/documentFeature.tsx
features/portal/documentFeature.client.tsx
features/portal/documentSkeleton.tsx
```
### Target Page Template Files

```text
components/templates/portalBillingTemplate.tsx
components/templates/portalDocumentDetailTemplate.tsx
components/templates/portalDocumentsTemplate.tsx
components/templates/portalHomeTemplate.tsx
```
### Existing Block Files Used

```text
components/blocks/dashboard-layout.tsx
```
### Canonical Server / Schema / Type Files

```text
lib/actions/portalActions.ts
lib/fetchers/portalFetchers.ts
lib/workflows/portalWorkflows.ts
lib/db/selects/portal.selects.ts
lib/db/dto/portal.dto.ts
lib/db/transactions/add-portal-version.tx.ts
lib/db/transactions/portal.tx.ts
lib/authz/permissions.ts
lib/authz/policies.ts
lib/authz/resources.ts
lib/authz/roles.ts
schemas/portalSchemas.ts
types/portalTypes.ts
lib/integrations/vercel-blob/client.ts
lib/integrations/vercel-blob/upload.ts
lib/integrations/vercel-blob/delete.ts
```

---

## 9. Internal Tools / Admin Portal Ontology™

### Routes → Features → Templates → Blocks / Workflows

| Route | Feature / Form | Client Island | Suspense Skeleton | Page Template | Existing Block(s) | Workflow File |
| --- | --- | --- | --- | --- | --- | --- |
| `/admin/audit` | `features/admin/adminAuditFeature.tsx` | `features/admin/adminAuditFeature.client.tsx` | `features/admin/adminAuditSkeleton.tsx` | `components/templates/adminAuditTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/adminWorkflows.ts` |
| `/admin/records` | `features/admin/adminRecordsFeature.tsx` | `features/admin/adminRecordsFeature.client.tsx` | `features/admin/adminRecordsSkeleton.tsx` | `components/templates/adminRecordsTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/adminWorkflows.ts` |
| `/admin/records/[recordId]` | `features/admin/adminRecordDetailFeature.tsx` | `features/admin/adminRecordDetailFeature.client.tsx` | `features/admin/adminRecordDetailSkeleton.tsx` | `components/templates/adminRecordDetailTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/adminWorkflows.ts` |
| `/admin/users` | `features/admin/adminUsersFeature.tsx` | `features/admin/adminUsersFeature.client.tsx` | `features/admin/adminUsersSkeleton.tsx` | `components/templates/adminUsersTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/adminWorkflows.ts` |
| `/admin/users/new` | `features/admin/adminNewUserForm.tsx` | — | — | — | — | `lib/workflows/adminWorkflows.ts` |
| `/admin/users/[userId]` | `features/admin/adminUserDetailFeature.tsx` | `features/admin/adminUserDetailFeature.client.tsx` | `features/admin/adminUserDetailSkeleton.tsx` | `components/templates/adminUserDetailTemplate.tsx` | `components/blocks/dashboard-layout.tsx` | `lib/workflows/adminWorkflows.ts` |
| `/admin/users/[userId]/edit` | `features/admin/adminEditUserForm.tsx` | — | — | — | — | `lib/workflows/adminWorkflows.ts` |

### Target Route Files

```text
app/(tenant)/admin/audit/page.tsx
app/(tenant)/admin/records/page.tsx
app/(tenant)/admin/records/[recordId]/page.tsx
app/(tenant)/admin/users/page.tsx
app/(tenant)/admin/users/new/page.tsx
app/(tenant)/admin/users/[userId]/page.tsx
app/(tenant)/admin/users/[userId]/edit/page.tsx
```
### Target Feature Files

```text
features/admin/adminAuditFeature.tsx
features/admin/adminAuditFeature.client.tsx
features/admin/adminAuditSkeleton.tsx
features/admin/adminRecordsFeature.tsx
features/admin/adminRecordsFeature.client.tsx
features/admin/adminRecordsSkeleton.tsx
features/admin/adminRecordDetailFeature.tsx
features/admin/adminRecordDetailFeature.client.tsx
features/admin/adminRecordDetailSkeleton.tsx
features/admin/adminUsersFeature.tsx
features/admin/adminUsersFeature.client.tsx
features/admin/adminUsersSkeleton.tsx
features/admin/adminNewUserForm.tsx
features/admin/adminUserDetailFeature.tsx
features/admin/adminUserDetailFeature.client.tsx
features/admin/adminUserDetailSkeleton.tsx
features/admin/adminEditUserForm.tsx
```
### Target Page Template Files

```text
components/templates/adminAuditTemplate.tsx
components/templates/adminRecordDetailTemplate.tsx
components/templates/adminRecordsTemplate.tsx
components/templates/adminUserDetailTemplate.tsx
components/templates/adminUsersTemplate.tsx
```
### Existing Block Files Used

```text
components/blocks/dashboard-layout.tsx
```
### Canonical Server / Schema / Type Files

```text
lib/actions/adminActions.ts
lib/fetchers/adminFetchers.ts
lib/workflows/adminWorkflows.ts
lib/db/selects/admin.selects.ts
lib/db/dto/admin.dto.ts
lib/db/transactions/admin.tx.ts
lib/authz/permissions.ts
lib/authz/policies.ts
lib/authz/resources.ts
lib/authz/roles.ts
schemas/adminSchemas.ts
types/adminTypes.ts
```

---

# Shared Existing Component Inventory

### Existing Block Files — unchanged

```text
components/blocks/auth-forms.tsx
components/blocks/bento-grid.tsx
components/blocks/changelog-section.tsx
components/blocks/comparison-table.tsx
components/blocks/contact-section.tsx
components/blocks/cta-section.tsx
components/blocks/dashboard-layout.tsx
components/blocks/error-pages.tsx
components/blocks/faq-section.tsx
components/blocks/feature-grid.tsx
components/blocks/footer-section.tsx
components/blocks/hero-section.tsx
components/blocks/invoice.tsx
components/blocks/logo-cloud.tsx
components/blocks/onboarding-flow.tsx
components/blocks/pricing-section.tsx
components/blocks/settings-page.tsx
components/blocks/stats-section.tsx
components/blocks/team-section.tsx
components/blocks/testimonials.tsx
```

### Existing Shell Files — unchanged

```text
components/shells/auth-shell.tsx
components/shells/portal-shell.tsx
components/shells/public-shell.tsx
components/shells/tenant-shell.tsx
```

### Existing UI / Chart Primitives — unchanged

```text
components/ui/*
components/chart/*
```

### Canonical Shared Lib Files — unchanged

```text
lib/auth/auth.ts
lib/auth/clerk-webhooks.ts
lib/auth/clerk.ts
lib/auth/redirects.ts
lib/cache/invalidate.ts
lib/cache/life.ts
lib/cache/tags.ts
lib/constants/limits.ts
lib/constants/pagination.ts
lib/utils/chartExport.ts
lib/utils/cn.ts
lib/utils/dates.ts
lib/utils/mathCurves.ts
lib/utils/money.ts
lib/utils/motionCore.ts
lib/utils/strings.ts
```

### Canonical Integration Files — unchanged

```text
lib/integrations/status.ts
lib/integrations/cloudinary/client.ts
lib/integrations/cloudinary/transformations.ts
lib/integrations/cloudinary/upload.ts
lib/integrations/hugging-face/client.ts
lib/integrations/hugging-face/embeddings.ts
lib/integrations/hugging-face/inference.ts
lib/integrations/sendgrid/client.ts
lib/integrations/sendgrid/email.ts
lib/integrations/sendgrid/webhooks.ts
lib/integrations/stripe/checkout.ts
lib/integrations/stripe/client.ts
lib/integrations/stripe/portal.ts
lib/integrations/stripe/subscriptions.ts
lib/integrations/stripe/webhooks.ts
lib/integrations/vercel-blob/client.ts
lib/integrations/vercel-blob/delete.ts
lib/integrations/vercel-blob/upload.ts
```
