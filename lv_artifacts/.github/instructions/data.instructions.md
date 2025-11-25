```instructions
---
name: data.instructions
applyTo: "**"
description: "Instructions for the Data DevCycle."
---

# Data DevCycle Instructions

## 1. Purpose
- Design and evolve the Prisma schema and database state backing the Loaded Vibes stack.
- Generate migrations, seeds, and safety checks that align with Neon Postgres constraints.
- Detect schema drift early and coordinate with other DevCycles (Auth, Features, Performance).

## 2. Responsibilities
### 2.1 Model Design
- Translate PRD domain models into Prisma schema definitions with explicit relations, indexes, and constraints.
- Annotate multi-tenant requirements (tenantId, role scopes) per TechReq §3 DevCycle 5.

### 2.2 Migration Planning
- Author Prisma migrations that are idempotent, backward-compatible when feasible, and documented with rationale.
- Coordinate with Neon resource limits; avoid long-running transactions and ensure connection pooling.

### 2.3 Data Safety & Seeding
- Create or update seeding scripts that respect ABAC/RBAC requirements and avoid leaking secrets.
- Validate seeding on a disposable database instance before recommending production rollout.

### 2.4 Drift Detection
- Compare schema to previously generated artifacts; surface drift or manual database edits.
- Log remediation tasks if divergence is detected.

### 2.5 Documentation & Hand-off
- Record schema updates, migrations, and operational considerations (backups, rollbacks) for Deploy DevCycle.

## 3. Inputs
- PRD/Tech Requirements data sections
- Existing Prisma schema + migrations
- Database connection details from Initialization/Configuration
- Toolset access to Prisma CLI + Postgres MCP

## 4. Outputs
- Updated `prisma/schema.prisma`
- Generated migrations + seed scripts
- Validation evidence (prisma format/validate/migrate)
- Tasks documenting follow-up work plus changelog entry

## 5. Success Criteria
- Schema reflects current PRD requirements and passes `prisma validate`.
- Migrations apply cleanly to a test database; seeds run without errors.
- Human reviewer signs off on data changes and associated risks.

## 6. Error Handling
- Stop if database connectivity fails or migrations would cause destructive changes without approval.
- Provide rollback guidance or snapshot instructions when required.

## 7. Toolset Hook
Use tools defined in `../toolsets/data.toolset.jsonc` (Prisma CLI, Postgres MCP, filesystem, git, sequential thinking) only.

## 8. Traceability
- WHEN domain models evolve, THE SYSTEM SHALL execute this Data DevCycle to align database artifacts with PRD §7 and TechReq §3 DevCycle 5.
- WHEN data changes introduce risk, THE SYSTEM SHALL log mitigation tasks referencing PRD security/performance clauses (PRD §9, TechReq §6/§7).
```
