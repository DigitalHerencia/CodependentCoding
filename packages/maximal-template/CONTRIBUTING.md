# Contributing

## Setup

Node.js 24 and pnpm. Install with `pnpm install`, copy `.env.example` to `.env.local`, and fill in the values.

## Workflow

1. Pick the next issue on the Project board (or `next_spec_id` in `.agents/execution/handoff.json`).
2. Branch from `main`: `<type>/<spec-id>-<slug>`, for example `feat/ENG-M2-P2.1-MVP-T02-billing-webhooks`.
3. Do only what the spec's acceptance criteria cover. File anything else as a new sub-issue.
4. Run the checks: `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, plus the tests the spec lists.
5. Open a PR with the template, closing the issue. Record evidence in `.agents/execution/progress.json`.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/) with the spec ID: `feat(billing): verify Stripe webhook signatures [ENG-M2-P2.1-MVP-T02]`.

## Rules

- Fix the cause of a lint or type finding; never disable a rule to pass.
- A bug fix includes a regression test that fails before the fix.
- Report only checks you actually ran.

See [GOVERNANCE.md](GOVERNANCE.md) for the full delivery process.
