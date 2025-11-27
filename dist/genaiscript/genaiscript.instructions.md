---
applyTo: "**/*.genai.*"
description: "Instructions for working with GenAIScript files"
---

## GenAIScript Code Generation Instructions

GenAIScript is a custom runtime for Node.js that favors declarative prompt assembly through tagged template literals, shared context helpers, and deterministic tool invocation. Follow the layered guidance below to avoid duplicating rules that already exist elsewhere:

1. **Reference order**

   - Workspace/extension rules live in `.github/genaiscript-extension.instructions.md` and describe how VS Code + Copilot should load scripts, contexts, and MCP integrations.
   - This file defines repository-specific coding conventions for `.genai.*` assets.
   - The upstream API manual lives in `.genaiscript/instructions/llms-full.txt` (mirrors https://microsoft.github.io/genaiscript/llms-full.txt) and should be used for syntax or helper details when needed.

2. **Authoring requirements**

   - Always emit **TypeScript** using **ESM syntax**; GenAIScript ambient types from https://microsoft.github.io/genaiscript/genaiscript.d.ts are automatically in scope—no imports required.
   - Prefer GenAIScript globals (`script`, `def`, `env`, `run`, `filesystem`, MCP helpers, etc.) over raw Node APIs. Only access the Node runtime when a GenAIScript helper does not exist and document the exception with a `TODO`.
   - Keep code intention-revealing and minimal: avoid try/catch wrappers, imperative logging, or hand-rolled parsers unless mandated by Tech Requirements.
   - Use inline `TODO:` comments whenever assumptions or follow-up actions need human review.

3. **File layout & naming**

   - Save new scripts under `./genaisrc/` with the `.genai.mts` extension so the CLI + GenAIScript extension auto-detect them.
   - Group shared utilities under `genaisrc/shared/` and prefer exporting small helpers over duplicating logic inside individual scripts.
   - When generating outputs, honor the Spec-Driven Workflow contract: persist context into `memory/state.json`, update TODO/CHANGELOG stubs when applicable, and respect the directory separation described in the PRD.

4. **Prompt construction tips**

   - Pull requirement snippets via `defMarkdown`/`def` helpers so prompts cite `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` explicitly.
   - When referencing files, prefer `workspace.readText()` + `def` rather than embedding large strings manually.
   - Favor structured outputs by defining schemas (`defSchema`) and referencing them inside `$`` prompts, especially for changelog or TODO updates.

5. **Tooling defaults**
   - Scripts execute within the Loaded Vibes Copilot agent; assume `.github/copilot-instructions.md` already enforced safety rails—do not disable them.
   - Use built-in tools (`filesystem`, `git`, `todos`, `runTests`, `memory`, `runSubagent`, etc.) per the manifest to keep DevCycles deterministic.
   - Whenever a script exposes additional tools, document them inline and register them with `defTool` along with short descriptions for the retro CLI to surface.

Following this ordering keeps GenAIScript guidance DRY: extension-level rules define the environment, this file defines repository conventions, and `llms-full.txt` remains the canonical API reference.
