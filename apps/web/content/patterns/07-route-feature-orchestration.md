# Pattern 007: Route and Feature Orchestration

**Purpose/context.** Keep framework adaptation, product-experience composition, and pure rendering distinct.

**Responsibilities.** Route resolves/validates params/search, owns metadata, redirects, `notFound`, loading/error/not-found and HTTP. Feature loader composes secure fetchers into a serializable resolution/page-state model. Feature component selects role/state-aware presentation, Suspense boundaries, empty/blocked/ready states, and supplied action references. Components render.

**Non-responsibilities.** No Prisma/provider SDK/domain transition in route/feature/component. Feature is not a data layer. Components do not perform authoritative authz.

**Contract.** Route input is untrusted and normalized once. Loader returns `render | redirect | not-found` and safe page state. Independent reads parallelize/stream; reads establishing legal/logical preconditions remain sequential.

**Failure/cache/security.** Expected outcomes are modeled; unexpected failures reach route error boundaries with safe correlation. Async sections may have individual Suspense. Cache follows fetcher contracts. UI permissions only shape presentation; operations reauthorize.

**Naming/placement.** minimal `app/**/page.tsx`; `features/<domain>/<feature>/*.loader.ts`, `*.feature.tsx`, `*.section.tsx`, `*.client.tsx`, `*.types.ts`.

**Lifecycle/tests.** request → route parse → loader/fetchers → resolution → feature composition → components. Test route outcomes, dependency sequencing/parallelism, page-state matrix, loading/empty/error, no forbidden imports, keyboard/mobile/accessibility.

**Anti-patterns/adjacent.** route-as-application, feature-as-Prisma wrapper, giant copied prototype, `(tenant)` route group mistaken for tenancy. Adjacent: fetcher, action reference, client boundary, UI block.
