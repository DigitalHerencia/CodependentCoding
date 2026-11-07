# .agents

What agents read to build the app and write to record their work.

## contracts/

Machine-readable translation of `context/docs/`. Every block has a `source` naming the doc section it translates; each doc section appears exactly once.

| File               | Translates                                                                                |
| ------------------ | ----------------------------------------------------------------------------------------- |
| `application.yaml` | PRD, tech requirements, architecture and AUTH: what to build and the rules it must follow |
| `validation.yaml`  | Checks, test suites, CI, performance budgets, threat model, evidence rules                |
| `design.yaml`      | Design.md: brand, tokens, components, pages, states, accessibility, SEO, analytics        |

`status` moves `template` → `draft` → `approved`. Do not build from a template contract.

## execution/

| File             | Written when                                                                                                   |
| ---------------- | -------------------------------------------------------------------------------------------------------------- |
| `progress.json`  | After every check: one entry per spec with status, issue, PRs and the commands actually run with their results |
| `decisions.json` | Whenever a decision is made: append-only, with the spec IDs it affects                                         |
| `handoff.json`   | Last thing before a session ends: active and next spec, risks, next actions                                    |
