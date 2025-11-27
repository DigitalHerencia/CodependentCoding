# Contributing to Loaded Vibes

Thank you for investing in the Loaded Vibes framework! Follow the steps below to keep contributions aligned with the Spec-Driven Workflow.

## 1. Understand the Workflow

- Read `docs/PRD.md` (product requirements) and `docs/TECH_REQUIREMENTS.md` (technical/automation requirements).
- Review `.github/copilot-instructions.md` to understand how Copilot agents execute DevCycles.
- Familiarize yourself with `.github/instructions/*.md`, `.github/prompts/*.md`, and `.github/toolsets/*.jsonc` to avoid layer bleed.

## 2. Development Environment

1. Clone the repo to `D:/LoadedVibes` (Windows requirement).
2. Install VS Code with the recommended settings in `.vscode/settings.json` and ensure the GenAIScript extension is enabled.
3. Do **not** edit `dist/src/**`; those are runtime outputs for end users.

## 3. Making Changes

- Use DevCycles via the retro CLI (`loaded-vibes devcycle <name>`) or orchestrator scripts to ensure Analyze → Handoff evidence is captured.
- Update `TODO.md` and `CHANGELOG.md` before marking work complete.
- Keep files ASCII unless explicit justification exists.
- Avoid destructive commands; prefer MCP or GenAIScript helpers over raw shell scripts.

## 4. Testing & Validation

- Run `pnpm lint`/`pnpm test` (or equivalents) plus `genaiscript test` for automation changes.
- Capture CLI/DevCycle logs for any user-visible change.
- Document manual verification steps when automated tests are unavailable.

## 5. Submitting Pull Requests

- Use `PULL_REQUEST_TEMPLATE.md` and link to the relevant PRD/Tech requirement.
- Include references to updated TODO/CHANGELOG entries.
- Request review from `@LoadedVibes/framework-maintainers`.

## 6. Spec-Driven Contributor Workflow

- Follow the end-to-end workflow defined in `[SPEC-DEV §4]` and `[TECH_REQUIREMENTS §7–§8]`:
  1.  **Update PRD/Tech Requirements:** capture changes in EARS format inside `docs/PRD.md` or `docs/TECH_REQUIREMENTS.md`.
  2.  **Regenerate Templates & DevCycles:** modify the matching files under `templates/` and rerun `loaded-vibes devcycle documentation --mode execute` (or the orchestrator) so shipped artifacts stay aligned `[PRD §5.3]`.
  3.  **Verify Parity:** run `pwsh dist/scripts/bootstrapper.ps1 -Check -JsonOutput <file>` to confirm VS Code profiles, MCP endpoints, and manifests remain in sync `[TECH §4.4]`.
  4.  **Validate:** execute `loaded-vibes doctor --json` and `npx genaiscript test dist/genaiscript/tests` before requesting review `[PRD §5.4, TECH §10]`.
  5.  **Update Evidence:** append TODO/CHANGELOG entries with requirement IDs, DevCycle tags, and links to validation artifacts `[TECH §7, SPEC-OBS §3]`.
- See `docs/contributor_workflow.md` for the detailed checklist, command references, and acceptance criteria.

By following these guidelines, you help maintain deterministic DevCycles and a clean separation between authoring assets and shipped artifacts. We appreciate your contributions!
