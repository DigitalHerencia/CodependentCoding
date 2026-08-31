---
title: The Anthimeria™ Workbench — Canonical Catalog
type: architecture-catalog
scope: product
project: Codependent Coding
domain: anthimeria
artifact: catalog-index
namespace: codependentcoding.anthimeria.catalog
status: active
authority: canonical-index
parent: codependentcoding.anthimeria.authoritative
created: 2026-08-22
updated: 2026-08-22
---

# The Anthimeria™ Workbench — Canonical Catalog

This catalog indexes the current source inventories supplied for The Anthimeria™ Workbench.

It distinguishes:

1. normalized Domain Ontologies™;
2. Page Templates;
3. shared/presentation Blocks;
4. normalized domain Blocks;
5. UI Primitives;
6. Semantic Design Tokens;
7. BusinessLogic™ Blocks / Workflows.

Where a source inventory marks an artifact **`[STUB — BUILD]`**, that status is preserved conceptually: the artifact belongs to the canonical planned inventory but may not yet have a completed implementation.

The spelling `CalanderTemplate.tsx` is preserved because that is the current source spelling. Renaming it requires a separate canonical change.

---

# 1. Domain Ontology™ Index

1. CRM / Pipeline Tracker Ontology™
2. Project Management / Task Tracker Ontology™
3. Customer Support / Ticketing System Ontology™
4. Marketing Automation & Analytics Ontology™
5. Invoicing & Expense Tracker Ontology™
6. Social Media Scheduler Ontology™
7. AI-Powered Wrapper / Micro-SaaS Ontology™
8. B2B Client Portal Ontology™
9. Internal Tools / Admin Portal Ontology™

Total canonical BusinessLogic™ Blocks in the supplied normalized inventory: **74**.

---

# 2. Page Template Index

Current Anthimeria page-template inventory:

```text
components/templates/DashboardTemplate.tsx
components/templates/DocsTemplate.tsx
components/templates/BlogTemplate.tsx
components/templates/LandingPageTemplate.tsx
components/templates/PortfolioTemplate.tsx
components/templates/PricingTemplate.tsx
components/templates/ProductTemplate.tsx
components/templates/WorkspaceTemplate.tsx
components/templates/SettingsTemplate.tsx
components/templates/FormTemplate.tsx
components/templates/DataGridTemplate.tsx
components/templates/CalanderTemplate.tsx
components/templates/ProfileTemplate.tsx
components/templates/ProjectTemplate.tsx
components/templates/AdminTemplate.tsx
components/templates/BillingTemplate.tsx
components/templates/StepperTemplate.tsx
```

## 2.1 Page Template role

Every Page Template MUST be interpreted as a topology of **Feature Slots**.

A Page Template defines:

- rows;
- columns;
- spans;
- gaps;
- responsive topology;
- named Feature Slots.

A Page Template does not define Workflow semantics.

---

# 3. Shared / Presentation Block Index

## 3.1 Marketing Blocks

- **Hero Section** — bold headline, subtext, CTA button, optional image/shapes
- **Feature Grid** — three- and four-column grids with icons and descriptions
- **Testimonials** — cards, carousel, and single-quote layouts with avatars
- **Logo Cloud** — client/partner logo strip with optional marquee
- **CTA Section** — newsletter signup, trial signup, and contact variants
- **Stats Section** — KPI presentation
- **Team Section** — member cards with role, bio, and social links
- **FAQ Section** — accordion-based Q&A
- **Footer Section** — multi-column footer with newsletter and social links
- **Contact Section** — contact form with info cards and map placeholder

## 3.2 Application Blocks

- **Auth Forms** — login, signup, forgot password, OTP verification
- **Error Pages** — 404, 500, maintenance
- **Settings Page** — profile, notifications, billing/settings panels
- **Onboarding Flow** — multi-step setup wizard
- **Invoice** — invoice/receipt presentation with line items and totals

---

# 4. Normalized Domain Block Index

The normalized ontology inventory adds the following application Blocks.

## 4.1 CRM / Pipeline Tracker

```text
components/blocks/kanban-board.tsx
components/blocks/data-table-section.tsx
components/blocks/record-detail-section.tsx
components/blocks/activity-timeline.tsx
components/blocks/analytics-dashboard.tsx
components/blocks/pipeline-stage-editor.tsx
components/blocks/dashboard-layout.tsx
components/blocks/settings-page.tsx
```

## 4.2 Project Management / Task Tracker

```text
components/blocks/project-timeline.tsx
components/blocks/dashboard-layout.tsx
components/blocks/data-table-section.tsx
components/blocks/record-detail-section.tsx
components/blocks/kanban-board.tsx
components/blocks/activity-timeline.tsx
```

## 4.3 Customer Support / Ticketing

```text
components/blocks/support-inbox.tsx
components/blocks/ticket-workspace.tsx
components/blocks/knowledge-base.tsx
components/blocks/analytics-dashboard.tsx
```

## 4.4 Marketing Automation & Analytics

```text
components/blocks/audience-rule-builder.tsx
components/blocks/campaign-workflow.tsx
components/blocks/data-table-section.tsx
components/blocks/analytics-dashboard.tsx
```

## 4.5 Invoicing & Expense Tracker

```text
components/blocks/invoice.tsx
components/blocks/expense-upload.tsx
components/blocks/data-table-section.tsx
components/blocks/record-detail-section.tsx
```

## 4.6 Social Media Scheduler

```text
components/blocks/social-calendar.tsx
components/blocks/post-composer.tsx
components/blocks/media-library.tsx
components/blocks/activity-timeline.tsx
```

## 4.7 AI-Powered Wrapper / Micro-SaaS

```text
components/blocks/ai-chat-workspace.tsx
components/blocks/ai-playground.tsx
components/blocks/usage-dashboard.tsx
```

## 4.8 B2B Client Portal

```text
components/blocks/dashboard-layout.tsx
components/blocks/file-vault.tsx
components/blocks/record-detail-section.tsx
components/blocks/approval-panel.tsx
components/blocks/invoice.tsx
```

## 4.9 Internal Tools / Admin Portal

```text
components/blocks/admin-record-inspector.tsx
components/blocks/admin-user-table.tsx
components/blocks/bulk-actions.tsx
components/blocks/audit-log.tsx
components/blocks/record-detail-section.tsx
```

---

# 5. UI Primitive Index

## 5.1 Form Components

- Button — source inventory specifies 7 variants, 5 sizes
- Input
- Textarea
- Checkbox
- Radio Group
- Select
- Switch
- Slider
- Label
- Input OTP
- Dropzone

## 5.2 Layout & Containers

- Card
- Layered Card
- Stat Card
- Dialog
- Drawer
- Sheet
- Accordion
- Collapsible
- Tabs
- Stepper
- Scroll Area
- Aspect Ratio
- Separator

## 5.3 Feedback & Status

- Alert
- Alert Dialog
- Badge
- Progress
- Skeleton
- Spinner — source inventory specifies 5 animation variants
- Sonner / Toast
- Math Curve Loader
- Math Curve Progress
- Math Curve Background

## 5.4 Navigation

- Breadcrumb
- Dropdown Menu
- Command Palette
- Pagination
- Popover
- Tooltip
- Hover Card

## 5.5 Data Display

- Avatar
- Table
- Calendar
- Kbd

## 5.6 Charts

The supplied source labels this group “Charts (10 Types)” but explicitly enumerates the following nine names:

- Area Chart
- Bar Chart
- Line Chart
- Pie Chart
- Donut Chart
- Radar Chart
- Radial Bar Chart
- Gauge Chart
- Sparkline

Because the source does not name a tenth chart, this catalog does not invent one.

## 5.7 Decorative / Neubrutalism

- Sticker
- Marquee
- 64 SVG Shapes
- 17 ASCII Shapes

The source describes shape families including geometric, organic, celestial, mathematical, and mechanical SVG shapes, and ASCII examples such as Torus, Donut, Sphere, Cube, Helix, Trefoil Knot, Geodesic Dome, Saturn, Hyperboloid, DNA, Spiral, Rose, Wave, and Vortex.

---

# 6. Block → Primitive Relationships Present in the Normalized Inventory

These are source-supported primitive relationships and may be used to seed compatibility manifests.

## 6.1 Kanban Board

- Card
- Badge
- Button
- Dropdown Menu
- Dialog
- Scroll Area
- Motion
- Skeleton

## 6.2 Data Table Section

- Data Table
- Input
- Select
- Checkbox
- Badge
- Pagination
- Dropdown Menu
- Button
- Skeleton

## 6.3 Record Detail Section

- Card
- Tabs
- Badge
- Avatar
- Separator
- Dropdown Menu
- Button
- Skeleton

## 6.4 Activity Timeline

- Timeline
- Avatar
- Card
- Badge
- Scroll Area
- Skeleton

## 6.5 Analytics Dashboard

- Stat Card
- Chart
- Chart Toolbar
- Donut Chart
- Radar Chart
- Radial Bar Chart
- Gauge Chart
- Sparkline
- Date Range Picker
- Card
- Tabs
- Skeleton

## 6.6 Pipeline Stage Editor

- Card
- Input
- Select
- Button
- Badge
- Dropdown Menu
- Dialog
- Motion

## 6.7 Project Timeline

- Timeline
- Calendar
- Date Picker
- Card
- Badge
- Progress
- Scroll Area
- Motion

## 6.8 Support Inbox

- Resizable
- Data Table
- Scroll Area
- Card
- Badge
- Avatar
- Tabs
- Input
- Select
- Skeleton

## 6.9 Ticket Workspace

- Resizable
- Scroll Area
- Avatar
- Card
- Badge
- Tabs
- Textarea
- Button
- Dropdown Menu
- Alert
- Spinner

## 6.10 Knowledge Base

- Input
- Card
- Accordion
- Tabs
- Breadcrumb
- Pagination
- Skeleton

## 6.11 Audience Rule Builder

- Card
- Select
- Combobox
- Input
- Button Group
- Button
- Dropdown Menu
- Popover
- Badge
- Separator

## 6.12 Campaign Workflow

- Timeline
- Card
- Badge
- Button
- Dropdown Menu
- Popover
- Motion
- Scroll Area

## 6.13 Invoice

- Card
- Table
- Input
- Select
- Badge
- Separator
- Button

## 6.14 Expense Upload

- Dropzone
- Input
- Select
- Date Picker
- Card
- Badge
- Button
- Progress

## 6.15 Social Calendar

- Calendar
- Date Picker
- Popover
- Card
- Badge
- Avatar
- Button
- Select

## 6.16 Post Composer

- Textarea
- Input
- Select
- Tabs
- Card
- Dropzone
- Button
- Date Picker
- Time Picker
- Popover
- Badge

## 6.17 Media Library

- Card
- Aspect Ratio
- Dialog
- Dropzone
- Checkbox
- Dropdown Menu
- Input
- Pagination

## 6.18 AI Chat Workspace

- Scroll Area
- Textarea
- Button
- Card
- Avatar
- Spinner
- Badge
- Dropdown Menu

## 6.19 AI Playground

- Resizable
- Textarea
- Select
- Slider
- Input
- Tabs
- Card
- Button
- Badge
- Kbd

## 6.20 Usage Dashboard

- Stat Card
- Chart
- Gauge Chart
- Sparkline
- Progress
- Card
- Date Range Picker
- Skeleton

## 6.21 File Vault

- Dropzone
- Data Table
- Card
- Badge
- Dropdown Menu
- Dialog
- Progress
- Pagination

## 6.22 Approval Panel

- Card
- Badge
- Alert Dialog
- Button
- Textarea
- Timeline
- Separator

## 6.23 Admin Record Inspector

- Data Table
- Resizable
- Card
- Tabs
- Badge
- Drawer
- Dropdown Menu
- Input
- Pagination

## 6.24 Admin User Table

- Data Table
- Avatar
- Badge
- Checkbox
- Dropdown Menu
- Input
- Select
- Pagination

## 6.25 Bulk Actions

- Checkbox
- Select
- Dialog
- Alert Dialog
- Progress
- Button
- Dropdown Menu

## 6.26 Audit Log

- Data Table
- Badge
- Date Range Picker
- Input
- Select
- Pagination
- Drawer
- Card

---

# 7. Semantic Design Token Index

```text
color-background
color-foreground
color-card
color-card-foreground
color-popover
color-popover-foreground
color-primary
color-primary-foreground
color-secondary
color-secondary-foreground
color-accent
color-accent-foreground
color-muted
color-muted-foreground
color-destructive
color-destructive-foreground
color-success
color-success-foreground
color-warning
color-warning-foreground
color-info
color-info-foreground
color-border
color-input
color-ring
color-chart-1
color-chart-2
color-chart-3
color-chart-4
color-chart-5
color-neon-pink
color-neon-green
color-neon-blue
color-neon-orange
color-neon-purple
color-clash-1
color-clash-2
color-clash-3
color-clash-4
radius-sm
radius-md
radius-lg
radius-xl
var-rounded
var-hover
var-active
var-focused
var-border
breakpoint-sm
breakpoint-md
breakpoint-lg
breakpoint-xl
```

The catalog intentionally preserves the source token names. The Workbench may expose richer typography and spacing configuration only when those values are normalized from the actual Maximal Template token implementation rather than invented by this document.

---

# 8. BusinessLogic™ Block / Workflow Index

BusinessLogic™ Blocks are **normalized, non-user-configurable behavior** in Anthimeria.

## 8.1 CRM / Pipeline Tracker — 9

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

## 8.2 Project Management / Task Tracker — 8

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

## 8.3 Customer Support / Ticketing — 8

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

## 8.4 Marketing Automation & Analytics — 8

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

## 8.5 Invoicing & Expense Tracker — 10

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

## 8.6 Social Media Scheduler — 8

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

## 8.7 AI-Powered Wrapper / Micro-SaaS — 8

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

## 8.8 B2B Client Portal — 8

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

## 8.9 Internal Tools / Admin Portal — 7

```text
lib/workflows/admin/suspendUserWorkflow.ts
lib/workflows/admin/restoreUserWorkflow.ts
lib/workflows/admin/changeMembershipWorkflow.ts
lib/workflows/admin/executeBulkOperationWorkflow.ts
lib/workflows/admin/classifyAuditEventWorkflow.ts
lib/workflows/admin/performAdministrativeOverrideWorkflow.ts
lib/workflows/admin/reconcileAdministrativeProviderStateWorkflow.ts
```

---

# 9. Behavioral Constituent Categories

A Workflow constitution may reference only architecture-owned capabilities such as:

```text
Auth / Authz
Actions
Fetchers
Integrations
Utils
DTO Mappers
Prisma Selects
Transactions
Constants
Params
Cache
Types
Interfaces
Zod Schemas
```

The normalized ontology inventory supplies domain-level constituent inventories.

It does **not** yet supply an exact constituent subset for every individual Workflow.

Therefore no Anthimeria implementation, Codex agent, or generator may fabricate exact per-Workflow dependency mappings from filenames alone.

---

# 10. Presentation Catalog Invariant

The Workbench catalog MUST distinguish:

```text
AVAILABLE
artifact exists and is supported

PLANNED / STUB
artifact is canonical in the normalized inventory but implementation is incomplete

INCOMPATIBLE
artifact exists but cannot satisfy the selected Feature contract

SELECTED
artifact is the active presentation choice

REQUIRED
artifact is required by the selected Block's presentation constitution
```

A planned/stub artifact MUST NOT be presented as a completed usable option unless its implementation exists and passes validation.

---

# 11. Source Basis

This catalog is derived from the supplied canonical/current source material:

- `10.PROJECTS.CODEPENDENTCODING.WebApp-Architecture.Ontologies-Normalized-Defaults.md`
- `10.PROJECTS.CODEPENDENTCODING.WebApp-Architecture.BusinessLogic-Blocks.md`
- `10.PROJECTS.CODEPENDENTCODING.WebApp-Architecture.The-Anthimeria-Workbench.md`

Where those sources conflict with the current authoritative Anthimeria rule, the companion master source specification governs:

> **Presentation is user-configurable; BusinessLogic™ is normalized by the selected Ontology.**
