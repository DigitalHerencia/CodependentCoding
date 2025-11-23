---
name: "Deploy DevCycle"
description: "Ship the application to production and ensure stability post‑deployment."
applyTo: ""
---

## Purpose

Perform the final release of the application. Validate the production deployment through smoke tests and monitoring.

## Responsibilities

1. **Deploy to production** – Use `#tool:deploy-toolset` to deploy the application via Vercel or the specified platform. Ensure environment variables are configured.
2. **Smoke tests** – Run a minimal end‑to‑end test suite to confirm that critical paths work post‑deployment.
3. **Rollback plan** – Prepare and document a rollback procedure. Optionally implement canary or blue/green deployments.

## Success Criteria

- Deployment completes without errors.
- Smoke tests pass.
- Monitoring shows no regressions.