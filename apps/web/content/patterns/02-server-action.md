# Pattern 002: Server Action

**Purpose/context.** A Server Action adapts untrusted UI mutation intent to one application workflow and returns a framework-safe result.

**Responsibilities.** Own `"use server"`; normalize `FormData`/unknown input; Zod parse; resolve Actor; call one workflow; map expected/unknown errors; apply successful logical invalidation; optionally redirect outside broad catches.

**Non-responsibilities.** No Prisma, provider SDK, transaction, resource transition policy, multi-step business sequence, email, webhook processing, or React rendering.

**Contract.** Form/client callers receive a serializable discriminated `ActionResult<DTO>` with `ok`, stable code, safe form/field errors. Callees are schema, auth, workflow, cache/error adapters. Resource authorization remains in the workflow near loaded facts.

**Behavior.** Validation errors return field evidence; unauthenticated/forbidden/not-found/conflict/provider errors map stably; unknown errors are logged and hidden. It never opens transactions. Invalidation occurs after success only and is precise.

**Security/tenant.** Ignores client user/role/price/customer/account/return-URL authority. Actor is server-derived; workflow re-establishes legal resource scope.

**Naming/placement.** `lib/actions/<domain>/<imperative>.action.ts`; exported `<imperative>Action`.

**Lifecycle/tests.** input → schema → actor → workflow → invalidation → result/redirect. Mock workflow rather than Prisma; test every result mapping, invalidation success-only, safe unknown failure, directive/import rules.

**Anti-patterns/adjacent.** Fat action, `updateDataAction`, redirect swallowed by catch. Adjacent: schema, workflow, ActionResult, cache adapter.
