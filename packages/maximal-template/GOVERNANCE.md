# Governance

How this app goes from template to MVP, and how every change stays traceable to the owner's intent.

## The chain

1. **Intent** — the owner's requirements, captured in the five docs in `context/docs/`.
2. **Specs** — the 100-step build process in `context/specs/`. Each doc section lists the specs it feeds; each spec lists the sections that feed it.
3. **Contracts** — `.agents/contracts/*.yaml`, the machine-readable translation of the docs. Each block names the doc section it translates.
4. **Issues** — one GitHub issue per spec (and per sub-issue), on the Project board, under its milestone.
5. **Pull requests** — one spec or sub-issue per PR, closing its issue.
6. **Evidence** — `.agents/execution/progress.json` records the checks that prove each spec; `decisions.json` records decisions; `handoff.json` carries state between sessions.

`pnpm governance:validate` checks that steps 1–3 agree and that the GitHub metadata is valid.

## IDs

`ENG-{milestone}-{phase}-{devcycle}-T##`, for example `ENG-M2-P2.1-MVP-T02`. Milestones and phases organize project management; dev cycles make sure the whole build is covered; specs trace work to intent. Sub-issues extend their parent: `ENG-M2-P2.1-FEATURES-T01.3`. IDs never change; titles may.

## Cadence

- **once** — done one time.
- **repeatable** — runs again whenever needed (debugging, reviews, updates); one sub-issue per run.
- **expandable** — covers a list (for example one sub-issue per product feature).
- **gate** — the T05 of every dev cycle; closes only with owner approval recorded in `decisions.json`.

## Project board

The Project uses the default Status field (Todo, In Progress, Done) and the default workflows: a closed issue or merged PR moves to Done. Milestones are native GitHub milestones; phase, dev cycle and cadence are labels.

## Approval required

Ask the owner before production deploys, destructive migrations or data changes, changes to authentication, authorization or tenancy, and any irreversible action.

## Changing the process

Change the docs, specs and contracts together, then run `pnpm governance:validate`. Never delete or renumber a spec; close an inapplicable one as not planned and record why.
