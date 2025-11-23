# **Loaded Vibes Development Framework Specification**

## **Version:** 1.0

## **Status:** Complete

## **Audience:** Engineers, AI Agents, Architect-Level Contributors

## **Scope:** Full-project automation and human-in-the-loop orchestration

---

# **1. Overview**

The **Loaded Vibes Development Framework** defines a complete, deterministic, AI-assisted software-development workflow. It establishes:

- A single **global instructions layer** that governs all activity
- A single **custom agent** per project (tech-stack-specific)
- A strict sequence of **18 DevCycles** representing the entire development lifecycle
- A set of **prompts, instructions, and toolsets** that orchestrate all execution
- A unified **environment profile** ensuring reproducibility
- A **bootstrapper** that configures the workspace, agent, MCP servers, and settings
- A requirement to keep **humans in the loop** at critical checkpoints
- Artifact generation (docs, templates, scaffolds, PRD, TechReq) via LLM automation

This framework is **language-agnostic**, **stack-agnostic**, and **environment-deterministic**, enabling the same workflow across any project.

---

# **2. Core Principles**

### **2.1 Single Agent Model**

Only one custom agent exists per project.
All DevCycles, prompts, tasks, and tooling delegate to this agent.

### **2.2 Deterministic DevCycles**

Each DevCycle is an isolated, well-defined phase with:

- One prompt
- One instructions file
- One toolset
- A deterministic workflow
- A clean definition of inputs and outputs

### **2.3 Tech-Stack Agnostic at Framework Layer**

Global instructions, prompts, instructions, and DevCycles do not reference any specific technologies.

Only the **custom agent** implements the stack (e.g., Next.js 15, Prisma, Clerk, Tailwind, etc.).

### **2.4 Human-In-The-Loop**

At every DevCycle, the framework requires:

- Human review of generated tasks
- Human approval before major actions
- Updates to `todo.md` and `CHANGELOG.md`

### **2.5 Reproducible Environments**

Toolsets and profile configuration ensure:

- MCP server consistency
- Extension synchronization
- Formatting/linting stability
- Workspace determinism

---

# **3. Artifact Layers**

## **3.1 Global Instructions (Framework Layer)**

**File:** `global.instructions.md`
Defines:

- Framework rules
- DevCycle list
- Artifact categories
- Workflow orchestration
- Human-approval requirements
- Delegation rules

This is the top-level governance document.

---

## **3.2 Custom Agent (Tech-Stack Layer)**

**File:** `.github/copilot-instructions.md` (one per project)

Defines:

- Stack-specific architecture
- Required patterns
- Framework compliance
- Error detection + auto-correction rules
- Self-governance (linting, formatting, structure enforcement)

All DevCycles run through this agent.

---

## **3.3 DevCycle Prompts (Environment Layer)**

**Directory:** `/prompts/*.prompt.md`

Each:

- Triggers exactly one DevCycle
- Loads its corresponding instructions file
- Loads its corresponding toolset
- Delegates execution to the custom agent
- Returns tasks + clarifications for human review

---

## **3.4 DevCycle Instructions (Domain Layer)**

**Directory:** `/instructions/*.instructions.md`

Each file:

- Defines the full responsibilities of its DevCycle
- Lists required inputs and outputs
- Provides goals, constraints, and success metrics
- References its toolset
- Isolated from stack-specific logic

---

## **3.5 Toolsets (Execution Layer)**

**Directory:** `/toolsets/*.jsonc`

Each:

- Lists allowed tools
- Lists allowed MCP servers
- Lists allowed VS Code extensions
- Enforces security boundaries
- Determines what the agent is permitted to do in that DevCycle

---

## **3.6 Workspace Profiles & Settings (Environment Configuration Layer)**

Includes:

- `settings.json`
- `user.settings.json`
- `extensions.json`
- `mcp.json`

These determine available tools and environment behavior.

---

## **3.7 Bootstrapper (Automation Layer)**

Files:

- `bootstrapper.ps1`
- `bootstrapper.genaiscript.ts`

Responsibilities:

- Detect environment
- Install/verify required extensions
- Register MCP servers
- Generate/update the project profile
- Configure GenAI memory and cross-agent context
- Add VS Code tasks
- Prepare workspace for DevCycle execution

---

## **3.8 Auxiliary Artifacts (Documentation Layer)**

Includes:

- PR templates
- Issue templates
- README scaffolds
- CONTRIBUTING.md
- SECURITY.md
- SUPPORT.md
- CODEOWNERS
- PRD + TechReq templates
- Test plan generators
- Memory files

Generated via: GenAIScript or on demand.

---

# **4. Canonical DevCycle Sequence**

### **1. Initialization**

Audit environment, detect servers, validate PRD/TechReq, output readiness.

### **2. Scaffolding**

Create the project structure.

### **3. Configuration**

Configure tools, settings, secrets, etc.

### **4. Verification**

Run static checks.

### **5. Data**

Create schema, migrations, seed data.

### **6. Auth**

Auth framework, roles, permissions, onboarding.

### **7. Testing**

Test architecture setup + feature test plans.

### **8. Validation**

Business rules + UX alignment.

### **9. Features**

Actual implementation.

### **10. Debug**

Resolve issues and stabilize.

### **11. Security**

Hardening + privacy + access control.

### **12. Performance**

Optimization + dependency audits + tech-debt cleanup.

### **13. Observability**

Telemetry, alerts, logs, dashboards.

### **14. Code Review**

Human + AI enforcement of standards.

### **15. Documentation**

Generate public and contributor docs.

### **16. CI/CD**

Automate build/test/deploy flows.

### **17. Deploy**

Ship to production, validate, prepare rollback.

### **18. Updates**

Post-launch improvements, patch notes, regeneration cycles.

---

# **5. Full Workflow Summary**

```
PRD + TechReq → Initialization → Scaffolding → Configuration → Verification
→ Data → Auth → Testing → Validation → Features
→ Debug ↔ Testing ↔ Validation
→ Security → Performance → Observability
→ Code Review → Documentation → CI/CD → Deploy → Updates
```

Every DevCycle produces:

- tasks → appended to `todo.md`
- change descriptions → appended to `CHANGELOG.md`
- structured outputs → for the next DevCycle

The framework loops and regenerates as PRD/TechReq evolve.

---

# **6. Compliance Requirements**

The custom agent must:

- Follow global instructions
- Use only tools from the active toolset
- Never bypass DevCycle boundaries
- Always request human approval
- Update todos and changelogs
- Use PRD + TechReq as the single source of truth
- Prioritize security, correctness, and reproducibility

---

# **7. Artifact Generation Requirements**

- All instructions files: **GenAIScript (JSONC + text)**
- All prompts: **Markdown with YAML frontmatter**
- All toolsets: **JSONC**
- Custom agent: **Markdown**
- Global instructions: **Markdown**
- PRD + TechReq templates: **Markdown**
- Bootstrapper: **PowerShell + TypeScript**
- Test plan generators: **TypeScript (GenAIScript)**
- Memory files: **JSON or TS**

All artifacts must reference each other using **relative paths**.

---

# **8. Repo Structure (Recommended)**

```
/
├─ global.instructions.md
├─ .github/
│  ├─ copilot-instructions.md
│  ├─ agents/
│  └─ templates/
├─ instructions/
├─ prompts/
├─ toolsets/
├─ testplans/
├─ bootstrapper.ps1
├─ bootstrapper.genaiscript.ts
├─ profile.jsonc
├─ CHANGELOG.md
├─ todo.md
└─ templates/
   ├─ prd.template.md
   └─ techreq.template.md
```

---

# **9. Status**

**Everything required to generate the full framework is now defined, polished, and internally consistent.**
