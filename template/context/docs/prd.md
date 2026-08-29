# Product Requirements — The Maximal Template™

## 1. Product definition

**The Maximal Template™** is the canonical maximal implementation from which Loaded Vibes™ / the Hipster Stack™ generator can select, configure, and prune recipe-specific applications.

It is one coherent superset application containing:

- shared application foundation;
- reusable presentation primitives and blocks;
- authentication and authorization examples;
- tenant-aware database behavior;
- all supported recipe domains;
- provider integration boundaries;
- webhook examples;
- seeded demonstration data;
- architecture and validation contracts.

It is not nine independently implemented applications.

## 2. Primary product goal

Provide a publicly explorable, visually compelling maximal application that demonstrates how the architecture works while remaining structurally useful as the canonical generator source.

The application itself should make the system understandable. A visitor should be able to walk through recipe surfaces, inspect seeded data, see capability/security labels, and understand that the same architectural grammar powers every domain.

## 3. Public demo requirement

The public deployment must be browseable without requiring:

- sign-in;
- sign-up;
- onboarding completion;
- organization selection;
- membership;
- privileged roles.

Authentication and onboarding remain visible as capabilities and examples, not as the entrance gate to the demo.

Public browseability does not grant protected mutation permission.

Signed-out visitors may inspect seeded/read-only demonstration state. Real protected operations continue to require the relevant combination of:

- server-side authentication;
- application authorization;
- tenant/resource scope;
- RBAC/ABAC policy;
- PostgreSQL RLS where applicable;
- validated mutation input.

## 4. Product positioning

The public application should feel less like:

> "Here is a SaaS starter. Create an account."

and more like:

> "Here is the entire application factory. Walk around."

The demo should expose the breadth of the system directly through navigation and application surfaces rather than forcing the visitor to derive everything from README prose.

## 5. Canonical business domains

The canonical application-domain vocabulary is:

```text
crm
projects
support
marketing
invoicing
social
ai
portal
admin
user
common
```

`marketing` means the **marketing automation and analytics business domain**.

Static landing, pricing, features, FAQ, contact, terms, privacy, and similar routes are **public content**, not the marketing domain.

## 6. Supported recipe capabilities

### CRM / Pipeline Tracker

Demonstrates contacts, accounts, deals, pipeline state, sales activity, record ownership, filters, detail views, editing, and CRM analytics.

### Project Management / Task Tracker

Demonstrates projects, tasks, milestones, dependencies, assignment, status, timelines, and personal work queues.

### Customer Support / Ticketing

Demonstrates ticket queues, assignment, SLA/escalation behavior, customer/agent distinctions, knowledge content, and support analytics.

### Marketing Automation & Analytics

Demonstrates campaigns, audiences, campaign sequencing, attribution/metrics, and delivery-provider boundaries.

### Invoicing & Expense Tracking

Demonstrates invoices, line items, expenses, calculations, billing settings, payment-provider boundaries, and financial authorization.

### Social Media Scheduling

Demonstrates scheduled content, platform variants, media associations, calendar/composer interaction, and storage/media-provider boundaries.

### AI / Micro-SaaS

Demonstrates model/provider boundaries, usage, credits, rate limiting, prompt/model selection, and browser streaming/interactivity where appropriate.

### B2B Client Portal

Demonstrates client-facing project/documents/billing surfaces, client-vs-internal identity, document/version lifecycle, and approval permissions.

### Internal / Admin

Demonstrates users, records, audit state, bulk operations, and explicit administrative capability checks.

## 7. Shared foundation

Shared material includes:

- public routes;
- authentication examples;
- onboarding demonstration;
- dashboard;
- settings;
- user surfaces;
- navigation and shells;
- grouped reusable blocks;
- Prisma/Neon infrastructure;
- application auth/authz;
- cache helpers;
- schemas and shared types;
- provider integration infrastructure;
- webhook route handlers;
- seeded demo data.

## 8. Architecture-as-product requirement

The public demo should expose useful architecture indicators where they improve understanding, for example:

```text
SEED DATA
DATABASE READ
RLS SCOPED
RBAC
ABAC
CLERK
PRISMA
NEON
STRIPE
WEBHOOK
SERVER COMPONENT
CLIENT FEATURE
REACT HOOK FORM
```

These indicators should remain compact and contextual. The Maximal Template is an application demo, not a documentation site bolted onto an app.

## 9. Provider set

The intended provider set is:

- Clerk;
- Neon;
- Prisma;
- Stripe;
- Vercel Blob;
- Cloudinary;
- SendGrid;
- Hugging Face.

Additional provider stubs must not become canonical merely because they happen to exist in the repository.

Provider integrations remain optional capabilities that Loaded Vibes can later prune.

## 10. Product non-goals

The Maximal Template is not:

- nine separate full applications;
- a generic enterprise service-layer framework;
- a reason to add deep domain hierarchy;
- a reason to create `services/`, `repositories/`, `use-cases/`, or similar duplicate abstractions;
- a client-side source-of-truth architecture;
- a requirement to enable Clerk Organizations;
- a requirement that public visitors authenticate before seeing the demo;
- a light-mode application;
- a cartoonish neo-brutalist theme;
- a reason to provision every provider before core architecture is correct.

## 11. Success criteria

The product is successful when:

1. public visitors can inspect all major recipe surfaces without authentication;
2. protected writes still demonstrate real auth/authz/tenant/RLS behavior;
3. public static pages are clearly separated from the marketing business domain;
4. all recipe domains use one recognizable route/feature/lib architecture;
5. one golden vertical slice establishes the canonical CRUD/read/form pattern;
6. the grouped block library is reusable and pure;
7. the visual language is consistently dark, mature, and technical;
8. optional providers are isolated and removable;
9. all supported recipes can be described as subsets of one maximal architecture;
10. Loaded Vibes can later prune capabilities without inventing replacement architecture.
