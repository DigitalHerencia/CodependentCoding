---
applyTo: "**"
---

# Global Copilot Instructions

Rewritten Meta-Instructions for VS Code Copilot Chat (Agent Mode)

1. Scope

These rules define how Copilot Chat must behave whenever it generates or modifies anything inside the Loaded Vibes development framework.
They apply to every artifact, including:

Global instructions

Agent profiles

Prompts

Domain-specific instructions

Toolsets

VS Code settings and workspace configs

GitHub automation files

PRD / Tech Specs

Documentation and scripts

Any file or operation initiated through Copilot Chat

Copilot must apply these rules before producing output.

2. Use Current, Authoritative Documentation

For every artifact, Copilot Chat must consult up-to-date platform documentation, including:

OpenAI + Copilot Chat

GitHub Agents

VS Code

MCP Server gallery and protocol

Next.js 15 / React 19

Prisma + Neon/Postgres

Clerk

Vercel

Tailwind CSS

Playwright, Vitest

Relevant RFCs and standards

When describing architecture, best practices, security, patterns, or tool use, Copilot must cross-reference multiple sources.
If the technology changes quickly (e.g., Next.js, MCP), Copilot must note version assumptions.

3. Validation Requirements

Every artifact generated must satisfy:

Accuracy

Use real APIs

Use real file formats

Use real tool behavior

Syntactic correctness

JSON / JSONC must be valid

YAML must parse

Markdown must render

Code must compile

Semantic correctness

Must follow stack rules (Next.js 15, React 19, Prisma, Clerk, etc.)

Must follow security rules

Must follow project conventions

Cross-compatibility

Must integrate with the workspace settings

Must match existing toolsets and MCP servers

Must respect Copilot instructions defined in workspace settings

Must align with GitHub automation files

Security

Never expose secrets

No unsafe DB operations

No insecure auth patterns

ABAC, CSP, HSTS enforced

Never run destructive commands

Prefer Prisma MCP over raw SQL

Performance

Prioritize RSC + server actions

Use Next.js caching + Suspense correctly

Avoid unnecessary client components

Use optimized Prisma queries

Respect Neon connection hygiene

4. Artifact Generation Protocol

Whenever Copilot produces an artifact, it must:

Identify the artifact type

Examples:

“Generating: instructions file”

“Generating: stack agent profile”

“Generating: prompt script”

Apply the correct rule layer

Global layer → framework rules

Agent layer → tech stack rules

Prompt layer → environment/tool rules

Instruction layer → domain rules

Toolset layer → capability rules

Do not mix layers

Examples:

Global rules cannot include stack logic

Agent files cannot include environment logic

Prompts cannot include PRD parsing

Instructions cannot reference workspace settings

Toolsets must not define coding patterns

5. Cross-Referencing Requirements

Each artifact must include:

Correct references

Examples:

Prompts must reference the correct toolset + instructions

Instructions must reference their dev phase

Agent files must reference global.instructions.md

Correct folder structure

Copilot must adhere to the standardized paths:

/global.instructions.md
/agents/
/prompts/
/instructions/
/toolsets/
/docs/
/.github/
/.vscode/

Correct naming conventions

Use standard names and formats.

6. Optimization Standards

Copilot must optimize artifacts for:

Clarity

Clean structure

No redundant language

Clear responsibilities

Modularity

Layers remain independent

Artifacts remain interchangeable

Scalability

New agents, phases, or MCP servers must be easy to add

Maintainability

Small, readable files

No duplication

Logic sits only in its designated layer

7. Security Enforcement

Copilot must automatically enforce:

Clerk session validation

Proper ABAC checks

No unvalidated input

No inline secrets

Safe filesystem usage

Safe GitHub automation patterns

MCP-first for DB + auth

8. Performance Enforcement

Copilot must automatically enforce:

RSC-first rendering

Server Actions > API routes

Effective Suspense boundaries

Lazy loading where appropriate

Bundle size checks

Optimized Prisma operations

Neon hygiene (no excessive connections)

9. Behavior During Every Iteration

On every artifact creation or update:

Correct syntax + logic errors immediately

Validate cross-layer consistency

Fix any contradictions

Keep artifacts aligned with PRD + Tech Specs

Update the artifact instead of explaining what “should” be done

10. Production Gate

Copilot Chat must not generate an artifact if any meta-rule is violated.

If a conflict, missing dependency, or outdated pattern is detected, Copilot must:

Stop

Explain the issue

Request missing information

Or auto-correct the artifact when possible
