# Arrangement Security Boundaries

Use these as invariants, then defer to repository-local adopted contracts for exact implementation details.

- Authenticate before identity-dependent operations.
- Authorize before resource access or mutation; do not fetch cross-tenant data broadly and filter afterward.
- Put tenant/resource scope into persisted predicates when feasible.
- Treat PostgreSQL RLS as defense in depth, not the policy engine.
- Do not let stale cache decide authorization, payment truth, entitlement/readiness, or deadline-sensitive workflow outcomes.
- Keep provider secrets server-only and never print them in diagnostics.
- Separate provider truth from application interpretation.
- Verify webhook signatures against the raw request body as required by the provider.
- Design provider-event reconciliation for duplicate, delayed, concurrent, and out-of-order delivery.
- Keep network/provider calls outside database transaction helpers.
- Do not weaken existing authorization, tenancy, RLS, webhook, or secret-handling controls to make a task easier.
- Stop for explicit approval before production deployment, destructive data changes, credential rotation, security-control weakening, or other consequential external actions.
