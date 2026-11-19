# AI domain architecture refactor

Status: approved by the owner task on 2026-11-18. That task supersedes conflicting repository guidance. CRM is a read-only architectural reference.

## Scope

Refactor only Maximal Template's AI domain and necessary shared dependencies. Keep the tenant shell, Clerk identity, Neon/Prisma tenancy and Hugging Face inference. Consolidate the prescribed AI singletons and camel-case route features, skeletons and generation form. Blocks own copy and primitives; templates own presentation; features/forms orchestrate workflows; application implementation stays below workflows.

## Acceptance criteria

- `/ai`, `/ai/playground`, `/ai/usage` compose one page template per route through Suspense features and direct skeleton blocks. Overview and usage show bounded, authorized persisted history and database aggregates with explicit personal organization/date scope; no sample business data.
- The generation form owns RHF validation/submission and accessible pending, validation, output, unavailable and failure states. Provider/model configuration is server-owned. Output is rendered as text.
- Reads and mutations check AI permissions and ownership. A request captures its original organization/user and rechecks that membership before each protected transition without following later organization selection.
- Only the existing Hugging Face integration calls the SDK, outside transactions, preserving prompt/output bounds and enabled rate controls. Errors exclude provider diagnostics, prompts and secrets.
- New generations use RUNNING → SUCCEEDED or FAILED. Historical enum values remain readable without rewriting history. Completion is concurrency-safe and atomic with a unique append-only usage entry. Unavailable measurements are nullable and decimal costs remain strings.
- Consolidate transaction implementations in `lib/db/selects/aiTx.ts`; remove obsolete code/imports; use explicit minimal selects and DTOs, domain types and runtime schemas, AI-owned module registration, source RLS and at most one seed file. Preserve historical stored amounts with an unverified measurement-version marker; exclude those legacy estimates from measured presentation and sums without rewriting history.
- Update affected test sources without executing tests. Author required migration source without applying it or rewriting historical rows. Document owner migration action.
- After edits run only `lint:fix`, `format:write`, `typegen`, `typecheck`; no tests, builds, servers, watchers, migrations, seeds or live provider requests. Deliver Issue-linked PR, passing permitted CI, merge, branch cleanup and synchronized main; preserve unrelated PWA edits.

## Visual reference and verification limits

No dashboard attachment was available in the task conversation. Use the installed BoldKit registry primitives and established tenant layout. Runtime, browser, test and visual verification remain deliberately unrun under owner constraints.
