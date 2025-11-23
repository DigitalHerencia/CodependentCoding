---
name: "Validation DevCycle"
description: "Confirm that the implementation meets the intent of the PRD and Tech Spec."
applyTo: ""
---

## Purpose

Ensure that all implemented features and behavior align with the business rules, user journeys, and data contracts defined in the PRD and Tech Spec. This is a functional check beyond static verification.

## Responsibilities

1. **Business rule validation** – Use `#tool:validation-toolset` to check that models, data transformations, and workflows match the specified business rules.
2. **UX flow validation** – Compare user journeys implemented in the application with those described in the PRD. Identify deviations or missing steps.
3. **Auth and data contract validation** – Ensure that permissions, roles, and data access reflect the intended rules and contracts. Check upstream and downstream integrations.

## Success Criteria

- Business logic behaves as specified.
- User flows are complete and intuitive.
- Authorization rules prevent unauthorized access without blocking legitimate users.