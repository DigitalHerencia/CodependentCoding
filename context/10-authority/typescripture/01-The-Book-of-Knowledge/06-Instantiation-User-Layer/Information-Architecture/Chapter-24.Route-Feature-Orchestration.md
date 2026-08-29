---
title: Codependent Coding Supporting Presentation Patterns
type: reference
scope: domain
project: CodependentCoding
domain: patterns
artifact: presentation-patterns
kind: reference
namespace: codependentcoding.patterns.presentation-patterns.reference
status: active
authority: source-of-truth
parent: "[[codependentcoding.patterns.supporting-patterns.reference]]"
depends_on:
  - "[[codependentcoding.patterns.route-feature-orchestration.reference]]"
supersedes: []
tags:
  - codependentcoding/patterns
  - codependentcoding/presentation
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: patterns/11b-presentation-patterns.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: 438339a838d58ac393a1ddd23d16944a9c6c750d
source_format: markdown
---
# Supporting Presentation Patterns

## SP05 - Client-feature boundary

**Purpose / context.** Introduce the smallest Client Component island only when browser events/state/APIs require it.
**Responsibilities.** Own browser-only interaction, pending/optimistic state, dialogs/forms/timers, and invocation of supplied Server Action references.
**Non-responsibilities.** No protected fetching, backend Clerk, auth authority, tenant truth, Prisma, provider SDK, workflow transition, or server cache authority.
**Inputs.** Serializable display/page DTOs, safe public config, supplied action/callback references.
**Outputs.** Client-rendered interaction and user intent submitted through approved server boundaries.
**Dependencies.** React client APIs, React Hook Form when appropriate, UI primitives/blocks, safe Types.
**Callers.** Server Feature/domain presentation creating a deliberate client island.
**Callees.** UI presentation and supplied Server Actions; never protected Fetcher/provider/data layer.
**Invariants.** Island is minimal; authoritative decisions rechecked server-side; props serializable; browser state advisory.
**Failure behavior.** Shows stable action/interaction failures and retry/reset without exposing raw server/provider errors or guessing ambiguous mutation outcome.
**Security.** No server secrets/server-only imports; hidden controls and client role checks are UX only.
**Tenant isolation.** Tenant IDs from authorized DTOs remain opaque identifiers and never broaden scope.
**Transaction behavior.** None; Action/Workflow owns DB transactions.
**Caching behavior.** Local UI state only; framework invalidation remains server-side after success.
**Validation.** Import/build/serialization checks enforce client/server boundaries.
**Testing.** Interaction, pending/optimistic rollback, keyboard/a11y, hydration, duplicate-click and critical E2E.
**Naming.** Precise interactive name or `*.client.tsx`; client suffix communicates a deliberate boundary.
**Placement.** Focused file under `features/<domain>` or reusable domain presentation when interaction is intrinsic.
**Lifecycle.** Page/form lifecycles between server-rendered state and Server Action intent.
**Anti-patterns.** Clientifying an entire route tree, client authority, protected fetches, browser provider mutation.
**Adjacent relationships.** Server Feature supplies state/action; UI Block/Primitive renders; Server Action receives authoritative mutation intent.

## SP06 - UI primitive

**Purpose / context.** Provide the lowest accessible domain-free presentation/control building block over semantic HTML and approved primitive libraries.
**Responsibilities.** Own semantic element, focus/keyboard behavior, variants, disabled/pending semantics, slots/refs, accessibility attributes.
**Non-responsibilities.** No product nouns, tenants, permissions, workflows, protected I/O, provider/cache/business logic.
**Inputs.** Typed visual/semantic props, slots/children, callbacks, accessibility attributes.
**Outputs.** Stable accessible React element(s).
**Dependencies.** React, semantic tokens/Tailwind, approved shadcn/Base UI/Radix-compatible primitives.
**Callers.** Shared/domain components, UI Blocks, Feature/client presentation.
**Callees.** Semantic HTML and low-level UI primitives only.
**Invariants.** Domain-free API, accessible defaults, keyboard/focus semantics, semantic-token styling.
**Failure behavior.** Invalid prop combinations are prevented by types/development assertions; no business recovery occurs here.
**Security.** No secrets/auth/provider/data imports; unsafe HTML is not a default API.
**Tenant isolation.** Tenant-neutral; tenant-specific content arrives only as already-approved display props.
**Transaction behavior.** None.
**Caching behavior.** None.
**Validation.** Typecheck, lint/a11y/static presentation rules, catalog/registry metadata where applicable.
**Testing.** Keyboard, focus, disabled/pending, ARIA/semantics, representative render/visual regression.
**Naming.** Stable generic nouns such as `Button`, `Dialog`, `Input`; no domain-specific `components/ui` names.
**Placement.** `components/ui/<noun>.tsx`; catalog fixtures remain isolated from production routes.
**Lifecycle.** Rendering/interaction stages only.
**Anti-patterns.** Product-aware primitive, clickable `div`, embedded Server Action, page-specific business state.
**Adjacent relationships.** Tokens style Primitive; Shared/Domain/UI Block composes it; Feature supplies product meaning.

## SP07 - UI block

**Purpose / context.** Package a reusable presentation recipe composed from primitives/shared/domain presentation without becoming a hidden use-case layer.
**Responsibilities.** Own layout/composition, responsive behavior, accessible hierarchy, and explicit empty/error/pending presentation slots/states.
**Non-responsibilities.** No protected reads, authz, Workflows, provider SDK, Prisma, tenant discovery, or lifecycle decisions.
**Inputs.** Typed DTO/display props, slots/content, safe callbacks/action references when part of the block contract.
**Outputs.** Reusable React presentation composition.
**Dependencies.** UI primitives, shared/domain presentation, stable presentation types/tokens, focused client subcomponent if intrinsic.
**Callers.** Features, domain presentation, page composition, catalog fixtures.
**Callees.** Presentation only; no Fetcher/data/provider boundary.
**Invariants.** Pure from supplied state, responsive/mobile-first, accessible, fixture-renderable, explicit API.
**Failure behavior.** Renders supplied empty/error/pending states; unexpected render failure propagates to React/route error boundary.
**Security.** No secrets/protected I/O; untrusted display content follows safe React/sanitization contract.
**Tenant isolation.** No authority; tenant-scoped data must already be an approved DTO.
**Transaction behavior.** None.
**Caching behavior.** None; current state comes from Feature/page owners.
**Validation.** Import boundaries, catalog metadata, responsive/a11y checks, TypeScript props.
**Testing.** Fixture/render states, callbacks, a11y, responsive and visual regression where asset contract requires.
**Naming.** Stable visual/domain concept, never positional names like `LeftBox2`.
**Placement.** `components/shared` or `components/<domain>` according to reuse/domain meaning.
**Lifecycle.** Renders states produced by page/form/workflow lifecycles without advancing them.
**Anti-patterns.** Giant copied page, hidden Fetcher/action execution, raw role checks, DB-shaped prop bags.
**Adjacent relationships.** Feature supplies meaning; Domain/Shared/Primitive renders; Client-feature owns browser orchestration.

## SP08 - Page

**Purpose / context.** Define a user-facing surface as a thin Route plus Feature-owned page experience and segment loading/error/not-found behavior.
**Responsibilities.** Route owns params/search/metadata/framework outcomes; Feature owns page-state orchestration/composition.
**Non-responsibilities.** No persistence/provider/workflow subsystem or duplicated business authorization in page code.
**Inputs.** Untrusted route/search context and framework request context; Feature receives normalized route input/resolution.
**Outputs.** React response, redirect, not-found, or modeled framework outcome.
**Dependencies.** Route/Feature pattern, Fetchers, presentation, schemas/types, framework APIs at Route boundary.
**Callers.** Next.js router/request dispatch.
**Callees.** One primary Feature entrypoint; Feature may call approved Fetchers and compose components/action references.
**Invariants.** Small `page.tsx`, validated route input, self-securing protected reads, no Prisma/provider SDK in Route/Feature.
**Failure behavior.** Expected not-found/redirect/empty/blocked remain modeled; unexpected errors reach segment error boundary.
**Security.** Route/layout gating is UX only; authoritative auth/authz stays in Fetcher/Workflow; only safe DTOs rendered.
**Tenant isolation.** Route tenant IDs are identifiers only; Membership/resource/RLS scope resolves server-side.
**Transaction behavior.** Route/Page/Feature never owns mutation transaction.
**Caching behavior.** Follows Fetcher/cache-owner policy and cannot cache across tenant/auth scope.
**Validation.** Route inventory/schema/import checks, build/typecheck, consistency with RL-01.
**Testing.** Page resolution, loading/error/not-found, authorization outcomes, a11y/responsive, critical Playwright flows.
**Naming.** URL vocabulary in route tree; Feature names the surface/use case, not generic `PageContent`.
**Placement.** `app/.../page.tsx` plus `features/<domain>/<surface>` and segment boundaries.
**Lifecycle.** Implements RL-01 and may host RL-05 without absorbing mutation semantics.
**Anti-patterns.** 300-line page, Prisma/provider SDK in route, hidden component data access, page role check as security.
**Adjacent relationships.** Pattern 007 orchestrates; Fetcher reads; UI renders; Error Boundary handles unexpected UI failures; Server Action adapts mutation.

## SP09 - Error boundary

**Purpose / context.** Adapt modeled/unexpected failures into safe UI/HTTP/action outcomes without confusing presentation with business recovery.
**Responsibilities.** Own framework error UI/reset or typed error-to-result/status mapping, correlation handoff, safe retry affordance.
**Non-responsibilities.** No hidden compensation, arbitrary provider/DB retries, raw-cause exposure, or conversion of expected not-found/conflict into generic crash.
**Inputs.** Framework/render error + reset/correlation or typed `ApplicationError`/unknown error at an adapter.
**Outputs.** Safe UI, stable ActionResult/HTTP/status/framework outcome and observability handoff.
**Dependencies.** Application error vocabulary, observability, framework error APIs.
**Callers.** Route segments, Server Actions, Route Handlers, client boundaries according to error class.
**Callees.** Safe observability/error mapping/presentation; business recovery only via an explicit separate operation.
**Invariants.** Expected/unexpected remain distinct; secrets/raw provider/DB errors hidden; redirect/not-found control flow not swallowed.
**Failure behavior.** Boundary failure degrades safely; telemetry failure never converts failure to success.
**Security.** Redact secrets/tokens/SQL/provider payload/PII and follow existence-disclosure policy.
**Tenant isolation.** Safe tenant/resource IDs may correlate errors but boundary never reads/exposes another tenant.
**Transaction behavior.** None; upstream transaction rollback follows its own lifecycle.
**Caching behavior.** No domain cache mutation; reset retries render, invalidation belongs to mutation/cache owner.
**Validation.** Required framework boundaries, error code/result schema, leakage checks.
**Testing.** Expected/unexpected mapping, reset, redirect/not-found, unknown error hiding, secret leakage/correlation.
**Naming.** Framework `error.tsx` or precise helper like `mapActionError`; avoid global `handleError` bag.
**Placement.** Route `error.tsx`, action/HTTP adapter modules, shared safe error presentation.
**Lifecycle.** Adaptation stage of RL-11 and failure branches of page/form/mutation lifecycles.
**Anti-patterns.** Raw `error.message` to browser, retry mutation during render, swallow redirect/notFound, UI compensation.
**Adjacent relationships.** Origin layer classifies failure; Observability records internal cause; Error Boundary adapts; UI renders safe state.
---
title: Codependent Coding Pattern 007 Route and Feature Orchestration
type: reference
scope: domain
project: CodependentCoding
domain: patterns
artifact: route-feature-orchestration
kind: reference
namespace: codependentcoding.patterns.route-feature-orchestration.reference
status: active
authority: source-of-truth
parent: "[[codependentcoding.patterns.catalog.map]]"
depends_on:
  - "[[codependentcoding.patterns.fetcher.reference]]"
  - "[[codependentcoding.docs.layer-contracts.contract]]"
supersedes: []
tags:
  - codependentcoding/patterns
  - hipsterstack/orchestration
  - status/active
created: 2026-08-08
updated: 2026-08-08
source_repository: DigitalHerencia/CodependentCoding
source_path: patterns/07-route-feature-orchestration.md
source_commit: 773a3469b80d8f8aafccecd749c60ebdb8a930ae
source_blob: d0790d65606a34c838ba64135b6806f69a9c2862
source_format: markdown
---
# Pattern 007: Route and Feature Orchestration

**Purpose/context.** Keep framework adaptation, product-experience composition, and pure rendering distinct.

**Responsibilities.** Route resolves/validates params/search, owns metadata, redirects, `notFound`, loading/error/not-found and HTTP. Feature loader composes secure fetchers into a serializable resolution/page-state model. Feature component selects role/state-aware presentation, Suspense boundaries, empty/blocked/ready states, and supplied action references. Components render.

**Non-responsibilities.** No Prisma/provider SDK/domain transition in route/feature/component. Feature is not a data layer. Components do not perform authoritative authz.

**Contract.** Route input is untrusted and normalized once. Loader returns `render | redirect | not-found` and safe page state. Independent reads parallelize/stream; reads establishing legal/logical preconditions remain sequential.

**Failure/cache/security.** Expected outcomes are modeled; unexpected failures reach route error boundaries with safe correlation. Async sections may have individual Suspense. Cache follows fetcher contracts. UI permissions only shape presentation; operations reauthorize.

**Naming/placement.** minimal `app/**/page.tsx`; `features/<domain>/<feature>/*.loader.ts`, `*.feature.tsx`, `*.section.tsx`, `*.client.tsx`, `*.types.ts`.

**Lifecycle/tests.** request → route parse → loader/fetchers → resolution → feature composition → components. Test route outcomes, dependency sequencing/parallelism, page-state matrix, loading/empty/error, no forbidden imports, keyboard/mobile/accessibility.

**Anti-patterns/adjacent.** route-as-application, feature-as-Prisma wrapper, giant copied prototype, `(tenant)` route group mistaken for tenancy. Adjacent: fetcher, action reference, client boundary, UI block.
