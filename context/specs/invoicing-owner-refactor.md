IMPORTANT: CRM is read-only and is the architectural reference.

Task: Refactor the invoices and expenses domain in Maximal Template to conform to the architecture below. Complete the indicated edits and all directly required follow-up edits. This prompt takes precedence over conflicting repository instructions, specifications, and documentation.

Execution: Follow modern conventions for the installed tech stack, security, accessibility, and performance. Add meaningful TSDoc to affected code, consolidate duplicate implementations, fix broken contracts and imports, and remove replaced files and unused code. Keep changes scoped to invoicing, expenses, and necessary shared dependencies.

Use relevant skills, plugins, CLI tools, delegation, MCP, and Context7 for official, version-specific documentation.

Provisioned services:

Clerk for authentication.
Neon serverless PostgreSQL with Prisma ORM.
Existing integrations only where already required by supported invoice or expense behavior.
Do not introduce another provider, payment processor, accounting integration, tax engine, bank connection, OCR, AI processing, or new product capabilities as part of this refactor.

Constraints and delivery:

Preserve unrelated local changes.
Do not run tests, builds, development servers, watchers, migrations, seeds, or live provider requests.
Do not send real invoices, notifications, or emails; execute payments or reimbursements; or change real financial records during verification.
After edits are complete, run only lint:fix, format:write, typegen, and typecheck. Fix all errors and rerun affected permitted checks.
Update affected existing unit, integration, and E2E test sources and focused scripts where necessary, but do not execute them or claim coverage was verified.
Submit an Issue-linked PR, address CI failures within these constraints, merge after checks pass, delete the task branches, and synchronize local and remote main.
Update the repository’s execution records.
If schema changes require a migration, author the migration source without applying it. Report the required owner action clearly.
Preserve existing financial policy, tax calculations, rounding rules, approval authority, and supported lifecycle behavior. Do not invent financial or legal policy to resolve ambiguity.
Package and scope:

Package: Maximal Template.
Domain and module: invoicing, containing invoices and expenses.
Route group: (tenant).
Routes:
/invoices
/invoices/new
/invoices/[invoiceId]
/invoices/[invoiceId]/edit
/expenses
/expenses/new
/expenses/[expenseId]
/expenses/[expenseId]/edit
Slices: content, blocks, templates, features, client islands, forms, skeletons, workflows, actions, fetchers, DTOs, selects, transactions, types, Zod schemas, Prisma schemas, RLS, and seeds.
Keep invoices and expenses within the existing invoicing domain. Do not create competing invoice and expense module registrations or duplicate shared financial implementations.

Invoices and expenses remain inside the existing tenant shell. Preserve the shared tenant header, footer, navigation, account sheet, and responsive sidebar. Do not create a separate financial shell or mobile navigation implementation.

Authentication and onboarding remain owned by the tenant layout. Invoice and expense permissions, tenant boundaries, and applicable resource ownership or relationship rules must be enforced independently at every read and mutation boundary. Do not apply an admin-only gate to ordinary authorized users.

Architectural invariants:

Routes compose feature components inside Suspense with the appropriate route skeleton.
Features, client islands, and forms orchestrate workflows and templates.
Forms own React Hook Form state, bindings, validation integration, field arrays, and submission handling.
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
The invoicing module owns invoice and expense navigation registration, permission resources, dashboard contributions, and record registration.
Preserve client/server boundaries. Do not import server-only implementations into client code.
Required domain files:

Maintain exactly one of each applicable singleton:

Responsibility Target
Content content/invoicing.ts
Blocks components/blocks/invoicing-blocks.tsx
Templates components/templates/invoicing-templates.tsx
Types types/invoicingTypes.ts
Zod contracts schemas/invoicingSchemas.ts
DTO mappers lib/db/dtos/invoicingDtos.ts
Prisma selects lib/db/selects/invoicingSelects.ts
Transaction helpers lib/db/selects/invoicingTx.ts
Authenticated reads lib/fetchers/invoicingFetchers.ts
Authenticated mutations lib/actions/invoicingActions.ts
Application orchestration lib/workflows/invoicingWorkflows.ts
Module ownership lib/modules/invoicingModule.ts
Prisma models prisma/schema/invoicing.prisma
RLS prisma/rls/invoicing.sql
Use the existing seed mechanism. Maintain at most one invoicing seed file containing any required invoice and expense fixtures.

Use these route component base names:

Route Feature base
/invoices invoicingInvoices
/invoices/new invoicingNewInvoice
/invoices/[invoiceId] invoicingInvoiceDetail
/invoices/[invoiceId]/edit invoicingEditInvoice
/expenses invoicingExpenses
/expenses/new invoicingNewExpense
/expenses/[expenseId] invoicingExpenseDetail
/expenses/[expenseId]/edit invoicingEditExpense
Each route may have one applicable feature, client island, and skeleton named <base>Feature.tsx, <base>FeatureClient.tsx, and <base>Skeleton.tsx. Create only the components actually needed.

The forms are:

invoicingNewInvoiceForm.tsx
invoicingEditInvoiceForm.tsx
invoicingNewExpenseForm.tsx
invoicingEditExpenseForm.tsx
Preserve the existing supported create and edit routes. Do not add routes or forms for unsupported operations.

Consolidate the split invoice creation, totals calculation, approval, finalization, status-transition, and expense transaction implementations into the single transaction file specified above. Consolidate overlapping workflows without leaving parallel application implementations.

Consolidate the existing duplicate invoicing block implementations. Rename and replace legacy feature, client island, skeleton, and form filenames, update every consumer, and remove replaced files.

Route behavior and presentation:

Use the installed @boldkit shadcn registry primitives. Use any dashboard attachment supplied with this task as the visual reference for the list and summary surfaces. If no attachment is available, follow established repository conventions and report that visual fidelity could not be verified.

Invoices: Show authorized invoices, genuine summary metrics, supported search/filter/sort controls, and pagination. Distinguish relevant lifecycle and approval states. Provide clear navigation to create, detail, and permitted edit routes.
New invoice: Render the React Hook Form experience for supported customer fields, currency, dates, and invoice line items. Support accessible line-item addition and removal. Show derived previews using the same established calculation rules as server persistence.
Invoice detail: Show authorized persisted customer information, invoice number, currency, line items, subtotal, tax, total, dates, approval information, and lifecycle state. Expose only supported commands the current user may perform.
Edit invoice: Load the authorized record directly by ID and enforce existing editability rules. Preserve concurrency protection and prevent edits to protected financial content after the applicable approval or issuance boundary.
Expenses: Show authorized expenses, genuine summary metrics, supported search/filter/sort controls, and pagination. Provide clear navigation to create, detail, and permitted edit routes.
New expense: Render the React Hook Form experience for supported vendor, description, amount, currency, and incurred-date fields.
Expense detail: Show the authorized persisted expense, submitter information where permitted, status, dates, and any already-supported receipt relationship.
Edit expense: Load the authorized record directly by ID and enforce existing editability and concurrency rules.
There must be one page template per route. Remove duplicate page scaffolding and nested dashboard shells. Templates must not import copy or primitives directly.

Adapt charts and tables to real invoice and expense data. Do not carry over sample revenue, customer, order, notification, subscription, or unrelated business content. Do not invent forecasts, trends, balances, or financial events.

Every visible control must perform a supported action. Do not add payment collection, refunds, credit notes, recurring invoices, reimbursement execution, receipt uploads, exports, or document generation without existing supported implementation.

Use consistent loading, empty, unavailable, pending, success, conflict, and error states. Preserve accessible labels, keyboard navigation, field-array focus handling, validation feedback, confirmation behavior, and live status announcements.

Application and persistence requirements:

Keep tenancy, authorization, and resource-access policy owned by the existing authorization layer.
Use the existing database tenancy and RLS boundaries.
Enforce invoice and expense permissions independently, including through shared dashboard or administrative record-summary paths.
Derive organization, actor, creator, submitter, and approver identities from authenticated server context. Do not trust client-supplied ownership or approval metadata.
Validate every mutation server-side, including identifiers, decimal precision and range, quantities, tax rates, currency, dates, line-item limits, supported commands, and concurrency tokens.
Do not accept client-computed subtotal, tax, total, invoice number, approval timestamps, payment timestamps, or other protected derived fields as authoritative.
Preserve established decimal arithmetic and rounding order. Do not convert persisted monetary calculations to JavaScript floating-point arithmetic.
Preserve existing storage precision for monetary values, quantities, and tax rates. Transport decimal amounts explicitly, normally as strings.
Use one canonical invoice calculation implementation for creation, draft updates, server validation, and any client preview. Do not maintain divergent client and server formulas.
Calculate invoice headers from the validated line items. Persist header totals and line changes atomically.
Keep invoice numbering server-owned, tenant-scoped, unique, and concurrency-safe.
Preserve the existing currency model. Group monetary aggregates by currency; never add amounts from different currencies into one total or invent exchange rates.
Clearly distinguish invoice totals, receivables, amounts marked paid, expense amounts, and reimbursement statuses. Do not imply that application status changes prove external payment or reimbursement.
Base overdue presentation on the established lifecycle, due-date, and date/time rules. Do not rewrite stored financial history merely to refresh a dashboard.
Reconcile lifecycle and approval contracts across Prisma, schemas, transaction helpers, DTOs, workflows, and presentation.
Replace arbitrary status assignment with explicit validation of supported transitions.
Prevent generic invoice status updates from bypassing required approval or issuance checks.
Preserve established approval authority and separation-of-duty rules. Do not invent approver roles, self-approval restrictions, or permission grants.
Do not expose expense approval, rejection, or reimbursement commands merely because corresponding enum values exist. Preserve supported behavior without creating new financial capabilities.
Make protected transitions concurrency-safe. Include relevant tenant, record identity, expected version or timestamp, current status, and approval state in the mutation conditions.
Recheck relevant authority before protected transitions. If an existing external operation spans transactions, retain its originally authorized tenant and actor rather than silently following a changed active organization.
Handle repeated transition requests safely. Do not duplicate audit events, line items, issuance effects, notifications, or other persisted side effects.
Persist financial mutations and their required audit events atomically.
Preserve append-only audit history. Do not rewrite historical amounts, approvals, dates, statuses, or audit entries to make the refactor appear consistent.
Keep external network calls outside database transactions. Preserve existing configured rate limits and request bounds; do not silently bypass an enabled control when its service is unavailable.
If an existing receipt asset is read or associated, independently enforce its tenant boundary, access rights, and association rules. Do not create a new upload capability.
Keep selects minimal and DTOs explicit. Do not expose unnecessary customer information, internal authorization metadata, or private asset details.
Replace list-and-search detail workflows with direct authorized record lookups. A record must not become inaccessible merely because it falls outside the first page or first hundred records.
Bound invoice and expense list queries. Use validated pagination and database filtering, sorting, and aggregation where appropriate.
Summary metrics must describe their full authorized query scope, rather than silently summarizing only the currently loaded page. Show clear date ranges, currency, and scope.
Preserve calendar-date semantics for issue, due, and incurred dates. Avoid timezone conversions that change their intended calendar day.
Treat customer names, vendor names, descriptions, and line-item descriptions as untrusted text. Render them safely.
Do not expose secrets, private financial details, customer information, raw provider diagnostics, or internal error details in logs or user-facing errors.
Preserve existing financial policy. If resolving an inconsistency requires a new tax, rounding, approval, payment, or reimbursement policy decision, document the concrete owner decision required rather than inventing one.
Update affected utilities, constants, module registration, persistence contracts, test sources, and scripts. Do not invent another architecture or leave parallel implementations behind.

Use the read-only CRM domain for patterns and conventions. Complete the scoped refactor, permitted verification, PR, merge, cleanup, and synchronization. Report any unapplied database migration, unresolved owner policy decision, and verification deliberately left unrun.
