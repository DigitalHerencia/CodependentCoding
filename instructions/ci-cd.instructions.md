---
name: "CI/CD DevCycle"
description: "Create and maintain continuous integration and continuous delivery pipelines."
applyTo: ""
---

## Purpose

Automate the process of building, testing, and deploying the application. Ensure that every change can be validated and delivered reliably.

## Responsibilities

1. **GitHub Actions setup** – Use `#tool:ci-cd-toolset` to create GitHub Actions workflows that run linting, testing, building, and deployment tasks on pull requests and merges.
2. **Vercel deployment** – Configure automated preview deployments for branches and production deployments on merges to the main branch. Ensure that environment variables and secrets are securely injected.
3. **Pipeline validation** – Validate that pipelines respect security constraints, testing requirements, and branching strategies defined in the PRD and Tech Spec.

## Success Criteria

- Pipelines run automatically on pushes and PRs.
- All steps complete without manual intervention.
- Deployments occur seamlessly and roll back on failure.