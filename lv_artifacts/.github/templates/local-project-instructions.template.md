---
name: 'User-Project-Instructions-Generator'
description: "Template for generating custom Copilot instructions based on end-user's project specifications"
applyTo: '**'
---

# User Project Custom Instructions (Auto-Generated)

**Status:** This file is **automatically generated** during the Initialization DevCycle after the user provides and validates their project specifications.

## Generation Workflow

1. **User Input Collection** (Initialization DevCycle)

   - User provides project specs via interactive prompts or spec files
   - Required: project name, description, tech stack, architecture overview
   - Optional: features, UI/UX preferences, branding, data models, services

2. **Validation** (orchestrator validates against schema)

   - Ensures required fields present
   - Validates tech stack compatibility with Loaded Vibes
   - Checks for conflicts or missing dependencies

3. **Instruction Generation** (orchestrator invokes generation script)
   - Copilot agent reads validated specs from `docs/project-prd.md`
   - Generates custom instructions file: `.github/local-project.instructions.md`
   - Includes technology-specific patterns, coding standards, architecture rules
   - References user's branding, design system, feature requirements

## Generated Instruction Structure

The auto-generated `.github/local-project.instructions.md` file includes:

### Project Identity

- Project name, description, target users
- Branding guidelines (colors, typography, tone)
- UI/UX principles and design patterns

### Technology Stack

- Primary language(s) and frameworks (e.g., Next.js 15, React 19)
- Database (Prisma schema, migrations approach)
- Authentication (Clerk configuration, RBAC/ABAC rules)
- Styling (Tailwind config, component patterns)
- Deployment (Vercel settings, environment variables)

### Architecture Patterns

- File structure and naming conventions
- Component hierarchy and composition patterns
- State management approach
- API route conventions and data fetching strategies
- Error handling and logging standards

### Feature-Specific Rules

- Per-feature acceptance criteria from project PRD
- Implementation constraints or preferences
- Integration points between features
- Performance budgets and optimization requirements

### Data Modeling

- Entity relationships and Prisma schema patterns
- Data validation rules
- Privacy/security controls (PII handling, encryption)
- Seeding and migration strategies

### Quality Gates

- Testing requirements (unit, integration, E2E coverage targets)
- Code review checklist items
- Performance benchmarks (Core Web Vitals, bundle size limits)
- Accessibility standards (WCAG level, keyboard navigation)

## Usage by Framework

Once generated, this file is referenced by:

- **Global instructions** (`.github/global.instructions.md`) - delegates project-specific logic
- **DevCycle instructions** (`.github/instructions/*.instructions.md`) - applies domain rules on top of project rules
- **Custom agents** (`.github/agents/*.agent.md`) - tech stack agents inherit project context
- **Toolsets** (`.github/toolsets/*.toolset.jsonc`) - tools configured per project needs

## Regeneration Triggers

The local project instructions are regenerated when:

- User runs `loaded-vibes reconfigure` command
- Project PRD is significantly updated (detected by orchestrator)
- User explicitly requests regeneration via CLI flag

## Example Output Location

After generation:

```
<project-root>/.github/local-project.instructions.md
```

Copilot loads this file automatically via the `applyTo: "**"` glob pattern in frontmatter, ensuring all framework operations respect user's project specifications.

---

**Note to Framework Maintainers:** This template is shipped in `dist/.github/templates/local-project-instructions.template.md` and used by the initialization phase script. Do not modify the template location or structure without updating `genaiscript/phases/initialization.genai.js`.
