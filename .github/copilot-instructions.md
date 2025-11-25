---
applyTo: "**"
---

# Global Copilot Instructions

Rewritten Meta-Instructions for VS Code Copilot Chat (Agent Mode)

## 1. Scope

These rules define how Copilot Chat must behave whenever it generates or modifies anything inside the Loaded Vibes development framework.

They apply to every artifact, including:

- Global instructions
- Agent profiles
- Prompts
- Domain-specific instructions
- Toolsets
- VS Code settings and workspace configs
- GitHub automation files
- PRD / Tech Specs
- Documentation and scripts
- Any file or operation initiated through Copilot Chat

Copilot must apply these rules before producing output.

## 2. Use Current, Authoritative Documentation

For every artifact, Copilot Chat must consult up-to-date platform documentation, including:

- OpenAI + Copilot Chat
- GitHub Agents
- VS Code
- MCP Server gallery and protocol
- Next.js 15 / React 19
- Relevant RFCs and standards

When describing architecture, best practices, security, patterns, or tool use, Copilot must consult the following documentation:

- `/docs/PRD.md`
- `/docs/TECH_REQUIREMENTS.md`
- Retro CLI and engine automation content previously stored in `docs/CLI_SPEC.md` and `docs/ENGINE_SPEC.md` now lives exclusively inside the consolidated PRD (§5) and Technical Requirements (§§5–10). Do not reference or recreate the deleted files—link to the new sections instead.

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
  - Must respect Copilot instructions defined in workspace settings
  - Must align with GitHub automation files
- **Security**
  - Never expose secrets
  - No unsafe DB operations
  - No insecure auth patterns
  - ABAC, CSP, HSTS enforced
  - Never run destructive commands
  - Prefer Prisma MCP over raw SQL
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

Whenever Copilot produces an artifact, it must:

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

  - Copilot must adhere to the standardized paths:
    - `lv_artifacts/.github/global.instructions.md`
    - `lv_artifacts/.github/agents/`
    - `lv_artifacts/.github/prompts/`
    - `lv_artifacts/.github/instructions/`
    - `lv_artifacts/.github/toolsets/`
    - `lv_artifacts/docs/`
    - `.github/` (Dev Environment)
    - `.vscode/` (Dev Environment)
    - `templates/` (Dev Environment)

- **Correct naming conventions**
  - Use standard names and formats.

## 6. Optimization Standards

Copilot must optimize artifacts for:

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

Copilot must automatically enforce:

- No unvalidated input
- No inline secrets
- Safe filesystem usage
- Safe GitHub automation patterns
- MCP-first for DB + auth

## 8. Performance Enforcement

Copilot must automatically enforce:

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

## 9. Behavior During Every Iteration

On every artifact creation or update:

- Correct syntax + logic errors immediately
- Validate cross-layer consistency
- Fix any contradictions
- Keep artifacts aligned with PRD + Tech Specs
- Update the artifact instead of explaining what "should" be done

## 10. Production Gate

Copilot Chat must not generate an artifact if any meta-rule is violated.

If a conflict, missing dependency, or outdated pattern is detected, Copilot must:

- Stop
- Explain the issue
- Request missing information
- Or auto-correct the artifact when possible

## 11. Environment Separation (Development vs. Shipped)

- **Workspace scope:** All development happens inside `D:/LoadedVibes` and is limited to the files listed in the user brief (`.github`, `.vscode`, `docs`, `templates`, `README.md`).
- **Shipped snapshot:** `D:/LoadedVibes/lv_artifacts` mirrors the payload delivered to end users. Treat it as read-only reference material unless you are explicitly updating the shipped package.
- **Runtime `src/` outputs:** When customers run Loaded Vibes, every generated asset must live inside `lv_artifacts/src/` within their copy of the package. Never read from or write to any `src/` folder while editing the framework source.
- **IDE/tooling hygiene:** VS Code settings, MCP configurations, and automation scripts must ignore `lv_artifacts/src/**` so authoring tasks stay isolated from runtime assets.
