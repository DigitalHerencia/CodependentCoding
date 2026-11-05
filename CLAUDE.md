# Codependent Coding

Internal software factory: Maximal Template (`packages/maximal-template/`) + generator (`packages/generator/`) + Hipster Stack CLI (`packages/cli/`) + Loaded Vibes plugin (`packages/loaded-vibes/`) + landing page (`app/`).

## Start every session

1. Read `.claude/execution/handoff.json` → work only on `next_issue`.
2. Read that issue in `context/specs/issues/CC-NNN-*.md`. Its Scope and Acceptance criteria are the whole job.
3. Branch `<type>/<issue#>-<slug>`; draft PR with `Closes #N` (see `context/specs/README.md`).

## Where things are (read only what the task needs)

| Need                             | Read                                                                              |
| -------------------------------- | --------------------------------------------------------------------------------- |
| What we're building / scope      | `context/docs/PRD.md`                                                             |
| Versions, scripts, layout        | `context/docs/tech-requirements.md`                                               |
| Layers, classifier, modules, CLI | `context/docs/Architecture.md`                                                    |
| UI, tokens, a11y                 | `context/docs/Design.md`                                                          |
| Auth, tenancy, RLS, webhooks     | `context/docs/AUTH.md`                                                            |
| Machine contracts                | `.claude/contracts/{application,validation,design}.yaml`                          |
| Doctrine rule IDs (CC-*)         | `.claude/contracts/validation.yaml` → enforced in `packages/loaded-vibes/eslint/` |
| Past decisions                   | `.claude/execution/decisions.json`                                                |

`context/doctrine/` is background reading, not authority.

## Rules

- Classify before creating a file (Architecture.md §3.3). Never invent layers or directories.
- Lint findings print a `CC-*` ID; fix the cause, don't disable the rule.
- Evidence only: never report a check as passing unless you ran it.
- Doctrine changes update Architecture.md + validation.yaml + `packages/loaded-vibes/eslint/` in one PR.
- Root and template are separate pnpm projects: `pnpm <script>` vs `pnpm --dir packages/maximal-template <script>`.
- Owner shell is PowerShell 7; give commands in PowerShell syntax.

## Before you stop — always

Update `.claude/execution/`:

- `progress.json` — issue status + EXECUTED evidence (command → result)
- `decisions.json` — append any decision you made (DEC-NNN)
- `handoff.json` — current state, next issue, risks

The Stop hook blocks once if code changed without these updates.

## Owner resource limits

- Never start a development server. Ask the owner to perform runtime/browser checks and report results.
- Do not run full test suites. Run only tests tied to the changed files and real affected feature behavior.
- A new regression test must fail against the unfixed code once, then pass with the fix; do not manufacture a failure or add filler assertions.
- Keep local checks to the smallest affected files. Do not repeat successful checks without a relevant change, retry dependency installs, or run local builds unless the owner specifically requests it.
- CI is limited to changed-file formatting with write, changed-code linting with fix, type generation, type checking, and affected-project builds, plus necessary setup. No tests, browser/dev servers, database jobs, or additional validation workflows.
- Avoid duplicate PR/main CI runs, unnecessary network calls, and bulk downloads. Stop task processes when finished; preserve unrelated apps and services.

## Project operating profile

This is a solo internal template-generator development tool, with no external users or commercial deployment. Keep delivery lightweight: no enterprise review/compliance ceremony, speculative hardening, or production-setup gates for ordinary development. Preserve the existing feature contracts and basic credential/tenant boundaries; do only the checks needed for the actual change.
