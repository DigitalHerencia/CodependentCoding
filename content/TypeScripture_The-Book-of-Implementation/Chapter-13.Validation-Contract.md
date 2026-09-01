# Chapter 13: Validation Contract

**The Book of Implementation™**

## Canonical gate surface

```text
pnpm format:check
pnpm lint
pnpm typecheck
pnpm test
pnpm test:integration
pnpm test:architecture
pnpm test:e2e
pnpm build
```

## Rule

- Exact script names belong to the product repository, but CI invokes repository-owned scripts rather than redefining validation logic inside workflow YAML.
- Tenant isolation requires tests under production-equivalent restricted runtime credentials that attempt cross-tenant SELECT/INSERT/UPDATE/DELETE.

## Evidence record

- Record `command_or_review`, `revision`, `environment`, `result`, and `limits`. Do not emit a global PASS if the artifact being validated is not the artifact the validator actually inspected.
- Report a missing script, incompatible toolchain, unavailable credential, or absent runtime dependency as `blocked`. Do not substitute a different command and silently broaden or narrow the claim.

## Bidirectional reconciliation

The final architecture audit checks both directions:

```text
intent -> human doctrine -> embedded YAML/JSON -> golden patterns -> implementation -> evidence
intent <- human doctrine <- embedded YAML/JSON <- golden patterns <- implementation <- evidence
```

Search specifically for stale names, duplicate closed vocabularies, ceremonial aliases, barrel imports, presentation logic in DTOs, resource access justified only by tenant scope, N+1 read composition, race-prone read-then-write admission, mutable webhook identity, and HTTP routes that still own provider/database processing.
