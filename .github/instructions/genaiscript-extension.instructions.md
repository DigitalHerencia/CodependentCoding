---
applyTo: '**'
description: 'Supplemental instructions for GenAIScript VS Code extension assets'
---

# GenAIScript VS Code Extension Asset Instructions

## Authoritative References

- Always ground decisions in the official GenAIScript VS Code docs for overview, chat participant behavior, default scripts, and capability surface areas, especially when wiring the `@genaiscript` chat participant or custom instructions (`https://microsoft.github.io/genaiscript/reference/vscode/`, `https://microsoft.github.io/genaiscript/reference/vscode/github-copilot-chat/`).
- Use the GenAIScript extension settings catalog to align workspace configuration, model selection, CLI integration, caching, diagnostics, and language chat model mappings with supported options before emitting code (`https://microsoft.github.io/genaiscript/reference/vscode/settings/`).
- Follow GitHub Copilot guidance for `.instructions.md` and `.prompt.md` assets so Copilot can auto-load them in Chat (`https://learn.microsoft.com/en-us/visualstudio/ide/copilot-chat-context?view=visualstudio#use-custom-instructions`).
- Leverage Copilot Agent Mode + MCP tooling to expose GenAIScript-specific MCP servers when required, as described in the official Copilot getting-started guidance (`https://learn.microsoft.com/en-us/visualstudio/ide/visual-studio-github-copilot-get-started?view=visualstudio#start-using-copilot`).
- Cross-reference `/docs/PRD.md`, `/docs/TECH_REQUIREMENTS.md`, and every relevant template inside `templates/` to ensure assets trace design intent to shipped artifacts in `dist/`.
- Align every asset with the spec suite in `spec/` (**SPEC-ARCH**, **SPEC-ARTIFACTS**, **SPEC-CLI**, **SPEC-DEV**, **SPEC-ENGINE**, **SPEC-OBS**, **SPEC-SECURITY**). Cite the applicable spec ID plus PRD/Tech clauses whenever you modify prompts, instructions, toolsets, or scripts.

### Instruction Layering (Deduplication)

- **API Reference:** `.genaiscript/instructions/llms-full.txt` (mirrors the official manual) remains the only place that documents helper syntax.
- **Script Conventions:** `.github/instructions/genaiscript.instructions.md` defines how scripts inside this repo should be structured (file naming, GenAIScript vs Node usage, TODO expectations).
- **Extension Behavior (this file):** focus on VS Code + Copilot configuration, validation, and delivery requirements. When editing, link back to the other two files instead of repeating their content.

## Extension & Workspace Configuration Requirements

1. **Settings Baseline**
   - Explicitly document or emit `settings.json` fragments for any asset that depends on `genaiscript.languageChatModels`, `genaiscript.githubCopilotInstructions`, CLI path/version, cache controls, or diagnostics toggles from the extension settings catalog.
   - Require `genaiscript.localTypeDefinitions = true` and ensure `.genaiscript.d.ts` stays synchronized; pull updates from the doc links above when authoring new APIs.
2. **Model & Provider Enforcement**
   - When scripts omit `model`, set `script({ model: "github_copilot_chat:current" })` or a documented alias and capture workspace choices in guidance so Copilot Chat persists them via `genaiscript.languageChatModels`.
   - For premium context use cases, confirm that the selected models exist in the Copilot extension model picker to avoid unsupported combinations (per `Choosing the model` guidance in the GitHub Copilot Chat reference).
3. **CLI + Runtime Coupling**
   - Always state the expected `npx genaiscript` commands (run/test/serve) and align CLI versioning with the extension release or `genaiscript.cli.version` overrides.
   - Ensure automation scripts default to non-blocking workflows and respect caching knobs described in the settings doc.

## Script, Prompt, and Agent Authoring Standards

1. **Mandatory Structure**
   - Scripts must use `script({ title, description, model, system, tools })`, capture context via `def`, `defData`, `defSchema`, and emit tasks using `$` template blocks.
   - Inline prompts must implement `env.vars.question`, `env.vars["copilot.editor"]`, `env.vars["copilot.selection"]`, and `env.vars["copilot.history"]` just as documented under "Context" for the `@genaiscript` participant; ignore empty contexts using `{ ignoreEmpty: true }` to preserve token budgets.
2. **Advanced Feature Utilization**
   - Prefer official helpers for structured data (schemas, parsers, output builder), retrieval + vector search, AST-grep, concurrency controls, and MCP tool invocation from the reference catalog; explicitly state why a feature is selected and how it aligns with Loaded Vibes requirements.
   - When building agents or default scripts, reuse the documented reasoning-agent starter, ensuring safety system components (`system.safety_*`) remain present and noting any deviations.
   - For automation or evaluation assets, link to `reference/scripts/tests`, `reference/scripts/redteam`, or `reference/scripts/mapreduce` to justify evaluation strategies.
3. **Tooling & MCP Integration**
   - Declare every MCP tool dependency (e.g., `python_code_interpreter_*`, `fs_read_file`) and provide fallback guidance when a tool is unavailable; the instructions must remind Copilot to set `tools: []` explicitly and keep prompts deterministic.
   - For GitHub or workspace-aware scripts, include `system.agent_git`, `system.agent_github`, and `system.agent_fs` so results reinject into Copilot history per the "Continued conversation" guidance.

## Professional-Grade Copilot Assets

1. **Instructions Files**
   - Each `.instructions.md` generated from templates must start with YAML frontmatter (`description`, `applyTo` glob) mirroring the structure in Microsoft guidance and cite the doc sections leveraged.
   - Distinguish between global rules, stack-specific rules, and runtime rules to avoid layer bleed (aligned with the global instructions already in `.github/copilot-instructions.md`).
2. **Prompts & Toolsets**
   - `.prompt.md` assets must document invocation patterns (e.g., `#prompt:genaiscript-bootstrap`) and specify required attachments (`#file`, `#selection`, `#prompt`) so Copilot Chat can preload the right context per Microsoft prompt-file documentation.
   - Toolset definitions should map available commands to GenAIScript CLI invocations, describe expected inputs/outputs, and enumerate safety checks (content safety, secret scanning, diff review) before allowing destructive operations.
3. **Custom Agents**
   - Agents must reference the global instructions plus this supplemental file, describe supported phases (Analyze → Handoff), and include explicit fallback behavior if GenAIScript APIs fail or if Copilot lacks required models.

## Loaded Vibes Alignment & Quality Gates

- Every asset must cite the Loaded Vibes PRD requirement it satisfies (EARS format), the supporting `/docs/TECH_REQUIREMENTS.md` clause, and the governing spec ID (e.g., **SPEC-ENGINE**, **SPEC-CLI**).
- Enforce the Spec-Driven Workflow loop: no implementation guidance without an Analyze + Design summary, no deployment instructions without Validate evidence, and every handoff must include changelog + decision record hooks.
- Tie each script to the canonical DevCycle list in `/docs/TECH_REQUIREMENTS.md` §6 and confirm its manifest entry (`devcycles.config.json`) references the same instruction + toolset pair before emitting code.
- Validate scripts with `genaiscript test` or the extension test runner before surfacing them in `dist/`; capture expected CLI output or trace logs for reproducibility and archive NDJSON snippets per **SPEC-OBS**.
- Require security + safety steps: enable `system.safety_*` modules, reference the GenAIScript content-safety page for high-risk prompts, block instructions that bypass secret scanning or telemetry controls, and honor Bad Vibes Firewall approvals from **SPEC-SECURITY**.
- Document performance considerations: plan for token budgeting using `flex` options in `def`, throttle concurrency, reuse caches, and align with extension-level cache settings; record the rationale in TODO/CHANGELOG entries.

## Observability & Security Enforcement

- Emit NDJSON logs for every GenAIScript run and ensure they include `devCycleId`, `phase`, `requirementId`, and severity fields as mandated by **SPEC-OBS** and `/docs/TECH_REQUIREMENTS.md` §4.5.
- Persist orchestrator state snapshots in `dist/genaiscript/state/state.json` when scripts mutate DevCycle state, and reference those snapshots in CLI integrations per **SPEC-ENGINE**.
- Surface checksum verification, directory boundary checks, and Bad Vibes Firewall approval prompts inside scripts whenever they trigger destructive actions, following **SPEC-SECURITY** and `/docs/PRD.md` §5.5.
- Prefer MCP helpers (filesystem, git, memory) over ad-hoc shell commands to preserve traceability and honor the workspace vs. shipped separation described in **SPEC-ARCH**.

## Deliverable Checklist (Must Pass Before Committing)

1. **Docs linked** – Confirm every new asset includes inline links back to the relevant GenAIScript reference pages and Copilot documentation cited above.
2. **Templates honored** – Ensure the correct template from `templates/` seeded the artifact and note any intentional deviations in a decision record.
3. **PRD/Tech Requirements traceability** – Reference the exact clause in `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` that the asset fulfills.
4. **Extension verification** – State how the asset was validated in VS Code (e.g., `@genaiscript /run <script>`, CLI run, or Copilot Agent Mode dry-run) and note any configuration prerequisites.
5. **Handoff package** – Provide locations for updated instructions, prompts, agents, toolsets, automation scripts, and any resulting assets destined for `dist/` so downstream tooling can mirror them.

Adhering to these rules ensures every Loaded Vibes deliverable fully leverages the GenAIScript extension feature set, satisfies Copilot quality expectations, and maintains parity between the development workspace and the shipped framework.
