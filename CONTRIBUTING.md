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

By following these guidelines, you help maintain deterministic DevCycles and a clean separation between authoring assets and shipped artifacts. We appreciate your contributions!

