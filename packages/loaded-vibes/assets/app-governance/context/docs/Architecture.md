# {{appName}} — Architecture

The approved application contract is route → feature → template → blocks → ui. The two deliberate exceptions are static public pages and self-contained form features. UI primitives retain their shadcn names and shipped variants.

## Application topology

app/layout.tsx owns the document, metadata, fonts and ClerkProvider. app/page.tsx owns the landing page. The four route groups are (public), (auth), (tenant) and (admin). The auth group includes sign-in, sign-up, profile onboarding and invitation acceptance. There is no setup group. Administrator pages sit directly inside (admin); rewrites retain /admin/users, /admin/audit and /admin/records URLs. Shells, navigation, brand and chart folders stay flat.

Routes own URL params, searchParams, Suspense and framework boundaries. They render features without querying Prisma or coordinating business operations. Static public pages can consume blocks/templates directly and hardcode copy.

## Presentation

- components/ui: shadcn primitives.
- components/blocks: aggregated slice-first primitive compositions, with props, slots and presentation-only state.
- components/templates: pure arrangements of blocks with prepared data and callbacks.
- features: server-first application orchestration; client behavior stays in the smallest useful companion.
- features/_/_-form.tsx or *-form.client.tsx: React Hook Form, shared Zod resolver, Controller/Field rendering and direct action submission. Forms receive DTO initial values and map typed server errors with setError.

Ordinary domain copy lives in root content/. Public copy may remain in public presentation. Component filenames are kebab-case; library, schema and type filenames are slice-first camelCase. Named exports are preferred. The roughly 400-line threshold prompts review; it is not a hard cap. Blocks aggregate by slice, separating client-only variants when necessary. Optional preview form examples live in features rather than presentation blocks; the actual profile onboarding flow never asks for an organization, role or team.

## Server flow

Route → server feature → workflow → authorized fetchers/actions → database context/transaction helpers → Prisma/Neon.

Workflows are server-only orchestrators without a use-server directive. They compose fetchers, actions, integration helpers, calculations, caching and utilities; they never import the database layer or client components. Do not add pass-through workflows. An atomic multi-step write belongs to one action and transaction helper.

Authentication and general permission checks precede Zod parsing; resource-specific ownership checks follow validated identifiers. Every exported action is independently protected and returns a typed safe result. Fetchers own persisted reads and return DTO-mapped output. Selects limit retrieval; DTOs define outbound release. Prisma-generated types own stored enums, Zod owns runtime inputs, and shared types describe remaining contracts. Type aliases are the default; interfaces are reserved for extension.

Database wrappers establish identity and tenant RLS settings on the same transaction/connection as protected queries. No unrestricted Prisma client reaches domain features or workflows. Provider SDK mechanics remain inside lib/integrations, with Clerk identity/UI adapters under lib/auth. External network operations stay outside database transactions. Idempotency and reconciliation handle provider/database coordination.

## Identity and administration

User.id is the Clerk string ID. Organization and Membership IDs remain UUIDs. Profile completion is identity-scoped before membership approval. New users stay in the waiting area until an administrator grants an active membership and role. The database wrapper independently enforces both profile completion and active membership.

The admin layout is a UX gate. Every fetcher/action still enforces permissions. The template requires no MFA or reverification for administration. List queries validate search/page inputs and paginate in SQL. Membership changes are soft status changes with atomic append-only audit events. WebhookEvent remains separate from AuditEvent. Live RLS, Clerk settings and migrations require owner verification; source checks do not establish deployed security.

AI and rate limiting are optional. Missing optional inference/limiter configuration leaves those capabilities unused; partial configuration fails closed. Other installed production provider modules must have complete configuration at startup. Production never presents missing configuration as demo mode.
