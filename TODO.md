# TODO

This backlog tracks Spec-Driven Workflow actions for the Loaded Vibes framework. Update this file at the end of every DevCycle per `docs/PRD.md` §2 and `docs/TECH_REQUIREMENTS.md` §10.

## Active Items

| Status | Item                                                                                                                                                                                                      | Source                                 |
| ------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------- |
| ☐      | Ship the `create-loaded-vibes` npm package with download/verification/extraction flow plus `loaded-vibes init` automation that mirrors `lv_artifacts/**` into `.loaded-vibes/` and logs install metadata. | PRD §5.1-5.3, CLI Spec §2              |
| ☐      | Implement retrofit/attach workflow (Mirror / Merge / Sandbox) with conflict detection for `.github`, `.vscode`, and `lv_artifacts/**`, writing results to `.loaded-vibes/logs/install-YYYYMMDD.md`.       | CLI Spec §2.4                          |
| ☐      | Build the retro dashboard (`loaded-vibes dashboard`) with DevCycle queue, live orchestrator logs, metrics pane, TODO/CHANGELOG feeds, notifications, and command palette actions.                         | PRD §5.2, Tech Requirements §5         |
| ☐      | Integrate DevCycle runner service that streams `genaiscript/orchestrator.genai.js` output into the CLI UI with pause/resume checkpoints and approval prompts.                                             | Tech Requirements §4.2, Engine Spec §4 |
| ☐      | Finish GenAIScript engine coverage: populate `devcycles.config.json` entries for all phases, author prompts/toolsets/instructions, and ensure phase scripts update TODO/CHANGELOG + state.                | Tech Requirements §4.1-4.3             |
| ☐      | Add reusable `tasks.json` entries for orchestrator runs, retro CLI smoke tests, lint/test shortcuts, and bootstrap validation.                                                                            | Tech Requirements §8                   |
| ☐      | Implement CI guard that ensures `.vscode/settings.json` only references `.github/copilot-instructions.md` (no shipped instructions) and blocks edits outside allowed directories.                         | Tech Requirements §11                  |
| ☐      | Capture and document CLI telemetry export format (JSON vs Markdown) then wire NDJSON log streaming + export commands.                                                                                     | Tech Requirements §11, CLI Spec §3.3   |
| ☐      | Harden bootstrapper (TS + PowerShell) to validate VS Code profiles, MCP endpoints, manifest coherence, and emit machine-readable status for CI + CLI.                                                     | Tech Requirements §4.4                 |
| ☐      | Implement automated security + safety gates: SHA256 verification of releases, "Bad Vibes Firewall" prompts, and sandboxed file writes confined to `.loaded-vibes/**`.                                     | PRD §5.5, Tech Requirements §5.4       |
| ☐      | Author end-user documentation (README quickstart, SUPPORT, SECURITY, CHANGELOG) that explains installation, dashboard usage, DevCycle governance, and troubleshooting workflows.                          | PRD §§2-4                              |

## Recently Completed

| Status | Item                                                               | Notes                    |
| ------ | ------------------------------------------------------------------ | ------------------------ |
| ☑      | Consolidated PRD + Tech Requirements to absorb CLI & engine specs. | Logged in `CHANGELOG.md` |
