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
