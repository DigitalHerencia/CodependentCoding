# The Maximal Template™

> **The Maximal Template™** is the canonical superset application produced by **The Hipster Stack™** generator/CLI using **The Loaded Vibes™ Web App Architecture** from **The Codependent Coding™ Knowledge System**.

The Maximal Template™ is not nine separate starter applications glued together. It is one coherent maximal implementation containing the shared foundation, supported SaaS recipe domains, optional provider integrations, reusable presentation blocks, and the architecture contracts needed for **The Hipster Stack™** to select, configure, and prune an application down to the requested product.

This repository is the **public demo edition** of The Maximal Template™. Its application surfaces are intended to be inspectable without requiring visitors to sign up, sign in, complete onboarding, join an organization, or satisfy production permissions merely to see what the system contains. Authentication, authorization, database, provider, and webhook boundaries remain represented because they are part of the architecture demonstrated by the template.

## System relationship

```text
The Codependent Coding™ Knowledge System
                    │
                    ▼
The Loaded Vibes™ Web App Architecture
                    │
                    ▼
          The Hipster Stack™
            generator / CLI
                    │
                    ▼
          The Maximal Template™
```

- **The Codependent Coding™ Knowledge System** defines the engineering doctrine, terminology, contracts, patterns, governance, and execution rules.
- **The Loaded Vibes™ Web App Architecture** defines how a generated web application is structured and how its layers interact.
- **The Hipster Stack™** is the generator/CLI that selects and configures the appropriate parts of the maximal implementation.
- **The Maximal Template™** is the canonical superset implementation from which generated applications are produced.

---

# Synopsis

The Maximal Template™ is organized around a strict **route → feature → block → primitive** presentation flow and a separate **feature → lib helper** application flow.

At the top level:

- `app/` owns **Next.js routes and HTTP boundaries only**. Pages stay thin and hand application behavior to features. Webhooks are special route handlers under `app/api/{provider}/.../route.ts`.
- `features/` owns **application orchestration**. Features combine server helpers with presentation blocks. React Hook Form logic lives directly inside the relevant feature. A `.client.tsx` companion exists only when browser-side state or interaction requires one.
- `components/` owns the **presentation layer**:
  - `blocks/` contains reusable UI compositions and is the primary UI surface features consume.
  - `nav/` contains headers, footers, sidebars, breadcrumbs, and mobile navigation.
  - `shells/` contains reusable page/application frames.
  - `ui/` contains raw BoldKit/shadcn primitives, which features do not import directly.
- `lib/` is the reusable application library. Its folders are classified by what the helper actually does:
  - `actions/` — authenticated/authorized CRUD database writes only.
  - `fetchers/` — all read-only persisted application data access.
  - `db/` — Prisma/Neon database infrastructure plus selects, DTO mappers, and transaction helpers.
  - `auth/` — Clerk authentication and server-side identity/session helpers.
  - `authz/` — application-owned RBAC/ABAC roles, permissions, resources, and policies.
  - `integrations/` — provider-specific external-service code, organized by provider. Clerk, Neon, and Prisma are intentionally excluded because they belong to `auth`, `db`, and Prisma's root lifecycle respectively.
  - `workflows/` — remaining domain/business logic that is not a read, CRUD write, DB helper, auth/authz concern, integration, webhook, constant, or utility. Domains stay shallow and flat.
  - `cache/`, `constants/`, and `utils/` contain exactly those reusable helper categories.
- `prisma/` owns Prisma's native schema, migrations, and seed lifecycle.
- `generated/` contains generated Prisma artifacts when configured separately.
- `schemas/` contains shared Zod validation schemas.
- `types/` contains shared TypeScript contracts.
- Root configuration files configure Next.js, Prisma, TypeScript, linting, shadcn/BoldKit, environment variables, and request-boundary behavior.

## Architectural flow

```text
URL / HTTP request
        │
        ▼
      app/
        │
        ▼
    features/
      │     │
      │     └───────────────┐
      ▼                     ▼
components/blocks/         lib/
      │                     │
      ▼               ┌─────┼────────────────────────────┐
components/ui/        │     │     │     │     │          │
                  fetchers actions db   auth authz integrations
                                      │
                                   workflows
```

The presentation side follows:

```text
UI primitive
    ↓
block
    ↓
feature
    ↓
page
```

The server/application side follows:

```text
feature
├── fetchers       # reads
├── actions        # CRUD writes
├── db helpers     # selects / DTOs / transactions
├── auth           # authentication
├── authz          # authorization
├── integrations   # provider-specific behavior
├── workflows      # domain logic
├── cache
├── constants
└── utils
```

The guiding principle is **functional decomposition with the minimum directory depth necessary**: put a file in the folder that describes what it actually does, keep domains flat, and do not introduce intermediate folders unless they represent a real architectural distinction.

---

# Recipe model

The Maximal Template™ contains implementations for all supported recipe domains:

```text
CRM
Project Management
Customer Support
Marketing Automation
Invoicing / Expenses
Social Media Scheduling
AI / Micro-SaaS
B2B Client Portal
Internal / Admin Tools
```

Each recipe selects a subset of the same maximal application:

```text
recipe
├── integrations
├── workflows
├── auth
├── authz
├── caching
├── routes
├── features
├── blocks
├── nav/shells
├── fetchers
├── actions
├── db helpers
├── schemas
└── types
```

A recipe is therefore **not an isolated template**. It is a selection over the same architectural layers.

The actual generation model is:

```text
shared foundation
+ selected recipe
+ selected optional providers
+ selected presentation blocks
= generated application
```

That makes The Maximal Template™ the canonical implementation and **The Hipster Stack™** the selector/configurator that turns the maximal implementation into a product-specific application.

---

# Supported recipes

## CRM / Pipeline Tracker

Sales workspace for managing leads, contacts, accounts, deals, pipeline stages, activities, and revenue performance.

**Integrations**

- Stripe — optional subscription/billing capabilities.
- SendGrid or another email provider — optional contact/deal email synchronization and notifications.
- Clerk remains under `lib/auth`.
- Neon/Prisma remain under `lib/db` plus root `prisma/`.

**Workflows**

- advance deal stages;
- detect stalled deals;
- calculate pipeline value;
- calculate sales velocity;
- enforce lead/account/contact relationship rules.

**Auth / authz**

- authenticated user/workspace context in the production template;
- owner/admin/member roles;
- CRM permissions;
- organization scoping;
- assigned-record/resource policies.

**Routes**

```text
/dashboard
/crm/pipeline
/crm/contacts
/crm/contacts/[contactId]
/crm/accounts/[accountId]
/crm/analytics
```

**Primary features**

- pipeline;
- contacts;
- contact detail/editor;
- account detail;
- CRM analytics.

**Primary blocks**

- dashboard;
- data table;
- record detail;
- kanban board;
- analytics dashboard.

---

## Project Management / Task Tracker

Collaborative workspace for projects, tasks, subtasks, dependencies, milestones, timelines, and personal work queues.

**Integrations**

- Vercel Blob — project files.
- Cloudinary — optional rich media.
- SendGrid — notifications/invitations.

**Workflows**

- calculate project health;
- resolve task dependencies;
- calculate milestone progress;
- scheduling/deadline rules;
- task hierarchy.

**Routes**

```text
/dashboard
/projects
/projects/[projectId]
/projects/[projectId]/tasks
/projects/[projectId]/timeline
/my-tasks
```

**Primary features**

- project list/detail;
- task backlog;
- task editor;
- project timeline;
- personal task queue.

**Primary blocks**

- dashboard;
- data table;
- record detail;
- kanban board;
- timeline;
- calendar.

---

## Customer Support / Ticketing System

Support workspace for ticket intake, queues, resolution, customer history, knowledge content, escalation, and SLA reporting.

**Integrations**

- SendGrid — email-to-ticket and notifications.
- Vercel Blob — attachments.
- Cloudinary — media attachments when needed.

**Workflows**

- calculate SLA;
- determine escalation;
- prioritize tickets;
- assignment rules;
- ticket lifecycle.

**Routes**

```text
/support/inbox
/support/tickets/[ticketId]
/support/knowledge-base
/support/analytics
```

**Primary features**

- agent inbox;
- ticket resolution workspace;
- knowledge base;
- support analytics.

**Primary blocks**

- split pane;
- data table;
- record detail;
- chat workspace;
- analytics dashboard.

---

## Marketing Automation & Analytics

Campaign and audience workspace for segmentation, campaign construction, automated sequences, attribution, and performance reporting.

**Integrations**

- SendGrid — campaign delivery.
- Analytics/ad-platform providers as selected.
- Cloudinary — campaign media.

**Workflows**

- evaluate audience rules;
- campaign sequencing;
- calculate attribution;
- calculate campaign metrics;
- drip timing logic.

**Routes**

```text
/marketing/campaigns
/marketing/audiences
/marketing/analytics
```

**Primary features**

- campaigns;
- campaign editor;
- audience manager;
- marketing analytics.

**Primary blocks**

- data table;
- record detail;
- analytics dashboard;
- rule/query-builder-style block;
- timeline/workflow-style block.

---

## Invoicing & Expense Tracker

Financial workspace for invoices, expenses, taxes, currencies, payment state, receipts, and financial reporting.

**Integrations**

- Stripe — checkout, payment status, customer portal, subscriptions.
- Vercel Blob — PDFs and receipt uploads.
- OCR provider — optional receipt extraction.

**Workflows**

- calculate invoice totals;
- calculate taxes;
- determine invoice status;
- currency calculations;
- expense-policy rules.

**Routes**

```text
/invoices
/invoices/new
/invoices/[invoiceId]
/expenses
/settings/billing
```

**Primary features**

- invoice directory;
- invoice detail;
- invoice editor;
- expenses;
- billing.

**Primary blocks**

- invoice;
- data table;
- record detail;
- dashboard;
- analytics dashboard.

---

## Social Media Scheduler

Publishing workspace for creating, previewing, scheduling, and managing social content and media.

**Integrations**

- Cloudinary — image/video media.
- Vercel Blob — raw uploads.
- Social-platform providers.
- Queue/scheduling provider when selected.

**Workflows**

- resolve publish time;
- build platform variants;
- publishing lifecycle;
- scheduling rules;
- media associations.

**Routes**

```text
/social/calendar
/social/compose
/social/media
```

**Primary features**

- content calendar;
- post composer;
- media library.

**Primary blocks**

- calendar;
- media library;
- record detail;
- split pane;
- preview/composer block.

---

## AI-Powered Wrapper / Micro-SaaS

AI product shell for prompt execution, streaming responses, model usage, rate limits, credits, and usage-based billing.

**Integrations**

- Hugging Face.
- OpenAI/Anthropic when selected as providers.
- Stripe — credits/subscriptions/usage billing.

**Workflows**

- calculate usage;
- calculate credits;
- enforce rate limits;
- prompt/model selection logic;
- generation rules.

**Routes**

```text
/ai
/ai/playground
/ai/usage
/settings/billing
```

**Primary features**

- generation workspace;
- prompt playground;
- usage dashboard.

**Primary blocks**

- chat workspace;
- split pane;
- analytics dashboard;
- usage/stats blocks.

---

## B2B Client Portal

Secure external-facing workspace for sharing projects, documents, approvals, invoices, and client communication.

**Integrations**

- Vercel Blob — document storage.
- Cloudinary — media.
- Stripe — client billing.
- SendGrid — notifications.
- Custom-domain provider when selected.

**Workflows**

- determine approval state;
- calculate project status;
- document/version lifecycle;
- client approval flows.

**Routes**

```text
/portal
/portal/documents
/portal/billing
```

**Primary features**

- shared project dashboard;
- secure document vault;
- client billing.

**Primary blocks**

- dashboard;
- file vault;
- data table;
- record detail;
- invoice.

---

## Internal Tools / Admin Portal

Privileged operations workspace for database records, users, account administration, bulk actions, and audit history.

**Integrations**

- Stripe — subscription/tier administration when required.
- Other providers only when their administration is exposed.

**Workflows**

- classify audit events;
- bulk-operation rules;
- administrative decision logic.

**Routes**

```text
/admin/records
/admin/users
/admin/audit
```

**Primary features**

- record inspector;
- bulk user operations;
- audit log.

**Primary blocks**

- data table;
- record detail;
- audit log;
- dashboard;
- split pane.

---

# Shared foundation

The shared foundation is not a separate recipe. It is the common material recipes can include as needed.

## Public / Marketing

```text
/
/pricing
/features
/contact
```

Includes landing, pricing, product-tour, and contact features plus reusable hero, feature-grid, testimonials, logo-cloud, CTA, stats, team, FAQ, pricing, and comparison blocks.

## Authentication / Onboarding

```text
/sign-in
/sign-up
/onboarding
```

The production template supports Clerk-backed authentication, workspace setup, and team invitations.

In this public demo repository, those surfaces are examples rather than access gates.

## Settings

```text
/settings/profile
/settings/members
/settings/billing
/settings/integrations
```

## Navigation / Shells

- marketing shell;
- app shell;
- auth shell;
- portal shell;
- header;
- footer;
- sidebar;
- mobile navigation;
- breadcrumbs.

In recipe terms:

```text
CRM
├── shared
│   ├── marketing
│   ├── auth
│   ├── onboarding
│   ├── settings
│   ├── navigation
│   └── app shell
│
└── recipe
    ├── crm routes
    ├── crm features
    ├── crm blocks
    ├── crm fetchers
    ├── crm CRUD actions
    ├── crm db helpers
    ├── crm workflows
    ├── crm authz
    └── selected integrations
```

---

# Core placement rules

The classifier is intentionally simple:

```text
Reads persisted data?             -> lib/fetchers/
Writes persisted data?            -> lib/actions/
Prisma select?                     -> lib/db/selects/
DTO mapper?                        -> lib/db/dto/
Transaction helper?               -> lib/db/transactions/
Clerk/authentication?              -> lib/auth/
RBAC/ABAC/authorization?           -> lib/authz/
Provider-specific external code?   -> lib/integrations/{provider}/
Webhook HTTP handler?              -> app/api/{provider}/.../route.ts
Remaining domain logic?            -> lib/workflows/{domain}/
Cache helper?                      -> lib/cache/
Constant?                          -> lib/constants/
Utility?                           -> lib/utils/
Application orchestration?         -> features/
Browser-only feature behavior?     -> *.client.tsx
React Hook Form?                   -> inside the relevant feature
Reusable UI composition?           -> components/blocks/
Navigation?                        -> components/nav/
Page/application frame?            -> components/shells/
Raw UI primitive?                  -> components/ui/
URL / HTTP surface?                -> app/
```

If a file matches a more precise category, use the more precise category instead of dumping it into `workflows/` or `utils/`.

---

# Patterns

## `actions/`

**Writes. CRUD. Period.**

An action:

- authenticates;
- authorizes;
- validates mutation input when required;
- performs the database write;
- may call a transaction helper;
- may call workflow helpers when the mutation requires domain logic;
- may invalidate cache.

The action itself remains a **CRUD write boundary**.

No business-calculation services.  
No provider-processing grab bag.  
No vague application-service layer.

---

## `fetchers/`

**Reads. Every persisted application-data read. Read-only.**

A fetcher may:

- authenticate;
- authorize;
- scope by tenant/resource;
- use reusable Prisma selects;
- map DTOs;
- use appropriate caching.

A fetcher does not mutate persisted application state.

---

## `db/`

Database-specific reusable helpers:

```text
lib/db/
├── client / prisma / neon runtime
├── selects/
├── dto/
└── transactions/
```

The provider/application boundary is:

```text
Neon                  -> lib/db/
Prisma runtime client -> lib/db/
Prisma lifecycle      -> prisma/
```

Selects, DTOs, and transaction helpers are reusable implementation helpers. They are not independent application operations.

---

## `integrations/{provider}`

If code exists because an external provider exists, it belongs with that provider.

```text
lib/integrations/
├── stripe/
├── cloudinary/
├── hugging-face/
├── vercel-blob/
├── sendgrid/
└── ...
```

Explicit exceptions:

```text
Clerk  -> lib/auth/
Neon   -> lib/db/
Prisma -> lib/db/ + root prisma/
```

Those exceptions classify the code by its architectural responsibility rather than by vendor identity.

---

## `auth/`

Clerk lives under `lib/auth/` because Clerk is the authentication implementation.

Typical responsibilities include:

```text
client
session
current user
current organization/workspace identity
authentication guards
webhook-backed identity synchronization
```

---

## `authz/`

Authorization is application-owned and stays separate from authentication.

```text
lib/authz/
├── roles
├── permissions
├── policies
├── resources
└── authorize
```

This is where RBAC, ABAC, tenant boundaries, resource ownership, and capability checks belong.

---

## Webhooks are route handlers

A webhook is an HTTP boundary, so the route handler lives in `app/api`.

```text
receive request
    ↓
verify provider signature
    ↓
decode / validate payload
    ↓
interpret event
    ↓
perform idempotent write
    ↓
return provider response
```

Provider-specific verification/parsing helpers may live under `lib/integrations/{provider}/`.

Atomic persistence helpers may live under `lib/db/transactions/`.

The HTTP request lifecycle remains in `app/api/{provider}/.../route.ts`.

---

## `workflows/`

`workflows/` is the remainder after everything with a more precise architectural name has been removed.

```text
lib/workflows/
├── crm/
├── projects/
├── support/
├── marketing/
├── invoicing/
├── social/
├── ai/
├── portal/
└── admin/
```

Workflow domains stay shallow.

Good:

```text
lib/workflows/crm/
├── advanceDealStage.ts
├── calculatePipelineValue.ts
├── detectStalledDeal.ts
└── calculateSalesVelocity.ts
```

Not:

```text
lib/workflows/crm/pipeline/services/domain/...
```

If another directory cannot be justified as a real architectural distinction, it does not belong there.

---

# Feature composition

A feature is where helpers become an actual application capability.

```text
Feature
├── fetcher(s)
├── action(s)
├── workflow helper(s)
├── auth/authz helper(s)
├── cache helper(s)
├── React Hook Form logic when necessary
└── blocks
```

React Hook Form logic belongs directly inside the relevant feature.

A form feature does **not** imply an additional architecture of:

```text
forms/
form-hooks/
form-fields/
form-services/
```

The presentation boundary remains:

```text
components/ui/*
        ↓
components/blocks/*
        ↓
features/*
        ↓
app/**/page.tsx
```

A feature consumes blocks. It does not reach directly into raw UI primitives.

`components/nav/` and `components/shells/` sit alongside blocks as reusable structural presentation.

---

# Canonical repository shape

```text
.
├── app/                          # Next.js routes and HTTP boundaries
│   └── api/{provider}/...        # Webhook/API request boundaries
│
├── features/                     # Application orchestration
│
├── components/
│   ├── blocks/                   # Reusable UI compositions
│   ├── nav/                      # Navigation compositions
│   ├── shells/                   # Structural application frames
│   └── ui/                       # BoldKit/shadcn primitives
│
├── lib/
│   ├── actions/                  # CRUD writes only
│   ├── auth/                     # Clerk authentication
│   ├── authz/                    # Application authorization
│   ├── cache/
│   ├── constants/
│   ├── db/
│   │   ├── selects/
│   │   ├── dto/
│   │   └── transactions/
│   ├── fetchers/                 # Read-only persisted-data access
│   ├── integrations/             # Provider-specific behavior
│   ├── utils/
│   └── workflows/                # Remaining domain logic
│
├── prisma/                       # Prisma schema/migrations/seed lifecycle
├── generated/                    # Generated Prisma artifacts
├── schemas/                      # Shared Zod schemas
├── types/                        # Shared TypeScript contracts
├── context/                      # Human-readable architecture/spec context
├── .agents/                      # Machine-readable contracts/execution state
├── components.json
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── pnpm-lock.yaml
├── postcss.config.mjs
├── prisma.config.ts
├── proxy.ts
├── tsconfig.json
└── .env.example
```

---

# Technology baseline

The current implementation uses:

- Next.js App Router;
- React;
- TypeScript;
- pnpm;
- Neon Postgres;
- Prisma;
- Clerk;
- Stripe;
- optional provider integrations such as SendGrid, Cloudinary, Vercel Blob, and Hugging Face;
- Tailwind CSS;
- shadcn/ui + BoldKit-derived primitives;
- React Hook Form;
- Zod;
- Vercel.

---

# Local development

Install dependencies:

```bash
pnpm install
```

Create local environment configuration:

```bash
cp .env.example .env.local
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Generate the Prisma client:

```bash
pnpm prisma:generate
```

Start development:

```bash
pnpm dev
```

Common validation commands:

```bash
pnpm format:check
pnpm lint
pnpm typecheck
pnpm prisma:validate
pnpm build
```

Only claim checks as passing when they were actually executed and observed.

---

# Demo edition vs. distributable template

This repository is the **public demo edition**.

Its purpose is to show the complete Maximal Template™ application and all supported recipe surfaces without forcing a visitor through production account setup.

The later distributable template derived from this implementation restores the full production path:

```text
Clerk identity
    ↓
application authorization
    ↓
tenant / resource scope
    ↓
fetcher or CRUD action
    ↓
database / provider boundary
```

The public demo and the distributable application template are separate deliverables. The demo should remain immediately explorable; the distributable template should retain the production auth/authz/data boundaries expected from The Loaded Vibes™ Web App Architecture.

---

# Repository governance

Repository-local governance is defined by:

- `AGENTS.md`;
- active specifications under `context/specs/`;
- machine-readable contracts under `.agents/contracts/`;
- durable architecture documents under `context/docs/`;
- current conforming repository patterns.

The repository's adopted contracts are authoritative for this implementation.

---

# License

Source code in this repository is licensed under the [MIT License](./LICENSE).

## Trademarks

**The Hipster Stack™**, **The Maximal Template™**, **The Loaded Vibes™**, and **The Codependent Coding™** are project names/marks. The MIT License applies to the software and does not itself grant rights to use those marks as source identifiers.
