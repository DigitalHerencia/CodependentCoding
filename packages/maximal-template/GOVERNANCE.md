# Delivery governance

**Authority:** User-approved scope and repository contracts take priority. Historical GitHub CC issues are not the engineering roadmap authority. The Engineering exports define the 100-spec scope. [Ticketing SOP](https://app.notion.com/p/2d8a4e63bf2380dd9a04cbbb762b9c7c) governs ticket relationships and work-code semantics.

## Chain

Milestone → Phase → Dev Cycle → JSON Specification → GitHub Issue → PR/CI → Agent execution record.

Every one of the five documentation templates includes a requirement slot for each spec. The three agent contracts map all 100 specs to those source slots. `progress.json` reports actual evidence; `decisions.json` references affected specs; `handoff.json` carries the next spec. No document is silently self-approving.

## Ticket rules

One spec corresponds to one ticket (target ≤ one workday, per Ticketing SOP). One GitHub Issue should represent one spec. Use `[SPEC-ID] feat|fix(devcycle): title` and the native GitHub milestone field. Phases and dev cycles are labels; do not duplicate native milestone with a label. Each issue receives the `tracked` intake label. A PR closes the matching issue only after acceptance and required checks.

## Project statuses

`Backlog → Todo → In Progress → In Review → Done`. Consult `.github/project.json`; a JSON configuration file does not configure Projects v2 automatically. Do not conflate an issue closure with unverified product acceptance.

## Gates

Before any production deployment, destructive data changes, changes to security boundaries or irreversible actions, obtain explicit human approval. Changes to docs/contracts/specs that alter requirements are recorded as decisions and reviewed, not silently synchronized.
