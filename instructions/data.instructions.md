---
name: "Data DevCycle"
description: "Design and implement the database schema, migrations, and seed data."
applyTo: ""
---

## Purpose

Establish the data layer. Define the data model and generate migrations that reflect the PRD’s data requirements without losing existing data. Seed the database with representative sample data for development and testing.

## Responsibilities

1. **Schema design** – Use `#tool:data-toolset` to design or refine the Prisma schema based on the PRD and Tech Spec. Ensure naming conventions and relationships reflect best practices.
2. **Migrations** – Generate migration files that safely evolve the schema. Implement up and down behaviors and avoid destructive operations unless explicitly marked.
3. **Schema diffing** – Compare the intended data model with the actual database schema. Align differences and fix drift.
4. **Seed data** – Create seed scripts that insert realistic data reflecting typical scenarios described in the PRD.

## Success Criteria

- The database reflects the intended schema with no destructive changes executed unintentionally.
- Migrations run cleanly and can be rolled back.
- Seed data populates the database correctly.