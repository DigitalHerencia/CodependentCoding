# Architecture — The Maximal Template™

## 1. Architectural identity

The Maximal Template™ is a single maximal Next.js application whose recipe domains share one architectural grammar.

The governing principle is:

> Put code where its actual responsibility says it belongs. Do not invent an abstraction when the responsibility already has a name.

## 2. Canonical domain vocabulary

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

`marketing` is a business domain. Public static content is not marketing architecture.

## 3. Top-level ownership

```text
app/                 URL and HTTP boundaries
features/            application/presentation orchestration
components/ui/       raw UI primitives
components/blocks/   grouped pure UI compositions
components/nav/      navigation presentation
components/shells/   structural application frames
lib/actions/         ordinary authenticated/authorized CRUD writes
lib/fetchers/        all persisted application reads; read-only
lib/db/              Prisma/Neon runtime helpers
lib/auth/            Clerk authentication and identity adaptation
lib/authz/           RBAC/ABAC/resource authorization
lib/integrations/    provider-specific external behavior
lib/workflows/       remaining domain/business logic
lib/cache/           cache tags/lifetimes/invalidation helpers
lib/constants/       constants
lib/utils/           true generic utilities
schemas/             reusable runtime validation
types/               shared TypeScript contracts
prisma/              Prisma schema/migration/seed lifecycle
generated/           generated outputs as configured
context/             human intent and scoped specs
.agents/             machine contracts and execution state
```

## 4. Presentation architecture

Normal flow:

```text
components/ui
    ↓
components/blocks
    ↓
features
    ↓
app
```

### UI primitives

Primitives are domain-agnostic building pieces.

They do not perform:

- persisted reads;
- persisted writes;
- auth/authz;
- provider operations;
- domain workflows.

### Blocks

Blocks are pure reusable UI compositions.

They are grouped by presentation category and should normally expose multiple named variations.

Examples:

```text
hero-sections.tsx
cta-sections.tsx
feature-sections.tsx
data-tables.tsx
record-details.tsx
dashboard-sections.tsx
invoice-sections.tsx
onboarding-sections.tsx
empty-states.tsx
error-states.tsx
```

Blocks do not own:

- React Hook Form state;
- provider components;
- Clerk behavior;
- persisted data access;
- auth/authz;
- domain/workflow logic.

### Features

Features own application orchestration for a route or use-case surface.

A normal feature may use:

- fetchers;
- actions;
- auth/authz;
- workflows;
- integrations;
- cache helpers;
- schemas/types;
- blocks.

Normal features compose blocks rather than scattering primitive UI.

## 5. React Hook Form exception

Form features are an explicit exception to the normal feature → block presentation rule.

A form feature:

- uses React Hook Form;
- composes UI primitives directly;
- owns browser form state and interaction;
- calls the relevant action;
- uses the relevant shared schema;
- is rendered by a thin page.

Examples:

```text
authSignInForm.tsx
authSignUpForm.tsx
contactNewForm.tsx
contactEditForm.tsx
projectNewForm.tsx
projectEditForm.tsx
```

Do not create `ContactEditorBlock`, `AuthFormsBlock`, or other form blocks merely to preserve a rigid layering slogan.

## 6. Public routes

Static public content lives under:

```text
app/(public)/
```

Examples:

```text
/
features
pricing
faq
contact
terms
privacy
```

Static public pages directly compose blocks.

They do not receive meaningless feature wrappers.

## 7. Tenant/domain routes

The route group `(tenant)` may provide a shared shell while real URL segments remain domain-named.

Canonical direction:

```text
app/(tenant)/
├── dashboard/
├── crm/
├── projects/
├── support/
├── marketing/
├── invoicing/
├── social/
├── ai/
├── portal/
├── admin/
├── user/
└── settings/
```

A route group never substitutes for a required URL segment.

If the desired public URL is `/admin/users`, the filesystem must contain an actual `admin` segment.

## 8. Resource route grammar

Where the domain supports CRUD, prefer:

```text
/{domain}/{resource}
/{domain}/{resource}/new
/{domain}/{resource}/[resourceId]
/{domain}/{resource}/[resourceId]/edit
```

A list feature may have a narrow browser companion for search/filter/sort/selection.

A detail feature may have a narrow browser companion for interactive detail behavior.

New/edit routes render RHF form features.

## 9. Suspense and route loading

- static content can use `loading.tsx`;
- persisted/dynamic routes should use Suspense around server feature entrypoints where appropriate;
- custom skeletons live with their feature and match the eventual rendered shape.

## 10. Application library classifier

```text
Static public presentation only?
    → app/(public) + components/blocks

React Hook Form?
    → feature form + components/ui

Application orchestration?
    → features/

Persisted application read?
    → lib/fetchers/

Ordinary persisted CRUD write?
    → lib/actions/

Prisma projection?
    → lib/db/selects/

DTO mapping?
    → lib/db/dto/

Atomic database helper?
    → lib/db/transactions/

Clerk/authentication?
    → lib/auth/

RBAC/ABAC/resource authorization?
    → lib/authz/

Provider-specific external behavior?
    → lib/integrations/{provider}/

Webhook HTTP lifecycle?
    → app/api/{provider}/.../route.ts

Remaining business/domain logic?
    → lib/workflows/{domain}/

Cache?
    → lib/cache/

Constant?
    → lib/constants/

True generic utility?
    → lib/utils/
```

## 11. Actions

`lib/actions/` owns ordinary persisted CRUD writes.

Actions authenticate/authorize/validate as required and perform the write, optionally using transaction helpers and cache invalidation.

They are not a generic business-service layer.

Examples of action responsibilities:

- create contact;
- update project;
- archive ticket;
- delete campaign.

Non-CRUD provider or business orchestration does not become an action simply because a button triggered it.

## 12. Fetchers

`lib/fetchers/` owns all persisted application reads.

Fetchers are read-only and may:

- validate criteria;
- resolve auth/authz when required;
- apply tenant/resource scope;
- use Prisma selects;
- map DTOs;
- apply explicitly safe caching.

No hidden sync writes.

## 13. Database layer

Canonical runtime structure:

```text
lib/db/
├── client.ts
├── selects/
├── dto/
└── transactions/
```

Neon and Prisma runtime concerns terminate here.

Prisma lifecycle remains root:

```text
prisma/
├── schema.prisma
├── migrations/
└── seed.ts
```

Prisma should generate its own migrations. Do not create an alternate migration framework.

## 14. Authentication

`lib/auth/` owns Clerk server integration and server-side identity/session helpers.

Clerk does not own application tenant membership, roles, or permissions.

## 15. Authorization

`lib/authz/` owns application authorization:

- roles;
- permissions/capabilities;
- resources;
- RBAC;
- ABAC;
- ownership checks;
- assignment checks;
- tenant checks;
- policy helpers.

Authentication answers who the identity is.

Authorization answers what that identity may do to a resource in context.

## 16. Tenant/RLS model

The application database owns Organization and Membership state.

A normal protected path is:

```text
Clerk identity
    ↓
local User
    ↓
Membership
    ↓
RBAC/ABAC/resource policy
    ↓
tenant-scoped query/write
    ↓
PostgreSQL RLS
```

RLS is defense in depth. It does not replace application authz.

## 17. Workflows

`lib/workflows/{domain}/` owns remaining business logic only after more precise categories have been excluded.

Workflows should remain shallow.

Do not introduce generic:

```text
services/
use-cases/
repositories/
domain/
application/
managers/
processors/
```

unless a future explicit decision establishes a real architectural distinction.

## 18. Integrations

Provider-specific code belongs in:

```text
lib/integrations/{provider}/
```

Intended providers include:

- Stripe;
- Cloudinary;
- Vercel Blob;
- SendGrid;
- Hugging Face.

Explicit exceptions:

```text
Clerk  → lib/auth
Neon   → lib/db
Prisma → lib/db runtime + root prisma lifecycle
```

## 19. Webhooks

Webhook HTTP lifecycle remains under `app/api`.

A route handler owns:

1. request receipt;
2. provider verification;
3. payload parsing/validation;
4. event interpretation;
5. idempotency coordination;
6. reusable helper invocation;
7. provider response.

Reusable atomic persistence belongs in `lib/db/transactions`.

Provider verification/parsing helpers may live with the relevant provider.

For Clerk, provider-specific auth integration remains under `lib/auth`.

Do not turn `lib/auth/syncWebhook.ts` or a generic workflow into a hidden database service.

## 20. Types and schemas

Shared files are domain-oriented where useful:

```text
types/crmTypes.ts
schemas/crmSchemas.ts
types/projectsTypes.ts
schemas/projectsSchemas.ts
```

Do not create files only for symmetry.

## 21. Minimal hierarchy

Prefer:

```text
lib/actions/crmActions.ts
lib/fetchers/crmFetchers.ts
```

over deep folder trees unless actual implementation scale forces a new boundary.

## 22. Public demo architecture

The public demo may render seeded data while signed out.

Public visibility does not make real writes public.

A visitor can browse Admin, CRM, Projects, Support, Marketing, Invoicing, Social, AI, Portal, User/Settings, Auth, and Onboarding surfaces while real protected operations still demonstrate the production security path.

## 23. Explicit anti-patterns

Do not reintroduce:

- `(marketing)` for public static content;
- public static pages wrapped in meaningless features;
- `features/marketing/*` for landing/pricing/contact purely because they are public-facing;
- form logic in blocks;
- Clerk components or provider behavior in generic blocks;
- database reads outside fetchers;
- CRUD writes scattered through auth/helpers/features;
- provider operations shoved into actions;
- webhook HTTP lifecycle hidden in `lib`;
- admin route groups that accidentally produce `/users` instead of `/admin/users`;
- optional light mode;
- cartoonish pastel neo-brutalism;
- generic service layers;
- unnecessary hierarchy.

## 24. Golden vertical slice

CRM contacts is the reference implementation for the canonical domain/resource grammar.

It should demonstrate:

```text
list
search/filter client behavior
detail
new RHF form
edit RHF form
fetcher
CRUD actions
Zod schema
types
select
DTO
auth/authz
tenant scope
RLS
Suspense
custom skeleton
```

Other domain implementations should follow this grammar unless a concrete domain difference requires otherwise.
