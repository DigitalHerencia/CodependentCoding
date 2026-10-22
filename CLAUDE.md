# Codependent Coding

Internal software factory: Maximal Template (`template/`) + Hipster Stack CLI (`packages/cli/`) + Loaded Vibes plugin (`plugin/loaded-vibes/`) + landing page (`app/`).

## Start every session

1. Read `.claude/execution/handoff.json` → work only on `next_issue`.
2. Read that issue in `context/specs/issues/CC-NNN-*.md`. Its Scope and Acceptance criteria are the whole job.
3. Branch `<type>/<issue#>-<slug>`; draft PR with `Closes #N` (see `context/specs/README.md`).

## Where things are (read only what the task needs)

| Need                             | Read                                                                 |
| -------------------------------- | -------------------------------------------------------------------- |
| What we're building / scope      | `context/docs/PRD.md`                                                |
| Versions, scripts, layout        | `context/docs/tech-requirements.md`                                  |
| Layers, classifier, modules, CLI | `context/docs/Architecture.md`                                       |
| UI, tokens, a11y                 | `context/docs/Design.md`                                             |
| Auth, tenancy, RLS, webhooks     | `context/docs/AUTH.md`                                               |
| Machine contracts                | `.claude/contracts/{application,validation,design}.yaml`             |
| Doctrine rule IDs (CC-*)         | `.claude/contracts/validation.yaml` → enforced in `template/eslint/` |
| Past decisions                   | `.claude/execution/decisions.json`                                   |

`context/doctrine/` is background reading, not authority.

## Rules

- Classify before creating a file (Architecture.md §3.3). Never invent layers or directories.
- Lint findings print a `CC-*` ID; fix the cause, don't disable the rule.
- Evidence only: never report a check as passing unless you ran it.
- Doctrine changes update Architecture.md + validation.yaml + `template/eslint/` in one PR.
- Root and template are separate pnpm projects: `pnpm <script>` vs `pnpm --dir template <script>`.
- Owner shell is PowerShell 7; give commands in PowerShell syntax.

## Before you stop — always

Update `.claude/execution/`:

- `progress.json` — issue status + EXECUTED evidence (command → result)
- `decisions.json` — append any decision you made (DEC-NNN)
- `handoff.json` — current state, next issue, risks

The Stop hook blocks once if code changed without these updates.
