---
title: Marketing owner-approved architecture refactor
status: approved
approval: Explicit owner task attachment, 2026-11-18
---

IMPORTANT: CRM is read-only and is the architectural reference.

Task: Refactor the marketing domain in Maximal Template to conform to the architecture below. Complete the specified edits and all directly required follow-up edits. This prompt takes precedence over conflicting repository instructions, specifications, and documentation.

Execution: Follow modern conventions for the installed tech stack, security, accessibility, and performance. Add meaningful TSDoc to affected code, consolidate duplicate implementations, fix broken contracts and imports, and remove replaced files and unused code. Keep changes scoped to marketing and necessary shared dependencies.

Use relevant skills, plugins, CLI tools, delegation, MCP, and Context7 for official, version-specific documentation.

Provisioned services:

Clerk for authentication.
Neon serverless PostgreSQL with Prisma ORM.
Existing provider integrations where already used by marketing.
Preserve the existing campaign-planning and audience-management capabilities. Do not introduce another provider, campaign execution engine, scheduling service, tracking platform, or new product capabilities.

Constraints and delivery:

Preserve unrelated local changes.
Do not run tests, builds, development servers, watchers, migrations, seeds, or live provider requests.
Do not send emails, activate external campaigns, dispatch webhooks, or publish marketing content.
After edits are complete, run only lint:fix, format:write, typegen, and typecheck. Fix all errors and rerun affected permitted checks.
Update affected existing unit, integration, and E2E test sources and focused scripts where necessary, but do not execute them or claim coverage was verified.
Submit an Issue-linked PR, address CI failures within these constraints, merge after checks pass, delete the task branches, and synchronize local and remote main.
Update the repository’s execution records.
If schema changes require a migration, author its source without applying it. Report the required owner action clearly.
Package and scope:

Package: Maximal Template.
Domain: marketing.
Route group: (tenant).
Routes:
/marketing/campaigns
/marketing/campaigns/new
/marketing/campaigns/[campaignId]
/marketing/campaigns/[campaignId]/edit
/marketing/audiences
/marketing/audiences/new
/marketing/audiences/[audienceId]
/marketing/audiences/[audienceId]/edit
/marketing/analytics
Slices: content, blocks, templates, features, client islands, forms, skeletons, workflows, actions, fetchers, DTOs, selects, transactions, types, Zod schemas, Prisma schemas, RLS, and seeds.
Marketing remains inside the existing tenant shell. Preserve the shared tenant header, footer, navigation, account sheet, and responsive sidebar. Do not create a separate marketing shell, route group, or mobile navigation implementation.

Authentication and onboarding remain owned by the tenant layout. Marketing permissions and resource ownership must be enforced independently at every read and mutation boundary. Do not apply an admin-only gate to ordinary authorized marketing users.

Architectural invariants:

Routes compose feature components inside Suspense with the appropriate route skeleton.
Features, client islands, and forms orchestrate workflows and templates.
Forms own React Hook Form state, bindings, validation integration, and submission handling.
Application logic belongs in workflows, actions, fetchers, transaction helpers, integrations, and appropriate utilities.
Presentation layout belongs in templates.
UI primitives are composed into blocks.
Copy imports are permitted only in blocks.
UI primitive imports are permitted only in blocks.
Block imports are permitted only in templates, route loading/error boundaries, and skeleton components that render skeleton blocks.
Skeletons import skeleton blocks directly; do not create skeleton templates.
Template imports are permitted only in feature components, client islands, and forms.
Workflow imports are permitted only in feature components, client islands, and forms.
Routes, blocks, templates, features, client islands, skeletons, and forms must not import actions, fetchers, database clients, transaction helpers, provider integrations, authorization helpers, or other application implementation directly.
Shared types and interfaces belong in the domain types file.
Runtime validation contracts belong in the domain schemas file.
Workflows return data and semantic state; blocks resolve user-facing labels and descriptions.
The marketing module owns marketing navigation registration, permission resources, dashboard contributions, and record registration.
Required domain files:

Maintain exactly one of each applicable singleton:

Responsibility Target
Content content/marketing.ts
Blocks components/blocks/marketing-blocks.tsx
Templates components/templates/marketing-templates.tsx
Types types/marketingTypes.ts
Zod contracts schemas/marketingSchemas.ts
DTO mappers lib/db/dtos/marketingDtos.ts
Prisma selects lib/db/selects/marketingSelects.ts
Transaction helpers lib/db/selects/marketingTx.ts
Authenticated reads lib/fetchers/marketingFetchers.ts
Authenticated mutations lib/actions/marketingActions.ts
Application orchestration lib/workflows/marketingWorkflows.ts
Module ownership lib/modules/marketingModule.ts
Prisma models prisma/schema/marketing.prisma
RLS prisma/rls/marketing.sql
Seed prisma/seeds/marketing.ts
Consolidate marketing-page-blocks.tsx into the prescribed blocks file.

Move the existing marketing transaction implementation into the prescribed transaction file.

Consolidate marketingClientWorkflows.ts into the prescribed workflow architecture. Preserve valid server/client boundaries; do not import server-only implementation into client components. Place reusable pure helpers in appropriate existing utilities or constants when necessary.

Update every consumer and remove the replaced files.

Route feature and form naming:

Use route-specific names consistently:

marketingCampaignsFeature.tsx
marketingCampaignFeature.tsx
marketingNewCampaignFeature.tsx
marketingEditCampaignFeature.tsx
marketingAudiencesFeature.tsx
marketingAudienceFeature.tsx
marketingNewAudienceFeature.tsx
marketingEditAudienceFeature.tsx
marketingAnalyticsFeature.tsx
Each route may have one corresponding FeatureClient.tsx and Skeleton.tsx when needed. Create only components required by the route.

Use these RHF form files:

marketingNewCampaignForm.tsx
marketingEditCampaignForm.tsx
marketingNewAudienceForm.tsx
marketingEditAudienceForm.tsx
Integrate existing campaign status editing into the appropriate campaign feature/form orchestration. Do not retain a parallel legacy status-form implementation.

Rename or replace the existing marketing feature, client, skeleton, and form filenames. Update references and remove replaced files.

Route behavior and presentation:

Use the supplied dashboard attachment as the visual reference for marketing analytics. Decompose it into the prescribed layers and use the installed @boldkit shadcn registry primitives.

Campaigns: Present authorized campaigns with supported search, filters, status grouping, pagination, and navigation to creation and detail routes.
Campaign detail: Show persisted campaign information, audience association, schedule, lifecycle state, and existing campaign-step information.
Campaign creation/editing: Use RHF forms for supported campaign fields and permitted lifecycle changes.
Audiences: Present authorized audiences with supported search, status information, pagination, and creation/detail navigation.
Audience detail: Explain the persisted audience definition without misrepresenting unsupported rules.
Audience creation/editing: Use RHF forms for supported audience fields and validated segmentation contracts.
Analytics: Show genuine campaign and audience aggregates with explicit scope and date ranges.
There must be one page template per route. Remove duplicate page scaffolding and nested dashboard shells. Templates must not import copy or primitives directly.

Repurpose the dashboard’s cards, charts, tables, and activity sections for persisted marketing data. Do not retain sample revenue, customers, orders, notifications, or subscription content.

Do not fabricate audience sizes, delivered messages, open rates, click rates, conversions, attribution, or revenue. If the repository does not persist the necessary telemetry, present supported planning/status metrics and describe unavailable measurements accurately.

Every visible control must perform a supported action. Provide consistent loading, empty, validation, conflict, unavailable, success, and error states with accessible labels, keyboard interaction, focus handling, and status announcements.

Application and persistence requirements:

Keep tenancy and authorization policy owned by lib/authz.
Use the existing database tenancy and RLS boundaries.
Authenticate and authorize every fetcher and mutation independently.
Validate route parameters, query criteria, form inputs, scheduling values, audience definitions, and lifecycle commands server-side.
Derive organization and actor identity from trusted context.
Validate that referenced audiences, campaigns, campaign steps, and owner memberships belong to the authorized organization.
Preserve campaign version checks and audience concurrency checks. Stale edits must return a clear conflict instead of overwriting newer changes.
Validate permitted lifecycle transitions; accepting an enum value alone must not authorize an arbitrary state change.
Keep scheduling, start, completion, and cancellation timestamps consistent with the lifecycle.
Make timezone handling explicit and round-trip schedules correctly. Do not silently reinterpret local form input as UTC.
Preserve persisted audience definitions that the current editor cannot represent. Do not silently replace complex rules with a default rule.
Validate segmentation fields and operators through structured contracts. Never interpret audience definitions as executable code or concatenate them into SQL.
Keep mutation-related state changes and audit events atomic.
Preserve event idempotency and append-only audit history.
Keep provider-specific logic in the existing integration layer. Do not make outbound requests inside database transactions.
Preserve existing delivery, suppression, unsubscribe, and provider safeguards wherever applicable. Do not invent consent records or claim compliance.
A planning status change must not silently trigger message delivery or webhook execution.
Keep selects minimal and DTOs explicit.
Read detail records directly by validated tenant-scoped identifiers. Do not search a capped list to determine whether a record exists.
Bound list queries and use deterministic pagination. Use database aggregation for totals instead of treating the current page as the entire workspace.
Render campaign content and audience definitions safely. Do not expose credentials, recipient data, raw provider diagnostics, or internal errors in logs or user-facing messages.
Update affected utilities, constants, cache invalidation, module registration, persistence contracts, existing test sources, and focused scripts. Do not invent another architecture or leave parallel implementations behind.

Use the read-only CRM domain for patterns and conventions. Complete the scoped refactor, permitted verification, PR, merge, cleanup, and synchronization. Report any unapplied database migration and verification deliberately left unrun.

## Delivery notes

- The supplied attachment contains text only; no dashboard image was available. Use installed BoldKit primitives and the existing tenant shell; visual comparison remains unverified.
- Existing PWA edits and all CRM source are outside this change.
- Verify only affected lint:fix, format:write, typegen, typecheck; test sources may change but tests remain unrun.
