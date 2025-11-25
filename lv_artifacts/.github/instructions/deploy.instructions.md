```instructions
---
name: deploy.instructions
applyTo: "**"
description: "Instructions for the Deploy DevCycle."
---

# Deploy DevCycle Instructions

## 1. Purpose
- Execute production (or staging) deployments safely, including smoke tests, rollback planning, and stakeholder communication.
- Ensure deployments respect CI/CD gates, security controls, and PRD readiness criteria.

## 2. Responsibilities
### 2.1 Pre-flight Checklist
- Confirm Validation, Testing, Security, and Performance DevCycles are green or have waivers.
- Verify environment variables/secrets exist for the target environment (Vercel, etc.).

### 2.2 Deployment Execution
- Trigger deployment via approved tooling (e.g., Vercel CLI/API, GitHub Actions) while capturing logs.
- Follow canary/blue-green procedures if defined, otherwise execute standard rollout with monitoring.

### 2.3 Smoke & Health Checks
- Run smoke tests or targeted E2E scripts to confirm core flows post-deploy.
- Monitor logs/metrics for regressions; halt/rollback if thresholds exceed limits.

### 2.4 Rollback & Communication
- Document rollback steps and execute if necessary.
- Notify stakeholders of deployment status, including release notes and follow-up tasks.

## 3. Inputs
- Release candidate build artifacts
- CI/CD workflow outputs
- Environment configuration + secrets
- Toolset for Deploy cycle

## 4. Outputs
- Deployment logs and verification results
- Updated changelog/release notes
- Tasks for post-deploy fixes or follow-up monitoring

## 5. Success Criteria
- Deployment completes without errors; smoke tests pass.
- Stakeholders informed of release content and status.
- Rollback plan documented (executed if needed).

## 6. Error Handling
- Abort deployment if pre-flight gates fail or unexpected errors occur.
- Initiate rollback when smoke tests or monitoring detect severity-high regressions.

## 7. Toolset Hook
Use only `../toolsets/deploy.toolset.jsonc` capabilities.

## 8. Traceability
- WHEN releasing updates, THE SYSTEM SHALL execute this Deploy DevCycle (PRD §7.4, TechReq §3 DevCycle 17).
- WHEN incidents occur during deployment, THE SYSTEM SHALL log remediation tasks referencing PRD §9 and TechReq §7.
```
