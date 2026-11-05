# Architecture review — 2026-11-03

## Remediation handoff

All 23 original findings (A01–A23) are addressed in source through local commit `7a480510d7acf0075fb2f99132f5100c4b2549ce` on `main`. The original review below is retained as historical evidence.

The changes cover server boundary ownership/validation/results, active RHF forms, pure aggregated presentation, content ownership, DTOs, optional AI/limiting, administrator-only integration status, production configuration validation, flat admin routes with recent MFA, profile/review onboarding and approval, Clerk identity keys, provider boundaries, server source loading, schema-derived contracts, naming, primitive variants, server-only guards, React Compiler and HSTS. Generator templates and copied guidance were updated with the application.

Corrections to the original assessment: the reference does not require a separate administrator database URL/role. AI and rate limiting remain optional under the owner's later instructions. Exact pnpm 12.3.4 is retained because current Vercel documentation lists pnpm 12 support; native TypeScript 7.0.2 uses the documented TypeScript 6 API compatibility alias.

Executed: affected-file format write and lint fix in both projects; root and template type generation/typecheck; two onboarding tests; four organization-switching tests; focused architecture boundary/filename cases. All passed. The onboarding and newly forbidden import regressions failed against their previous implementations before passing against their replacements.

Not run: final/full tests, builds, development servers, pushes, deployments or live migrations. An optional scaffold-test command was rejected by automatic approval review and did not execute. It remains deferred to the owner's final test run.

Owner gates: review/apply required source migrations (`profile_onboarding` and `clerk_identity_primary_key`) before using the new source with an older database; verify Clerk administrator MFA enrollment and installed production-provider credentials; run final tests/builds and push personally. Source checks do not establish live database security, runtime behavior or deployment readiness. The network observations below are historical.

Final verification commands, when the owner is ready:

```powershell
pnpm test
pnpm --dir packages/maximal-template test
pnpm build
pnpm --dir packages/maximal-template build
```

References: [TypeScript 7 compatibility setup](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/), [Vercel package managers](https://vercel.com/docs/package-managers), [Clerk reverification](https://clerk.com/docs/guides/secure/reverification).

## Scope and authority

Reviewed the root site, template application, architecture documents, contracts and selected enforcement tooling at commit `d2a4a9b41f71a899de9144370f9e89325f8698e7`. No application code was changed. No builds, tests, lint, type checks, development servers, migrations or deployments were run for this review.

The user's latest presentation/backend/form doctrine is authoritative over older repository guidance. The attached **Engineering Doctrine: PWA Spec Tracker** supplies additional requirements where the latest doctrine does not supersede it. Static public pages and domain forms retain their explicit exceptions. The root site is a generator/documentation application; tenant-specific requirements primarily apply to the template.

This is a source review, not a security penetration test or proof of deployed configuration. Findings below identify confirmed mismatches in inspected code. Automated inventories at the end identify additional review candidates; a matching filename/import is not independently proof of a runtime defect. Severity expresses architectural/security consequence, not a verified exploit.

## Confirmed findings

### A01 — High: the repository teaches and enforces the older call graph

Evidence: `context/docs/Architecture.md:39`, `:47–49`, `:70–72`; `packages/loaded-vibes/eslint/doctrine-map.mjs:339–357`; `.claude/contracts/validation.yaml:55`, `:73`, `:79`, `:91`.

The existing architecture permits workflows to use transaction helpers and rejects workflow imports of actions. The latest doctrine requires workflows to delegate authorized writes to actions and forbids direct workflow database access. Existing feature rules also permit direct primitive composition by client companions beyond the form exception. Consequently, passing the existing architecture enforcement would not demonstrate compliance with the user's latest rules. This is the central policy conflict behind several implementation findings below.

### A02 — High: workflows own persisted writes and database operations

Evidence: `packages/maximal-packages/maximal-template/lib/workflows/crmWorkflows.ts:5–11` and `qualifyLeadWorkflow`; `invoicingWorkflows.ts:5–7` and `finalizeInvoiceWorkflow`; `adminWorkflows.ts:5–8`, `:27`; `aiWorkflows.ts:5–12`, `:93`; `uploadsWorkflows.ts:6`, `:38–56`.

These workflows import database context/transaction helpers and execute or coordinate protected database writes themselves. Bulk administration is atomic, but that atomic write is owned by a workflow rather than one action. AI generation creates/completes/fails persisted records from a workflow. Uploads call `tx.asset.create` directly. These paths violate the required workflow → authorized action → transaction-helper ownership. Existing permission checks and atomic transactions are not being described as absent.

### A03 — High: some exported actions delegate their boundary contract to workflows

Evidence: `packages/maximal-packages/maximal-template/lib/actions/uploadsActions.ts:1–7`, plus workflow imports in `portalActions.ts` and `socialActions.ts` (complete inventory below).

`uploadWorkspaceAsset` only forwards FormData to a workflow. Authentication, permission checking, manual input checks and persistence happen downstream. The latest contract makes the independently callable action responsible for authentication, authorization, shared Zod parsing and a typed result. The upload path does perform downstream checks, so this finding does not assert an authentication bypass. The action/workflow direction also contributes to A01/A02; no circular dependency was established.

### A04 — Medium: boundary validation is inconsistent and often precedes authentication

Evidence: `packages/maximal-packages/maximal-template/lib/actions/crmActions.ts:34–35`, `:99–100`, `:124–125`, `:155–156`, `:214–215`, `:257–258`, `:276–277`; `adminActions.ts`; `onboardingActions.ts:8–9`; `packages/maximal-packages/maximal-template/lib/fetchers/crmFetchers.ts:47`, `:86`, `:145`.

These actions parse before `requireIdentity`, contrary to authenticate → general permission → validate → resource authorization → execute. `getCrmDeal(dealId: string)` accepts a TypeScript string directly for a persisted lookup without a runtime Zod boundary. Upload validation is handwritten rather than shared Zod. Authorization and tenant-scoped access exist in inspected paths; no cross-tenant disclosure was demonstrated.

### A05 — Medium: action result/error handling is only partially adopted

Evidence: `packages/maximal-packages/maximal-template/lib/utils/actionResult.ts`; mutation exports in `packages/maximal-packages/maximal-template/lib/actions/crmActions.ts` and `adminActions.ts`; `template/features/crm/crmNewContactForm.tsx`.

The repository already has a central safe action-result mapper, but several actions return DTOs directly and throw validation/domain errors. Their consumers fall back to generic exception handling rather than discriminated action results and RHF field errors. The specified VALIDATION/CONFLICT/FORBIDDEN/RATE_LIMITED contract is therefore not consistent across the server boundary. This is partial adoption, not absence of an error mapper.

### A06 — Medium: domain forms do not follow the required RHF/Field/Zod contract

Evidence: `template/features/crm/crmNewContactForm.tsx:4`, `:23`; `crmNewAccountForm.tsx`; `template/features/settings/memberInviteForm.tsx:1–35`.

The CRM contact form uses `useForm<ContactFormValues>` and registered inputs without the shared Zod resolver, Controller/Field composition, or required invalid-state attributes. The account form similarly declares its own values. The invitation form uses React state and a native form action instead of RHF and the shared schema resolver. These implementations also do not consistently map server validation fields through `setError`. Existing default values and direct action calls in the CRM form are compliant portions of the implementation.

### A07 — Medium: form implementations exist in the presentation block layer

Evidence: `template/components/blocks/auth-forms.tsx`, particularly `LoginForm`.

This block owns credential/remember state and form submission behavior. Forms are explicitly client features under the latest doctrine. These block implementations are a layer violation even if their fallback form is currently unused; this review does not claim the application's active Clerk sign-in route uses the fallback or bypasses Clerk.

### A08 — Medium: non-form features compose UI primitives directly

Evidence: `template/features/crm/crmContactsFeature.client.tsx:8` and its filter toolbar; additional candidates in the inventory below.

Interactive feature companions render primitive inputs/buttons and presentation arrangements directly rather than handing presentation props/state to blocks and templates. The forms exception does not cover ordinary list/filter features. The automated scan found 19 candidate files without recognizable form markers; inspect each before treating it as an independent violation. Direct fetcher calls from simple server features are not separately flagged: creating workflows solely as pass-through wrappers would conflict with the no-unnecessary-layers rule.

### A09 — Medium: domain presentation copy is embedded outside root content

Evidence: `template/features/crm/crmNewContactForm.tsx`; `template/features/settings/memberInviteForm.tsx`; `packages/maximal-template/components/templates/crm-templates.tsx`.

Domain labels, instructions, empty/error messaging and section copy are embedded in feature/template JSX. Ordinary domain content must come from root `content/`. Public page hardcoded copy is permitted and is not included in this finding.

### A10 — Medium: selected database results escape without an explicit DTO mapper

Evidence: `template/lib/workflows/uploadsWorkflows.ts:38–56`.

The upload operation selects `{ id, filename }` from `tx.asset.create` and returns that selected database result directly. The projection is small, but the latest contract explicitly requires a DTO release policy in addition to select. This is not evidence of sensitive fields being returned; those two fields are the observed output.

### A11 — Medium: internal AI mutation is implemented as an API route

Evidence: `template/app/api/ai/generate/route.ts:7–13`; `packages/maximal-packages/maximal-template/lib/workflows/aiWorkflows.ts:93`.

The route parses application input, invokes a workflow that performs internal writes and maps domain errors. The PWA reference reserves API route handlers for external webhooks and cron and specifies actions for internal application mutations. This route also puts domain orchestration at the URL boundary. Authentication occurs downstream; this is an ownership mismatch, not a claim of an unprotected endpoint.

### A12 — High: AI rate limiting deliberately falls back to database queries

Evidence: `packages/maximal-packages/maximal-template/lib/workflows/aiWorkflows.ts:88–111`; `template/app/api/ai/generate/route.ts` RATE_LIMITED comment.

When Upstash is unconfigured, AI generation takes a database lock and counts recent generations inside a transaction. The reference explicitly requires one Upstash limiter before the transaction and forbids the database fallback. The configured Upstash path and its integration helper do exist. The mismatch is the retained alternative path and its production behavior.

### A13 — High: integration status is accessible beyond administrators

Evidence: `packages/maximal-packages/maximal-template/lib/workflows/organizationWorkflows.ts:9–13`; `packages/maximal-packages/maximal-template/lib/authz/permissions.ts:19–22`; `template/features/settings/integrationsFeature.tsx`.

The status workflow checks `base.settings:read`, which is granted to MEMBER and VIEWER, and is rendered in tenant settings. The reference requires administrator-only integration status. No secret values were observed in the returned status DTO; the mismatch is visibility of provider configuration/status to broader roles.

### A14 — Medium: missing integration secrets are presented as demo mode without a production distinction

Evidence: `packages/maximal-packages/maximal-template/lib/integrations/status.ts:8–18`; `packages/maximal-packages/maximal-template/lib/env/base.ts` `defineEnv`; `packages/loaded-vibes/scripts/check-env.mjs`.

The status function labels every missing installed-provider configuration as DEMO MODE, independent of environment. Environment validation is lazy per owner; the inspected check-env script checks schema/manifest consistency rather than requiring deployed secrets. This does not implement the reference's startup failure for installed production integrations. Individual provider calls may still fail when their environment reader runs; this finding does not assert that every provider silently succeeds or that deployed secrets are missing.

### A15 — High: the prescribed isolated administrator boundary is absent

Evidence: admin routes under `template/app/(tenant)/admin/`; `packages/maximal-packages/maximal-template/lib/env/base.ts` baseEnv; `packages/maximal-packages/maximal-template/lib/db/client.ts`; `packages/maximal-packages/maximal-template/lib/auth/auth.ts`; `packages/maximal-packages/maximal-template/lib/actions/adminActions.ts`.

The template uses tenant admin pages, the normal identity helper and tenant database access. It does not provide the reference's separate `(admin)` group/database URL and administrator database role architecture. Inspected sensitive admin mutations use ordinary identity/permission checks without a step-up assurance requirement. Clerk dashboard MFA/session settings were not inspected, so their actual configuration remains unknown. Existing role/permission protection is not absent.

### A16 — Medium: identity/onboarding and route composition differ from the reference

Evidence: `packages/maximal-template/prisma/schema/identity.prisma:41–43`; `packages/maximal-packages/maximal-template/lib/actions/onboardingActions.ts`; `template/lib/db/transactions/onboarding.tx.ts`; `template/app/(setup)/`; group root layouts and `template/app/global-not-found.tsx`; `packages/maximal-packages/maximal-template/next.config.ts:22–25`.

The database user primary key is a generated UUID with a separate Clerk ID, instead of Clerk ID as the primary key. The inspected onboarding operation assumes an existing active tenant membership and records completion through an audit event, rather than implementing the reference's pending-user/no-role administrator approval gate and metadata flag. The route groups are `(auth)`, `(public)`, `(setup)`, `(tenant)`, without `(admin)`. Multiple group root layouts/global-not-found deliberately replace the specified shared root layout/not-found structure. These are contract differences, not assertions that Next.js cannot support the existing choices. External provisioning/approval behavior needs separate verification before claiming the full lifecycle is absent.

### A17 — Medium: provider SDK imports cross the designated boundary

Evidence: `template/components/nav/user-menu.tsx:5`; `template/features/pwa/pwaAccountMenu.client.tsx:3`.

The navigation component imports Clerk's UserButton and the account feature imports useClerk directly. The latest doctrine keeps provider mechanics out of presentation and within designated modules. The reference expressly permits ClerkProvider at the layout boundary; that required use is not flagged. UserMenu was not found mounted in the inspected references, so its provider-bound presentation is a source issue rather than a proven active logout/cache defect.

### A18 — Medium: a feature fetches data inside useEffect

Evidence: `features/maximal/maximalBrowser.client.tsx:181–189`.

The public source browser fetches the selected source file from an effect when the active selection changes. The reference's no-useEffect-fetch rule is unconditional. Public pages' presentation/copy exceptions do not explicitly exempt this data-fetching pattern.

### A19 — Medium: input types and stored role lists duplicate authoritative sources

Evidence: `packages/maximal-packages/maximal-template/types/crmTypes.ts:12`, `:19`, `:28`; `template/schemas/crmSchemas.ts`; `packages/maximal-packages/maximal-template/lib/authz/roles.ts`.

Contact criteria/form values are handwritten interfaces alongside Zod schemas rather than schema-derived input/output types. Several non-extending contracts also use interface contrary to type-by-default. `appRoles` repeats Prisma's role strings in a runtime array; its compile-time exhaustiveness check helps detect drift, but it remains a duplicate enum list. Interfaces that actually extend contracts, such as CrmDealDTO, are not violations of the extension exception.

### A20 — Low: naming and aggregation diverge broadly

Evidence: `template/features/crm/crmNewContactForm.tsx`; `features/cli/hipsterBuilderFeature.tsx`; `template/components/blocks/auth-forms.tsx`; `template/lib/db/dto/crm.dto.ts`; `template/lib/db/selects/crm.selects.ts`; `template/lib/db/transactions/crm-qualify-lead.tx.ts`; `template/schemas/`.

Component filenames use camelCase/PascalCase instead of kebab-case. Blocks are split into generic per-composition files instead of aggregated slice-first files. Library filenames use dots/hyphens rather than the locked camelCase conventions, DTOs live in `dto/` rather than `dtos/`, and schemas live in plural `schemas/` rather than `schema/`. The inventory identifies 178 uppercase-containing component filename candidates across the scanned application directories. This count is not a count of independent functional defects. The approximately 400-line rule is a review signal, not a hard violation.

### A21 — Medium: the primitive layer includes bespoke compositions and variants

Evidence: `packages/maximal-template/components/ui/button.tsx:15–31`; `template/components/ui/data-table.tsx`.

Button has bespoke accent/noShadow/reverse variants and an xl size beyond the locked shipped-variant contract. The data-table module owns a reusable multi-primitive TanStack composition in the primitive directory. Under the supplied layer definitions that composition belongs to blocks. This is assessed against the user's classification contract, not a claim that composing shadcn components is generally unsupported.

### A22 — Low: several server-only database modules lack their own poison import

Evidence: DTO and select modules listed in the inventory, plus `packages/maximal-packages/maximal-template/lib/db/transactions/errors.ts`.

These files do not declare `import "server-only"`. Current type-only imports and upstream server-only callers reduce immediate risk; no actual client-bundle inclusion was established. Nevertheless, the explicit server-only protection does not independently cover every database module as required.

### A23 — Low: foundation configuration differs from the reference

Evidence: both package.json files (`packageManager` and TypeScript dependency); root `next.config.ts:4–19`; template securityHeaders in `packages/maximal-packages/maximal-template/next.config.ts`.

The repository pins pnpm 12.3.4 and TypeScript 6.0.3 while the supplied tracker specifies pnpm 10 and TypeScript 7. The root site's config does not enable reactCompiler, while the template does. The inspected security-header arrays omit an explicit HSTS header required by the tracker. These are static spec differences; this review does not validate the tracker's version assumptions, recommend dependency changes, or claim Vercel fails to supply HSTS itself.

## Conforming observations

- Inspected tenant routes use feature/Suspense composition and do not query Prisma. The route import scan found no ordinary domain persistence imports; A11 concerns the explicit API exception.
- Templates/blocks inspected do not import fetchers, actions, database operations or workflows. Public pages may legally consume blocks directly and hardcode copy.
- `packages/maximal-packages/maximal-template/lib/db/tenant.ts` and `rls.ts` establish transaction-local PostgreSQL context on the same transaction used for protected queries. No connection-context escape was established in these wrappers.
- Selects, DTO mappers, permission/policy helpers, transaction helpers, shared Zod schemas and a safe ActionResult mapper already exist. Most findings concern incomplete adoption or ownership, not entirely missing facilities.
- AI provider calls occur outside database transactions. Upload metadata failure attempts blob compensation. Those existing protections must not be misreported as missing.
- Template PWA manifest, service worker, offline route and install feature exist. The inspected worker excludes personalized HTML/RSC/JSON caching and uses static asset caching. The inspected PWA account logout clears caches before sign-out.
- The standard context/docs directory has the five prescribed documents. This report is deliberately outside that directory. No barrel-file violation was established by the scan.

## Unverified requirements and limits

No live database was queried. Actual runtime database-role privileges, FORCE RLS coverage on deployed tables, cross-tenant denial and append-only audit grants remain unverified. No production environment, Clerk configuration, webhook delivery/retention, cron schedule or deployment headers were inspected. A source-level permission check is not proof of production enforcement.

Template generator machinery remains under template/scripts; whether those files violate the emitted-app boundary depends on the generated artifact selection and was not proven here. This is a review candidate, not a confirmed emission violation. Optional push notifications and explicitly deferred compliance work are not reported as missing required functionality.

The automated scan covered 650 source files in selected application directories, supplemented by manual reads of the paths above. It is not a claim that every executable path, multiline import or generated artifact was exhaustively audited.

## Machine and network observations

Initial snapshot: CPU about 3%; approximately 2.46 GB free of 8.13 GB RAM. Ethernet was up at 1 Gbps link speed, Wi-Fi down, and adapter counters showed no packet errors. Four router pings succeeded at 0–1 ms. A five-second sample measured about 14.731 Mbps inbound and 0.184 Mbps outbound. That traffic was not attributed to a specific process; link speed and router latency do not establish ISP throughput.

Stopped 12 identified Node/MCP runtimes: artifact-session host, node_repl, MCP bundle/launcher runtimes and Codex security helpers. No dev server or dependency install was found running. The immediate follow-up process check found no node/pnpm/npm/python/uvx processes. Desktop applications may restart their own helpers; stopping a runtime does not disable its integration permanently.

Windows Delivery Optimization had active downloads. Stopping DoSvc failed because the current session could not open/control the service. No system service configuration was changed. Consequently this review cannot certify that all background bandwidth use has stopped. No sustained ISP speed test, driver changes, system cleanup or broad process termination was performed. Windows services and the user's desktop applications were preserved.

Final snapshot: CPU about 8%; no node/pnpm/npm/python/uvx processes found; Ethernet remained up at 1 Gbps. Delivery Optimization still reported four downloading jobs and one other job. The inspected 3000–9999 listener range contained ports 5040 and 7680, previously identified as Windows services, rather than development-server listeners. This snapshot does not establish the absence of every possible background workload.

## Verification and reproduction

Performed: read-only source inspection, import/name inventories, git status/commit inspection, process/listener inspection, adapter counters, router pings and a short traffic sample. Only this report is added to the repository.

Useful read-only PowerShell commands for a later check (not additional completed tests):

```powershell
git status --short
git rev-parse HEAD
Get-Process node,pnpm,npm,python,uvx -ErrorAction SilentlyContinue
Get-NetTCPConnection -State Listen | Select-Object LocalAddress,LocalPort,OwningProcess
Get-NetAdapter | Select-Object Name,Status,LinkSpeed
Get-NetAdapterStatistics
Test-Connection 192.168.1.1 -Count 4
Get-DeliveryOptimizationStatus | Select-Object FileId,Status,FileSize,TotalBytesDownloaded
rg -n 'withTenantTransaction|withAuthenticatedRead|@/lib/db/' template/lib/workflows
rg -n '@/lib/workflows/' template/lib/actions
rg -n 'useForm|zodResolver|Controller|FieldError' template/features/crm template/features/settings
```

No remediation was implemented. The report inventories mismatches for the owner's prioritization rather than authorizing a refactor or changing the accepted doctrine.

## Static inventory appendix

Generated from the source inspection described above. Lists are grouped by the match they establish, not by independently confirmed exploitability.

### Workflow database imports (16)

```text
packages/maximal-packages/maximal-template/lib/workflows/adminWorkflows.ts:5: import { toAdminMembershipDTO } from "@/lib/db/dto/admin.dto";
packages/maximal-packages/maximal-template/lib/workflows/adminWorkflows.ts:6: import { withTenantTransaction } from "@/lib/db/tenant";
packages/maximal-packages/maximal-template/lib/workflows/adminWorkflows.ts:7: import { updateMembershipAdministrationTx } from "@/lib/db/transactions/admin.tx";
packages/maximal-packages/maximal-template/lib/workflows/adminWorkflows.ts:8: import { InvariantViolationError } from "@/lib/db/transactions/errors";
packages/maximal-packages/maximal-template/lib/workflows/aiWorkflows.ts:5: import { withAuthenticatedRead, withTenantTransaction } from "@/lib/db/tenant";
packages/maximal-packages/maximal-template/lib/workflows/aiWorkflows.ts:6: import { completeAiGenerationTx } from "@/lib/db/transactions/ai-complete-generation.tx";
packages/maximal-packages/maximal-template/lib/workflows/aiWorkflows.ts:12: } from "@/lib/db/transactions/ai.tx";
packages/maximal-packages/maximal-template/lib/workflows/crmWorkflows.ts:5: import { toCrmContactDTO } from "@/lib/db/dto/crm.dto";
packages/maximal-packages/maximal-template/lib/workflows/crmWorkflows.ts:6: import { withTenantTransaction } from "@/lib/db/tenant";
packages/maximal-packages/maximal-template/lib/workflows/crmWorkflows.ts:10: } from "@/lib/db/transactions/crm-qualify-lead.tx";
packages/maximal-packages/maximal-template/lib/workflows/crmWorkflows.ts:11: import { InvariantViolationError } from "@/lib/db/transactions/errors";
packages/maximal-packages/maximal-template/lib/workflows/invoicingWorkflows.ts:5: import { toInvoiceDTO } from "@/lib/db/dto/invoicing.dto";
packages/maximal-packages/maximal-template/lib/workflows/invoicingWorkflows.ts:6: import { withTenantTransaction } from "@/lib/db/tenant";
packages/maximal-packages/maximal-template/lib/workflows/invoicingWorkflows.ts:7: import { finalizeInvoiceTx } from "@/lib/db/transactions/invoicing-finalize-invoice.tx";
packages/maximal-packages/maximal-template/lib/workflows/organizationWorkflows.ts:4: import { withAuthenticatedRead } from "@/lib/db/tenant";
template/lib/workflows/uploadsWorkflows.ts:6: import { withTenantTransaction } from "@/lib/db/tenant";
```

### Action imports of workflows (3)

```text
packages/maximal-packages/maximal-template/lib/actions/portalActions.ts:14: import { downloadWorkspaceFileWorkflow } from "@/lib/workflows/uploadsWorkflows";
packages/maximal-packages/maximal-template/lib/actions/socialActions.ts:3: import { downloadWorkspaceFileWorkflow } from "@/lib/workflows/uploadsWorkflows";
packages/maximal-packages/maximal-template/lib/actions/uploadsActions.ts:3: import { uploadWorkspaceAssetWorkflow } from "@/lib/workflows/uploadsWorkflows";
```

### Provider imports outside designated boundary (scan matches) (2)

```text
template/components/nav/user-menu.tsx:5: import { UserButton } from "@clerk/nextjs";
template/features/pwa/pwaAccountMenu.client.tsx:3: import { useClerk } from "@clerk/nextjs";
```

### Non-form feature primitive-import candidates (19)

```text
template/features/admin/adminAuditFeature.client.tsx
template/features/admin/adminUsersFeature.client.tsx
template/features/crm/crmAccountsFeature.client.tsx
template/features/crm/crmContactsFeature.client.tsx
template/features/invoicing/expensesFeature.client.tsx
template/features/invoicing/invoiceFeature.client.tsx
template/features/invoicing/invoicesFeature.client.tsx
template/features/marketing/audiencesFeature.client.tsx
template/features/marketing/campaignsFeature.client.tsx
template/features/portal/portalDocumentControls.client.tsx
template/features/projects/projectsFeature.client.tsx
template/features/pwa/pwaAccountMenu.client.tsx
template/features/pwa/pwaInstallFeature.client.tsx
template/features/settings/invitationsFeature.client.tsx
template/features/settings/organizationSwitcher.client.tsx
template/features/social/mediaAssetControls.client.tsx
template/features/social/mediaLibraryFeature.client.tsx
template/features/support/inboxFeature.client.tsx
template/features/support/knowledgeBaseFeature.client.tsx
```

### Effect-fetch match (1)

```text
features/maximal/maximalBrowser.client.tsx
```

### Database modules without server-only import (23)

```text
template/lib/db/dto/admin.dto.ts
template/lib/db/dto/ai.dto.ts
template/lib/db/dto/billing.dto.ts
template/lib/db/dto/crm.dto.ts
template/lib/db/dto/invoicing.dto.ts
template/lib/db/dto/marketing.dto.ts
template/lib/db/dto/organization.dto.ts
template/lib/db/dto/portal.dto.ts
template/lib/db/dto/projects.dto.ts
template/lib/db/dto/social.dto.ts
template/lib/db/dto/support.dto.ts
template/lib/db/selects/admin.selects.ts
template/lib/db/selects/ai.selects.ts
template/lib/db/selects/billing.selects.ts
template/lib/db/selects/crm.selects.ts
template/lib/db/selects/invoicing.selects.ts
template/lib/db/selects/marketing.selects.ts
template/lib/db/selects/organization.selects.ts
template/lib/db/selects/portal.selects.ts
template/lib/db/selects/projects.selects.ts
template/lib/db/selects/social.selects.ts
template/lib/db/selects/support.selects.ts
packages/maximal-packages/maximal-template/lib/db/transactions/errors.ts
```

### Component filename candidates (178)

```text
features/cli/hipsterBuilder.client.tsx
features/cli/hipsterBuilderFeature.tsx
features/doctrine/doctrineDocsFeature.tsx
features/doctrine/doctrineSidebar.client.tsx
features/maximal/maximalBrowser.client.tsx
features/maximal/maximalBrowserFeature.tsx
features/plugin/pluginProductFeature.tsx
packages/maximal-template/components/ErrorBoundary.tsx
template/features/admin/adminAuditFeature.client.tsx
template/features/admin/adminAuditFeature.tsx
template/features/admin/adminAuditSkeleton.tsx
template/features/admin/adminEditUserForm.tsx
template/features/admin/adminNewUserForm.tsx
template/features/admin/adminRecordDetailFeature.tsx
template/features/admin/adminRecordDetailSkeleton.tsx
template/features/admin/adminRecordsFeature.tsx
template/features/admin/adminRecordsSkeleton.tsx
template/features/admin/adminUserDetailFeature.client.tsx
template/features/admin/adminUserDetailFeature.tsx
template/features/admin/adminUserDetailSkeleton.tsx
template/features/admin/adminUsersFeature.client.tsx
template/features/admin/adminUsersFeature.tsx
template/features/admin/adminUsersSkeleton.tsx
template/features/ai/aiGenerationFeature.tsx
template/features/ai/aiGenerationSkeleton.tsx
template/features/ai/aiPlaygroundFeature.client.tsx
template/features/ai/aiPlaygroundFeature.tsx
template/features/ai/aiPlaygroundSkeleton.tsx
template/features/ai/aiUsageFeature.tsx
template/features/ai/aiUsageSkeleton.tsx
template/features/auth/signInForm.tsx
template/features/auth/signUpForm.tsx
template/features/crm/crmAccountDetailFeature.tsx
template/features/crm/crmAccountDetailSkeleton.tsx
template/features/crm/crmAccountsFeature.client.tsx
template/features/crm/crmAccountsFeature.tsx
template/features/crm/crmAccountsSkeleton.tsx
template/features/crm/crmAnalyticsFeature.tsx
template/features/crm/crmAnalyticsSkeleton.tsx
template/features/crm/crmContactDetailFeature.tsx
template/features/crm/crmContactDetailSkeleton.tsx
template/features/crm/crmContactsFeature.client.tsx
template/features/crm/crmContactsFeature.tsx
template/features/crm/crmContactsSkeleton.tsx
template/features/crm/crmEditAccountFeature.tsx
template/features/crm/crmEditContactFeature.tsx
template/features/crm/crmEditLeadFeature.tsx
template/features/crm/crmFormSkeleton.tsx
template/features/crm/crmLeadDetailFeature.tsx
template/features/crm/crmLeadDetailSkeleton.tsx
template/features/crm/crmLeadsFeature.tsx
template/features/crm/crmLeadsSkeleton.tsx
template/features/crm/crmNewAccountForm.tsx
template/features/crm/crmNewContactForm.tsx
template/features/crm/crmNewLeadForm.tsx
template/features/crm/crmOpportunityForm.client.tsx
template/features/crm/crmPipelineFeature.client.tsx
template/features/crm/crmPipelineFeature.tsx
template/features/crm/crmPipelineSkeleton.tsx
template/features/dashboard/dashboardFeature.tsx
template/features/dashboard/dashboardSkeleton.tsx
template/features/invoicing/expenseEditFeature.tsx
template/features/invoicing/expenseFeature.tsx
template/features/invoicing/expenseFormSkeleton.tsx
template/features/invoicing/expenseNewForm.tsx
template/features/invoicing/expensesFeature.client.tsx
template/features/invoicing/expensesFeature.tsx
template/features/invoicing/expenseSkeleton.tsx
template/features/invoicing/expensesSkeleton.tsx
template/features/invoicing/invoiceEditFeature.tsx
template/features/invoicing/invoiceFeature.client.tsx
template/features/invoicing/invoiceFeature.tsx
template/features/invoicing/invoiceFormSkeleton.tsx
template/features/invoicing/invoiceNewForm.tsx
template/features/invoicing/invoicesFeature.client.tsx
template/features/invoicing/invoicesFeature.tsx
template/features/invoicing/invoiceSkeleton.tsx
template/features/invoicing/invoicesSkeleton.tsx
template/features/marketing/audienceEditFeature.tsx
template/features/marketing/audienceFeature.tsx
template/features/marketing/audienceFormSkeleton.tsx
template/features/marketing/audienceNewForm.tsx
template/features/marketing/audiencesFeature.client.tsx
template/features/marketing/audiencesFeature.tsx
template/features/marketing/audienceSkeleton.tsx
template/features/marketing/audiencesSkeleton.tsx
template/features/marketing/campaignEditFeature.tsx
template/features/marketing/campaignFeature.client.tsx
template/features/marketing/campaignFeature.tsx
template/features/marketing/campaignForm.client.tsx
template/features/marketing/campaignFormSkeleton.tsx
template/features/marketing/campaignNewFeature.tsx
template/features/marketing/campaignsFeature.client.tsx
template/features/marketing/campaignsFeature.tsx
template/features/marketing/campaignSkeleton.tsx
template/features/marketing/campaignsSkeleton.tsx
template/features/marketing/marketingAnalyticsFeature.tsx
template/features/marketing/marketingAnalyticsSkeleton.tsx
template/features/onboarding/invitationAcceptForm.tsx
template/features/onboarding/onboardingFeature.client.tsx
template/features/onboarding/onboardingFeature.tsx
template/features/onboarding/onboardingGateFeature.tsx
template/features/onboarding/onboardingSkeleton.tsx
template/features/portal/billingFeature.tsx
template/features/portal/billingSkeleton.tsx
template/features/portal/documentFeature.client.tsx
template/features/portal/documentFeature.tsx
template/features/portal/documentsFeature.client.tsx
template/features/portal/documentsFeature.tsx
template/features/portal/documentSkeleton.tsx
template/features/portal/documentsSkeleton.tsx
template/features/portal/portalDocumentControls.client.tsx
template/features/portal/portalFeature.tsx
template/features/portal/portalSkeleton.tsx
template/features/projects/myTasksFeature.tsx
template/features/projects/myTasksSkeleton.tsx
template/features/projects/projectEditFeature.tsx
template/features/projects/projectFeature.tsx
template/features/projects/projectFormSkeleton.tsx
template/features/projects/projectNewForm.tsx
template/features/projects/projectsFeature.client.tsx
template/features/projects/projectsFeature.tsx
template/features/projects/projectSkeleton.tsx
template/features/projects/projectsSkeleton.tsx
template/features/projects/taskEditFeature.tsx
template/features/projects/taskFeature.client.tsx
template/features/projects/taskFeature.tsx
template/features/projects/taskFormSkeleton.tsx
template/features/projects/taskNewForm.tsx
template/features/projects/tasksFeature.client.tsx
template/features/projects/tasksFeature.tsx
template/features/projects/taskSkeleton.tsx
template/features/projects/tasksSkeleton.tsx
template/features/projects/timelineFeature.tsx
template/features/projects/timelineSkeleton.tsx
template/features/pwa/pwaAccountMenu.client.tsx
template/features/pwa/pwaInstallFeature.client.tsx
template/features/settings/billingFeature.tsx
template/features/settings/billingSkeleton.tsx
template/features/settings/integrationsFeature.tsx
template/features/settings/integrationsSkeleton.tsx
template/features/settings/invitationsFeature.client.tsx
template/features/settings/memberInviteForm.tsx
template/features/settings/membersFeature.tsx
template/features/settings/membersSkeleton.tsx
template/features/settings/organizationSwitcher.client.tsx
template/features/settings/organizationSwitcherFeature.tsx
template/features/settings/profileFeature.client.tsx
template/features/settings/profileFeature.tsx
template/features/settings/profileSkeleton.tsx
template/features/social/calendarFeature.client.tsx
template/features/social/calendarFeature.tsx
template/features/social/calendarSkeleton.tsx
template/features/social/composerFeature.client.tsx
template/features/social/composerFeature.tsx
template/features/social/composerSkeleton.tsx
template/features/social/mediaAssetControls.client.tsx
template/features/social/mediaLibraryFeature.client.tsx
template/features/social/mediaLibraryFeature.tsx
template/features/social/mediaLibrarySkeleton.tsx
template/features/support/inboxFeature.client.tsx
template/features/support/inboxFeature.tsx
template/features/support/inboxSkeleton.tsx
template/features/support/knowledgeArticleEditFeature.tsx
template/features/support/knowledgeArticleFeature.tsx
template/features/support/knowledgeArticleFormSkeleton.tsx
template/features/support/knowledgeArticleNewForm.tsx
template/features/support/knowledgeArticleSkeleton.tsx
template/features/support/knowledgeBaseFeature.client.tsx
template/features/support/knowledgeBaseFeature.tsx
template/features/support/knowledgeBaseSkeleton.tsx
template/features/support/supportAnalyticsFeature.tsx
template/features/support/supportAnalyticsSkeleton.tsx
template/features/support/ticketFeature.client.tsx
template/features/support/ticketFeature.tsx
template/features/support/ticketNewForm.tsx
template/features/support/ticketSkeleton.tsx
template/features/uploads/workspaceFileUpload.client.tsx
```
