# Validation and Conformance Model

Validation belongs to the software being built. This knowledge repository defines the proof model; it does not need a parallel miniature CI platform to prove that its own Markdown exists.

## What each mechanism is for

| Mechanism | Proves | Does not prove |
|---|---|---|
| Prettier | deterministic formatting | semantics |
| TypeScript | compile-time interfaces and exhaustiveness | runtime trust or provider behavior |
| ESLint | configured code/import/API rules | business correctness |
| Zod/runtime schemas | runtime input/config shape | authorization or persistence invariants |
| Architecture rules | declared import/layer constraints | runtime tenant isolation |
| Vitest unit tests | pure policy, mapper, schema, and adapter behavior | real infrastructure behavior when mocked |
| Integration tests | collaboration between configured components | production-wide behavior |
| PostgreSQL/RLS tests | constraints, transactions, concurrency, and tenant containment | provider/UI behavior |
| Webhook tests | verification, dedupe, idempotency, retry, and recovery behavior | every live-provider failure mode |
| Playwright | critical browser workflows, keyboard, responsive behavior | backend isolation by itself |
| Accessibility checks | detectable semantic, keyboard, and contrast problems | complete human usability |
| Security scans | known dependency, secret, and static findings | absence of unknown vulnerabilities |
| Production build | framework compilation and integration | production correctness |
| Deployment smoke | deployed application responds in target environment | complete product behavior |
| Manual review | intent, tradeoffs, threat analysis, maintainability | reproducible runtime proof by itself |

## Gate sequence

Use the narrowest affected checks during iteration. A generated application should normally progress through:

1. **Fast:** format, lint, typecheck, architecture rules, unit tests.
2. **CI:** Fast plus Prisma/schema validation, contract checks, affected integration tests, production build.
3. **Release:** CI plus real database/RLS tests, critical E2E/accessibility, security scans, migration review, deployment, and smoke checks as applicable.

The exact scripts belong to the generated application and may evolve with its stack. The proof claim must never exceed the checks that actually ran.

## Evidence semantics

Distinguish four states when reporting work:

- **executed:** the check actually ran and has a passed or failed result;
- **skipped:** the check was known but deliberately not run;
- **blocked:** the check could not run because a prerequisite was unresolved;
- **inferred:** the conclusion came from inspection or reasoning rather than execution.

Expected output, confidence, issue status, or a previous revision's green run is not current executed evidence.

## High-risk validation

Authentication, authorization, tenant/RLS behavior, money movement, provider reconciliation, migrations, destructive data operations, and privileged configuration require checks at the real boundary whenever practical. Mock-only success is not enough for claims about those properties.

## Knowledge-repository maintenance

For changes to this repository, review the affected Markdown/YAML for coherent terminology, working relative references, contradictions, placeholders, and agreement with the controlling doctrine and source decisions. Do not build a second software product whose purpose is to test the documentation describing the first one.
