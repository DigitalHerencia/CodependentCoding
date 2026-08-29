# Canonical Pattern Catalog

## Canonical pattern contract

Every canonical pattern, architecture-defining or supporting, is normative and must make the same contract dimensions explicit. A pattern is incomplete when one of these dimensions is absent merely because the author assumed it was obvious from another row, layer, or example.

1. **Purpose / context** — the recurring problem and circumstances in which the pattern applies.
2. **Responsibilities** — decisions, transformations, or effects the pattern owns.
3. **Non-responsibilities** — decisions/effects deliberately owned elsewhere.
4. **Inputs** — accepted values, trust level, cardinality, and preconditions.
5. **Outputs** — returned/produced values, serialization/cardinality, and guarantees.
6. **Dependencies** — modules, contracts, providers, or infrastructure the implementation may require.
7. **Callers** — architectural layers/modules permitted to invoke or compose the pattern.
8. **Callees** — architectural layers/modules the pattern may invoke.
9. **Invariants** — properties that must remain true for every valid implementation.
10. **Failure behavior** — expected/unknown failures, exposure rules, and recovery handoff.
11. **Security** — trust-boundary, secret, sensitive-data, provider, or authority implications.
12. **Tenant isolation** — tenant key/scope/RLS obligations or an explicit statement that the pattern is tenant-neutral.
13. **Transaction behavior** — whether database transactions are forbidden, optional, or owned, and their exact boundary.
14. **Caching behavior** — cache/memoization/freshness/invalidation obligations or explicit prohibition.
15. **Validation** — mechanically checkable structural/semantic conformance and stated proof limits.
16. **Testing** — focused unit/integration/browser/security/concurrency evidence appropriate to risk.
17. **Naming** — naming grammar that reveals responsibility and avoids overloaded terms.
18. **Placement** — canonical repository location and server/client boundary.
19. **Lifecycle** — how the pattern participates in request/entity/operation/delivery/release lifecycles.
20. **Anti-patterns** — concrete invalid implementations or shortcuts.
21. **Adjacent relationships** — neighboring patterns and the exact ownership handoff between them.

The contract is not permission to duplicate generic boilerplate twenty times. Each field must describe the **pattern-specific** consequence. For example, `Transaction behavior` for a Select definition means “no runtime transaction behavior; used by queries/transactions as a projection,” while the same field for an Integration Adapter means “network occurs outside database transactions and cross-system recovery belongs to the Workflow.” A validator may prove field presence and selected deterministic rules; semantic adequacy still requires source-backed review.

## Shared cross-pattern rules

- Inputs declare trust. TypeScript types never replace runtime validation at untrusted boundaries.
- Outputs declare cardinality and serialization. Unrestricted Prisma/provider objects do not escape their approved boundaries.
- Callers/callees obey `docs/12-layer-contracts.md` and `.agents/contracts/architecture.yaml`.
- Expected failures use stable semantics; unknown failures preserve internal cause and expose safe messages.
- Client-supplied actor, tenant, membership, role/capability, provider IDs, price/customer/account IDs, and return URLs never establish authority.
- Transactions are explicit and contain no provider/network work. Transaction Helpers accept a transaction client only.
- Cache behavior is always declared. Authorization/payment/readiness truth is never made authoritative by cached/browser state.
- Security and tenant evidence scales with risk; RLS is containment, not product authorization.
- Naming and placement communicate ownership. A convenient filename never authorizes a boundary violation.
- Pattern lifecycle participation must agree with `docs/13-system-lifecycles.md` and Pattern 009.
- Anti-pattern checks are automated where deterministic and reviewed where semantic.

## Pattern inventory

| ID | Pattern | Purpose | Canonical owner |
|---|---|---|---|
| P01 | Fetcher | self-securing protected read | `lib/fetchers` |
| P02 | Server Action | mutation transport adapter | `lib/actions` |
| P03 | Application workflow | named use-case sequence | `lib/<domain>/workflows` |
| P04 | Transaction helper | atomic DB invariant | `lib/db/transactions` |
| P05 | Auth/Authz boundary | identity, membership, capability, policy boundary | `lib/auth`, `lib/authz` |
| P06 | Webhook processor | durable provider reconciliation | `lib/webhooks` |
| P07 | Route/Feature orchestration | framework adaptation and product-experience composition | `app`, `features` |
| P08 | Layer contract | enforceable responsibility/dependency boundary | architecture/contracts |
| P09 | System lifecycle | state/process transition, recovery, evidence grammar | lifecycle contract + domain owners |
| P10 | Governance system | durable truth/contracts/execution/proof separation | root/context/.agents |
| SP01 | Select definition | exact persistence projection | `lib/db/selects` |
| SP02 | DTO mapper | pure persistence-to-transport translation | `lib/db/dto` |
| SP03 | Schema | runtime trust-boundary parser | `schemas` |
| SP04 | Type | stable compile-time/transport contract | `types` or owner-local types |
| SP05 | Client-feature boundary | browser-only interactive island | `features/**/*.client.tsx` |
| SP06 | UI primitive | accessible domain-free element | `components/ui` |
| SP07 | UI block | reusable pure presentation composition | shared/domain presentation |
| SP08 | Page | route-rendered user surface | route + Feature |
| SP09 | Error boundary | expected/unexpected failure adaptation | route/action/error owners |
| SP10 | Configuration | typed server/public settings | `lib/config` |
| SP11 | Environment validation | fail-fast environment parsing | centralized env module |
| SP12 | Cache and revalidation | declared freshness/invalidation | cache adapters + framework boundary |
| SP13 | Integration adapter | provider mechanics and normalized results | `lib/integrations` |
| SP14 | Logging and observability | safe correlated operational evidence | observability adapter |
| SP15 | Test fixture | deterministic bounded scenario data | test support only |
| SP16 | Validation script | machine conformance check | `scripts` |
| SP17 | Deployment workflow | repeatable gated delivery | package scripts + GitHub Actions/Vercel |
| SP18 | Authentication boundary | external identity to local Actor | `lib/auth` |
| SP19 | Authorization boundary | membership/capability/scope decision | `lib/authz` |
| SP20 | Policy | resource/workflow decision over plain facts | `lib/authz` or domain policy |

The ten architecture-defining patterns have individual specifications. The twenty supporting patterns are individually specified in [Supporting Patterns](11-supporting-patterns.md) using `SP01`–`SP20` and all twenty-one mandatory fields.
