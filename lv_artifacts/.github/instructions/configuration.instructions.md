```instructions
---
name: configuration.instructions
applyTo: "**"
description: "Instructions for the Configuration DevCycle."
---

# Configuration DevCycle Instructions

## 1. Purpose
- Establish the project's configuration baseline once scaffolding is approved.
- Set up formatting, linting, typing, testing frameworks, environment variables, and workspace metadata.
- Align project settings with PRD + Tech Requirements so later DevCycles operate deterministically.

## 2. Responsibilities
### 2.1 Configure Tooling
- Implement ESLint, Prettier, TypeScript, Tailwind, Vitest, Playwright, and other stack tools per TechReq §3 DevCycle 3.
- Ensure configuration values reflect PRD branding (e.g., Tailwind tokens, UI themes).

### 2.2 Generate Configuration Files
- Create/update `tsconfig.json`, `package.json` scripts, `.eslintrc`, `.prettierrc`, Tailwind config, Vitest/Playwright configs, and supporting metadata.
- Keep configs modular and documented, adding brief comments when intent is non-obvious.

### 2.3 Define Environment Variables
- Produce `.env.example` with Clerk, Neon, Vercel, and internal service keys sourced from PRD/Tech Requirements.
- Document secrets ownership, rotation expectations, and which DevCycles will populate values.

### 2.4 Align Workspace Settings
- Update `.vscode/settings.json`, tasks, and recommended extensions only when necessary, ensuring they continue to reference development assets (PRD §6.5).

### 2.5 Validate Toolchain
- Execute lint, typecheck, and test dry runs to confirm configs load without errors.
- Capture outputs or logs for the Validation DevCycle.

## 3. Inputs
- Approved scaffold + readiness report
- PRD + Tech Requirements
- Template snippets under `templates/`
- Toolset definition for Configuration

## 4. Outputs
- Generated/updated configuration files
- `.env.example` plus documentation for secret ownership
- Validation logs (lint/type/test) or recorded blockers
- Tasks + changelog entry summarizing configuration actions

## 5. Success Criteria
- All required configuration files exist, are syntactically valid, and align with PRD constraints.
- Tooling commands (`lint`, `typecheck`, `test`) run successfully or documented why not.
- Human reviewer approves the configuration baseline.

## 6. Error Handling
- Stop if conflicting configs or dependency mismatches are detected; propose reconciliation plan.
- Guard against writing secrets into tracked files.
- Revert partial config updates if validation fails catastrophically.

## 7. Toolset Hook
Use only the capabilities in `../toolsets/configuration.toolset.jsonc`.

## 8. Traceability
- WHEN the scaffold is ready for tooling, THE SYSTEM SHALL execute this Configuration DevCycle to establish the shared config baseline (PRD §7.4, TechReq §3 DevCycle 3).
- WHEN configuration gaps emerge, THE SYSTEM SHALL log remediation tasks and link them to PRD/TechReq references (PRD §8, TechReq §7).
```
