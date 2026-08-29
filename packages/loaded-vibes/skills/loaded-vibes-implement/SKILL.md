---
name: loaded-vibes-implement
description: Implement approved changes in an Arrangement generated application while preserving Codependent Coding route, feature, PureUI, fetcher, action, workflow, transaction, auth/authz, provider, webhook, data-contract, and tenancy boundaries. Use for feature work and bug fixes after scope is understood.
---


# Loaded Vibes: Implement

Implement the smallest complete change that satisfies the requested outcome.

1. Inspect local instructions and relevant source first. Use `$loaded-vibes-inspect` when the affected context is not already clear.
2. Classify each new responsibility before creating files. Use `$loaded-vibes-classify` for ambiguous placement.
3. Follow existing repository patterns unless they violate a controlling adopted contract.
4. Preserve the canonical boundaries in `references/layer-contracts.md` and `references/security-boundaries.md`.
5. Keep pages/routes thin; keep normal Blocks pure; keep persisted reads in fetchers; ordinary CRUD writes in actions; behavioral orchestration in workflows; atomic DB invariants in transactions; provider mechanics in their provider boundary; webhook HTTP lifecycle at the route edge.
6. Preserve auth/authz/tenant scope and RLS assumptions. Do not weaken them to get tests passing.
7. Add or update tests only where the changed behavior or repository contract calls for them. Prefer focused evidence first.
8. Do not create ADRs, broad documentation, observability, CI, or generalized abstractions merely because they could be useful.
9. Run `$loaded-vibes-verify` before claiming completion when the change is executable/verifiable.

For a specific boundary, read only the relevant reference files rather than loading every architecture document.
