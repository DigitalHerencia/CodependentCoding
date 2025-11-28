---
applyTo: '**'
---

# Global Agent Instructions

Rewritten Meta-Instructions for Code Agent

## 1. Scope

**Framework Development Agent Instructions**

These rules define how GitHub Copilot agents assist **maintainers building the Loaded Vibes framework** inside the `D:/LoadedVibes/` development workspace.

**Primary Responsibilities:**

- Generate shipped framework assets destined for `dist/**` from `templates/`
- Author GenAIScript orchestrator, phase runners, and shared utilities
- Create DevCycle manifests, prompts, instructions, and toolsets
- Maintain PRD, technical specs, and decision records
- Build CLI commands and bootstrapper scripts
- Configure maintainer-only VS Code workspace (`.vscode/`, `.github/`)
- Never confuse development workspace with end-user runtime environment

**Applies to authoring:**

- `dist/.github/**` - shipped Copilot instructions for end users
- `dist/genaiscript/**` - orchestrator engine and DevCycle scripts
- `dist/cli/**` - CLI commands users run
- `docs/`, `spec/`, `templates/` - source-of-truth documentation
- `.github/`, `.vscode/` - maintainer workspace configuration

Agent must distinguish between developing the framework (this workspace) and using it (end-user projects).

## 2. Use Current, Authoritative Documentation

For every artifact, the Agent must consult up-to-date platform documentation, including:

- OpenAI + Agent Chat
- GitHub Agents
- VS Code
- MCP Server gallery and protocol
- Relevant RFCs and standards

When describing architecture, best practices, security, patterns, or tool use, the Agent must consult the following documentation:

- `/docs/PRD.md`
- `/docs/TECH_REQUIREMENTS.md`
- Retro CLI and engine automation content previously stored in `docs/CLI_SPEC.md` and `docs/ENGINE_SPEC.md` now lives exclusively inside the consolidated PRD (§5) and Technical Requirements (§§5–10). Do not reference or recreate the deleted files—link to the new sections instead.
- Specs under `spec/` (**SPEC-ARCH**, **SPEC-ARTIFACTS**, **SPEC-CLI**, **SPEC-DEV**, **SPEC-ENGINE**, **SPEC-OBS**, **SPEC-SECURITY**) expand on architecture, artifact taxonomy, CLI behaviors, maintainer workflow, engine orchestration, observability, and security requirements. Cite the applicable spec ID plus PRD/Tech clauses in every artifact you modify or generate.

## 3. Validation Requirements

Every artifact generated must satisfy:

- **Accuracy**
  - Use real APIs
  - Use real file formats
  - Use real tool behavior
- **Syntactic correctness**
  - JSON / JSONC must be valid
  - YAML must parse
  - Markdown must render
  - Code must compile
- **Semantic correctness**
  - Must follow performance rules
  - Must follow security rules
  - Must follow project conventions
- **Cross-compatibility**
  - Must integrate with the workspace settings
  - Must match existing toolsets and MCP servers
  - Must respect Agent instructions defined in workspace settings
  - Must align with GitHub automation files
- **Security**
  - Never expose secrets
  - No unsafe DB operations
  - No insecure auth patterns
  - ABAC, CSP, HSTS enforced
  - Never run destructive commands
  - Prefer Prisma MCP over raw SQL
  - Enforce **SPEC-SECURITY** controls (Bad Vibes Firewall approvals, SHA verification, log redaction, and directory boundaries)
- **Performance**
  - Use non-blocking I/O for external calls
  - Parallelize independent operations
  - Implement proper timeout handling
  - Stream large responses when possible
- **Resource optimization**
  - Minimize memory allocations
  - Clean up resources promptly
  - Avoid unnecessary data transformations
  - Reuse connections and clients
  - Limit concurrent operations appropriately

## 4. Artifact Generation Protocol

Whenever Agent produces an artifact, it must:

- **Identify the artifact type**

  - Examples:
    - "Generating: instructions file"
    - "Generating: stack agent profile"
    - "Generating: prompt script"

- **Apply the correct rule layer**

  - Global layer → framework rules
  - Agent layer → tech stack rules
  - Prompt layer → environment/tool rules
  - Instruction layer → domain rules
  - Toolset layer → capability rules

- **Do not mix layers**
  - Examples:
    - Global rules cannot include stack logic
    - Agent files cannot include environment logic
    - Prompts cannot include PRD parsing
    - Instructions cannot reference workspace settings
    - Toolsets must not define coding patterns

## 5. Cross-Referencing Requirements

Each artifact must include:

- **Correct references**

  - Examples:
    - Prompts must reference the correct toolset + instructions
    - Instructions must reference their dev phase
    - Agent files must reference global.instructions.md

- **Correct folder structure**

  - Agent must adhere to the standardized paths:
    - `dist/.github/global.instructions.md`
    - `dist/.github/agents/`
    - `dist/.github/prompts/`
    - `dist/.github/instructions/`
    - `dist/.github/toolsets/`
    - `dist/docs/`
    - `.github/` (Dev Environment)
    - `.vscode/` (Dev Environment)
    - `templates/` (Dev Environment)

- **Correct naming conventions**
  - Use standard names and formats.

## 6. Optimization Standards

The Agent must optimize artifacts for:

- **Clarity**
  - Clean structure
  - No redundant language
  - Clear responsibilities
- **Modularity**
  - Layers remain independent
  - Artifacts remain interchangeable
- **Scalability**
  - New agents, phases, or MCP servers must be easy to add
- **Maintainability**
  - Small, readable files
  - No duplication
  - Logic sits only in its designated layer

## 7. Security Enforcement

The Agent must automatically enforce:

- No unvalidated input
- No inline secrets
- Safe filesystem usage
- Safe GitHub automation patterns
- MCP-first for DB + auth

## 8. Performance Enforcement

The Agent must automatically enforce:

- **Efficient data access patterns**

  - Minimize round-trips to data sources
  - Use batching and connection pooling
  - Avoid N+1 queries
  - Implement pagination for large datasets
  - Cache frequently accessed data

- **Rendering and delivery**

  - Server-side rendering where appropriate
  - Progressive loading patterns
  - Lazy loading for non-critical resources
  - Optimize payload sizes
  - Use compression for responses

- **Caching strategies**

  - Implement appropriate cache layers
  - Set correct cache expiration policies
  - Use cache invalidation patterns
  - Leverage edge caching where available
  - Avoid over-caching dynamic content

- **Error handling**
  - Fail fast on invalid input
  - Use circuit breakers for external dependencies
  - Implement graceful degradation
  - Log performance bottlenecks
  - Monitor and alert on threshold violations
  - Capture NDJSON and Markdown evidence per **SPEC-OBS** so every remediation remains traceable

## 9. Behavior During Every Iteration

On every artifact creation or update:

- Correct syntax + logic errors immediately
- Validate cross-layer consistency
- Fix any contradictions
- Keep artifacts aligned with PRD + Tech Specs
- Update the artifact instead of explaining what "should" be done

## 10. Production Gate

The Agent must not generate an artifact if any meta-rule is violated.

If a conflict, missing dependency, or outdated pattern is detected, the Agent must:

- Stop
- Explain the issue
- Request missing information
- Or auto-correct the artifact when possible

## 11. Environment Separation (Development vs. Shipped)

- **Workspace scope:** All development happens inside `D:/LoadedVibes` and is limited to the files listed in the user brief (`.github`, `.vscode`, `docs`, `templates`, `README.md`).
- **Shipped snapshot:** `D:/LoadedVibes/dist` mirrors the payload delivered to end users. Treat it as read-only reference material unless you are explicitly updating the shipped package.
- **Runtime `src/` outputs:** When customers run Loaded Vibes, every generated asset must live inside `dist/src/` within their copy of the package. Never read from or write to any `src/` folder while editing the framework source.
- **IDE/tooling hygiene:** VS Code settings, MCP configurations, and automation scripts must ignore `dist/src/**` so authoring tasks stay isolated from runtime assets.

## 12. Spec-Driven Workflow Loop

- Follow the Analyze → Design → Implement → Validate → Reflect → Handoff cadence defined in `/docs/PRD.md` (Execution Workflow) and enforced by **SPEC-DEV**. Never skip a phase; document outcomes, blockers, and evidence in TODO/CHANGELOG immediately after each loop.
- Capture requirements in EARS notation before implementing work. Each requirement must cite the originating PRD and Tech Requirements clauses plus any supporting spec IDs.
- Record Decision Records and Action Logs using the templates defined in `global.instructions.md` to satisfy traceability obligations.

## 13. Artifact & Directory Governance

- Apply the layer boundaries from **SPEC-ARCH**: Development assets (`.github/`, `.vscode/`, `docs/`, `templates/`) may reference shipped assets only through templates and manifests; never import runtime outputs.
- Use the taxonomy from **SPEC-ARTIFACTS** when generating prompts, instructions, toolsets, agents, or workspace profiles. Each artifact must list its DevCycle, manifest entry, and template of origin.
- Do not edit `dist/**` unless executing an approved regeneration DevCycle; log checksum evidence, requirement IDs, and validation steps in TODO/CHANGELOG when you do.

## 14. DevCycle & Manifest Guardrails

- Adhere to the canonical DevCycle list in `/docs/TECH_REQUIREMENTS.md` §6. Manifest entries (`devcycles.config.json`) must always specify `instruction`, `prompt`, `toolset`, description, and checkpoints; **SPEC-ENGINE** defines the enforcement rules.
- When editing DevCycle assets, cross-reference **SPEC-CLI** for console interactions, **SPEC-DEV** for maintainer workflow gates, and `/docs/PRD.md` §5 for governance expectations.
- Ensure each phase logs requirement IDs, checkpoint approvals, and NDJSON telemetry per `/docs/TECH_REQUIREMENTS.md` §4.2–4.5 and **SPEC-OBS**.

## 15. Observability & Security Enforcement

- Append requirement-linked summaries to `TODO.md` and `CHANGELOG.md`, attach NDJSON snippets when applicable, and store state snapshots under `dist/genaiscript/state/state.json` in line with **SPEC-OBS** and `/docs/TECH_REQUIREMENTS.md` §4.5.
- Honor checksum verification, directory boundaries, and Bad Vibes Firewall prompts from `/docs/PRD.md` §5.5 and **SPEC-SECURITY**; blocking actions cannot proceed without documented human approval.
- Prefer MCP or GenAIScript helpers over ad-hoc shell commands to maintain traceability, replayability, and secret hygiene across DevCycles.
