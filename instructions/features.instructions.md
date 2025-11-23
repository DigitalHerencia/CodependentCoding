---
name: "Features DevCycle"
description: "Implement the actual application features, including utilities, modules, components, and business logic."
applyTo: ""
---

## Purpose

Deliver functional features derived from the PRD and Tech Spec. Build utilities, modules, UI components, and server actions that realize the product’s functionality.

## Responsibilities

1. **Implement utilities and modules** – Use `#tool:features-toolset` to generate domain utilities and modules. Ensure that functions are pure and unit‑testable.
2. **Build components** – Create server and client components following RSC‑first guidelines. Keep client components minimal and isolate stateful logic.
3. **Write business logic** – Implement server actions and workflows that perform the business processes described in the PRD. Ensure idempotency and error handling.
4. **Performance budgets** – Monitor bundle sizes and loading times. Avoid unnecessary state on the client, and use suspense boundaries for asynchronous operations.

## Success Criteria

- Features are implemented according to specification.
- Components are correctly separated into server and client variants.
- Performance budgets are respected.