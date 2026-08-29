# Supporting Data and Contract Patterns

## SP01 - Select definition

**Purpose / context.** Define the exact Prisma projection needed by a query, transaction result, or DTO.
**Responsibilities.** Own selected scalar/nested/count fields and the inferred selected-record type.
**Non-responsibilities.** No authorization, tenant filtering, query criteria, business rules, DTO shaping, or mutation.
**Inputs.** No runtime input; design input is one persistence use case and its required fields.
**Outputs.** A checked Prisma `select` definition plus precise selected-record type.
**Dependencies.** Prisma generated types and owner-local type helpers only.
**Callers.** Approved data queries, Fetchers, transaction helpers, and DTO mapper type imports.
**Callees.** None at runtime.
**Invariants.** Every field is justified; sensitive/provider/internal fields stay absent unless explicitly required; mapper mismatch breaks compilation.
**Failure behavior.** Invalid fields or missing mapper-required fields fail type/Prisma validation; never broaden to a full model as fallback.
**Security.** Least-data projection limits exposure and avoids convenient secret/provider-field selection.
**Tenant isolation.** Query/RLS owners scope tenants; the Select itself never proves tenant access.
**Transaction behavior.** Starts no transaction; may be consumed inside an approved transaction.
**Caching behavior.** Owns no cache or freshness policy.
**Validation.** TypeScript/Prisma checks projection shape and validator checks this pattern contract.
**Testing.** Query/integration and mapper tests prove the projection is sufficient and stable.
**Naming.** Intent names such as `projectDetailSelect`; avoid `fullSelect` or `everything`.
**Placement.** `lib/db/selects/<domain>.selects.ts`, data/server-only.
**Lifecycle.** Persistence-projection stage of tenant-read and database-transaction lifecycles.
**Anti-patterns.** Full relation graphs, unrestricted model export, speculative fields, Select containing auth/business logic.
**Adjacent relationships.** Query/Fetcher owns scope/retrieval; Select owns projection; DTO Mapper owns translation; Type owns public shape.

## SP02 - DTO mapper

**Purpose / context.** Translate selected persistence or normalized provider records into stable transport-safe DTOs.
**Responsibilities.** Convert dates, money, enums, nullability, names, nested shapes, counts, and approved derived display-safe values.
**Non-responsibilities.** No I/O, authorization, transactions, provider calls, cache effects, redirects, or product transitions.
**Inputs.** Precise trusted selected-record or normalized-provider-record type.
**Outputs.** Explicit serializable DTO with intentional nullability and no persistence/provider leakage.
**Dependencies.** Selected-record types, stable DTO types, pure translation/format helpers.
**Callers.** Fetchers, Workflows returning DTOs, approved data result adapters, Feature/page-state composition.
**Callees.** Pure helpers only.
**Invariants.** Synchronous, deterministic, exhaustive for closed unions, field-explicit, serialization-safe, no whole-record spread.
**Failure behavior.** Impossible source state fails internally; mapper never invents defaults that hide integrity defects.
**Security.** Omits sensitive fields, recovery metadata, secrets, and raw provider objects unless an approved transport contract requires a safe projection.
**Tenant isolation.** Cannot authorize; tenant IDs are copied only when the DTO requires them after upstream scope checks.
**Transaction behavior.** Pure; opens no transaction.
**Caching behavior.** No cache effects; DTO stability merely supports cache owners.
**Validation.** Type/exhaustiveness/serialization checks prove shape, not authority.
**Testing.** Null, enum, date, money, rename/flatten/hide, serialization, impossible-state cases.
**Naming.** `map<Project><Shape>DTO` or equally precise domain names.
**Placement.** `lib/db/dto/<domain>.dto.ts`; provider normalization remains in integrations.
**Lifecycle.** Runs after selected truth is available and before transport/presentation boundaries.
**Anti-patterns.** `{...record}`, Prisma Date/Decimal/BigInt leakage, query inside mapper, provider payload passthrough.
**Adjacent relationships.** Select defines source shape; Fetcher/Workflow supplies record; Type defines DTO; display mapper may create presentation state.

## SP03 - Schema

**Purpose / context.** Validate and normalize untrusted runtime values at explicit trust boundaries.
**Responsibilities.** Define accepted shape, bounded values, deliberate coercion, enums, cross-field rules, and normalized output.
**Non-responsibilities.** No authentication, authorization, tenant ownership, persistence, provider operations, transactions, or lifecycle decisions.
**Inputs.** `unknown`, normalized FormData, route/search values, provider-derived values, environment strings, or parsed machine-file data.
**Outputs.** Validated inferred value or structured validation failure.
**Dependencies.** Zod and pure validation helpers/canonical constants.
**Callers.** Fetchers, Server Actions, Route Handlers, configuration/env modules, webhook boundaries, validators.
**Callees.** Pure refinements/transforms only.
**Invariants.** Untrusted fields parse before use; limits explicit; coercion deliberate; parsing never implies authorization.
**Failure behavior.** Invalid values yield bounded structured errors; browser output hides internal debug/sensitive details.
**Security.** Reject malformed/oversized/unexpected values; parsed actor/tenant/provider IDs still cannot establish authority; secrets not echoed.
**Tenant isolation.** Tenant/resource IDs are syntax-only until server Membership/policy/RLS scope resolves them.
**Transaction behavior.** Parses before mutation transaction where practical; Schema opens none.
**Caching behavior.** None; cache key use occurs only after owner applies tenant/auth scope.
**Validation.** Schema is executable runtime validation; architecture checks verify required boundary usage where mechanically feasible.
**Testing.** Positive/negative cases, limits, coercion, cross-field rules, malicious/unexpected values, fuzz/property cases where consequential.
**Naming.** Boundary-specific `<operation>Schema`; avoid one giant reusable domain/persistence/transport schema.
**Placement.** `schemas/<domain>.schemas.ts` or genuinely owner-local schema.
**Lifecycle.** Trust-validation stage of page/read/mutation/form/webhook/config/validation lifecycles.
**Anti-patterns.** Type assertion instead of parse, unbounded passthrough, parsed tenant/provider ID treated as authority, I/O inside schema.
**Adjacent relationships.** Type describes compile-time shape; Schema proves runtime shape; auth/authz proves authority; Workflow/policy proves operation legality.

## SP04 - Type

**Purpose / context.** Define stable compile-time contracts for domain vocabulary, DTOs, action results, provider-normalized results, security context, and presentation state.
**Responsibilities.** Own explicit unions, discriminants, nullability, field types, and the narrowest useful shared contract.
**Non-responsibilities.** No runtime validation, authorization, serialization execution, data access, or provider behavior.
**Inputs.** Canonical vocabulary and compile-time definitions only.
**Outputs.** Type/interface/const-derived unions consumed by permitted layers.
**Dependencies.** Stable application types/constants; public types avoid unrestricted Prisma/provider SDK dependencies.
**Callers.** Layers permitted by dependency contracts; types are shared only as broadly as needed.
**Callees.** Compile-time composition only.
**Invariants.** Nullability explicit, stable discriminants, transport serializability documented, generated models do not escape through aliases.
**Failure behavior.** Type mismatch fails compilation; runtime invalidity still requires Schema/authorization.
**Security.** Public/shared types expose only approved fields; secret/provider-sensitive shapes remain private.
**Tenant isolation.** Typed tenant IDs are identifiers, never Membership/scope proof; trusted security types are server-created.
**Transaction behavior.** None; transaction types may describe expected version/state but do not enforce them.
**Caching behavior.** None; cached DTOs retain serialization/scope requirements.
**Validation.** Strict TypeScript/exhaustiveness validates compile-time shape only.
**Testing.** Type assertions where useful, exhaustive switches, runtime serialization tests for boundary DTOs/results.
**Naming.** Intent names like `ProjectDetailDTO`, `ActionResult`, `Actor`; avoid `Data`, `Model`, `Thing`.
**Placement.** `types/<domain>.types.ts` for genuinely shared contracts; private types remain owner-local.
**Lifecycle.** Shapes values across lifecycles but has no independent runtime lifecycle.
**Anti-patterns.** `any`, unsafe casts, non-null assertions as design, public full Prisma aliases, vague broad interfaces.
**Adjacent relationships.** Schema validates runtime values; Select/DTO establish persistence-to-transport boundary; Layer Contract governs where Types cross.
