# Roadmap

The build plan for this app, generated from [`context/specs/catalog.json`](context/specs/catalog.json). Each milestone is a GitHub milestone; each spec is an issue on the Project board.

| Cadence    | Meaning                                 |
| ---------- | --------------------------------------- |
| once       | done one time                           |
| repeatable | runs again as needed; sub-issue per run |
| expandable | one sub-issue per item                  |
| gate       | sign-off; needs owner approval          |

## M1 — Foundation & Pre-Production

### P1.1 — Product Discovery & Business Definition

**INIT — Environment Initialization**

| Spec                   | Title                               | Cadence |
| ---------------------- | ----------------------------------- | ------- |
| `ENG-M1-P1.1-INIT-T01` | Audit workspace & repo state        | once    |
| `ENG-M1-P1.1-INIT-T02` | Validate all 5 docs                 | once    |
| `ENG-M1-P1.1-INIT-T03` | Validate MCP & tooling availability | once    |
| `ENG-M1-P1.1-INIT-T04` | Environment readiness report        | once    |
| `ENG-M1-P1.1-INIT-T05` | Initialization sign-off             | gate    |

### P1.2 — Platform & Operations Scaffolding

**SCAFF — Architecture Setup**

| Spec                    | Title                          | Cadence |
| ----------------------- | ------------------------------ | ------- |
| `ENG-M1-P1.2-SCAFF-T01` | Generator output audit         | once    |
| `ENG-M1-P1.2-SCAFF-T02` | Next.js configuration          | once    |
| `ENG-M1-P1.2-SCAFF-T03` | Database provisioning & Prisma | once    |
| `ENG-M1-P1.2-SCAFF-T04` | Clerk application setup        | once    |
| `ENG-M1-P1.2-SCAFF-T05` | Third-party accounts & keys    | once    |

**CONFIG — Project Configuration**

| Spec                     | Title                    | Cadence |
| ------------------------ | ------------------------ | ------- |
| `ENG-M1-P1.2-CONFIG-T01` | ESLint / Prettier config | once    |
| `ENG-M1-P1.2-CONFIG-T02` | TypeScript strict config | once    |
| `ENG-M1-P1.2-CONFIG-T03` | Env variable templates   | once    |
| `ENG-M1-P1.2-CONFIG-T04` | Brand & design tokens    | once    |
| `ENG-M1-P1.2-CONFIG-T05` | Configuration validation | gate    |

### P1.3 — Internal Alpha Validation

**DATA — Data Layer Definition**

| Spec                   | Title                         | Cadence |
| ---------------------- | ----------------------------- | ------- |
| `ENG-M1-P1.3-DATA-T01` | Entity & relationship mapping | once    |
| `ENG-M1-P1.3-DATA-T02` | Migration plan                | once    |
| `ENG-M1-P1.3-DATA-T03` | Seed data definition          | once    |
| `ENG-M1-P1.3-DATA-T04` | Data constraint validation    | once    |
| `ENG-M1-P1.3-DATA-T05` | Data spec sign-off            | gate    |

**AUTH — Auth & RBAC**

| Spec                   | Title                    | Cadence |
| ---------------------- | ------------------------ | ------- |
| `ENG-M1-P1.3-AUTH-T01` | Tenant model definition  | once    |
| `ENG-M1-P1.3-AUTH-T02` | Role & permission matrix | once    |
| `ENG-M1-P1.3-AUTH-T03` | Clerk webhook sync logic | once    |
| `ENG-M1-P1.3-AUTH-T04` | Server-side enforcement  | once    |
| `ENG-M1-P1.3-AUTH-T05` | Auth validation          | gate    |

**ALPHA — Alpha Build**

| Spec                    | Title                   | Cadence |
| ----------------------- | ----------------------- | ------- |
| `ENG-M1-P1.3-ALPHA-T01` | Feature integration     | once    |
| `ENG-M1-P1.3-ALPHA-T02` | Preview deployment      | once    |
| `ENG-M1-P1.3-ALPHA-T03` | Seeded demo walkthrough | once    |
| `ENG-M1-P1.3-ALPHA-T04` | Internal testing        | once    |
| `ENG-M1-P1.3-ALPHA-T05` | Alpha sign-off          | gate    |

## M2 — MVP Launch

### P2.1 — Core Feature Implementation

**MVP — Core Platform**

| Spec                  | Title                           | Cadence |
| --------------------- | ------------------------------- | ------- |
| `ENG-M2-P2.1-MVP-T01` | Billing plans & checkout        | once    |
| `ENG-M2-P2.1-MVP-T02` | Billing webhooks & entitlements | once    |
| `ENG-M2-P2.1-MVP-T03` | Email & notifications           | once    |
| `ENG-M2-P2.1-MVP-T04` | File uploads & storage          | once    |
| `ENG-M2-P2.1-MVP-T05` | Admin & user management         | once    |

**FEATURES — Feature Development**

| Spec                       | Title                            | Cadence    |
| -------------------------- | -------------------------------- | ---------- |
| `ENG-M2-P2.1-FEATURES-T01` | Core domain features             | expandable |
| `ENG-M2-P2.1-FEATURES-T02` | UI to data wiring                | expandable |
| `ENG-M2-P2.1-FEATURES-T03` | Feature flag gating              | once       |
| `ENG-M2-P2.1-FEATURES-T04` | Background jobs & scheduled work | once       |
| `ENG-M2-P2.1-FEATURES-T05` | Feature readiness                | gate       |

**TEST — Testing Strategy**

| Spec                   | Title                 | Cadence |
| ---------------------- | --------------------- | ------- |
| `ENG-M2-P2.1-TEST-T01` | Unit test plan        | once    |
| `ENG-M2-P2.1-TEST-T02` | Integration test plan | once    |
| `ENG-M2-P2.1-TEST-T03` | E2E flows             | once    |
| `ENG-M2-P2.1-TEST-T04` | Test automation setup | once    |
| `ENG-M2-P2.1-TEST-T05` | Coverage verification | gate    |

### P2.2 — QA & Launch Readiness

**DEBUG — Debug & Fixes**

| Spec                    | Title               | Cadence    |
| ----------------------- | ------------------- | ---------- |
| `ENG-M2-P2.2-DEBUG-T01` | Defect triage       | repeatable |
| `ENG-M2-P2.2-DEBUG-T02` | Root cause analysis | repeatable |
| `ENG-M2-P2.2-DEBUG-T03` | Patch application   | repeatable |
| `ENG-M2-P2.2-DEBUG-T04` | Regression testing  | repeatable |
| `ENG-M2-P2.2-DEBUG-T05` | Debug sign-off      | gate       |

**VALIDATE — System Validation**

| Spec                       | Title                              | Cadence |
| -------------------------- | ---------------------------------- | ------- |
| `ENG-M2-P2.2-VALIDATE-T01` | Business logic validation          | once    |
| `ENG-M2-P2.2-VALIDATE-T02` | UX flow & accessibility validation | once    |
| `ENG-M2-P2.2-VALIDATE-T03` | Data contract validation           | once    |
| `ENG-M2-P2.2-VALIDATE-T04` | Auth boundary validation           | once    |
| `ENG-M2-P2.2-VALIDATE-T05` | Validation approval                | gate    |

### P2.3 — Soft Launch & Feedback Loop

**CICD — CI/CD Pipeline**

| Spec                   | Title              | Cadence |
| ---------------------- | ------------------ | ------- |
| `ENG-M2-P2.3-CICD-T01` | CI workflows       | once    |
| `ENG-M2-P2.3-CICD-T02` | CD workflows       | once    |
| `ENG-M2-P2.3-CICD-T03` | Secrets management | once    |
| `ENG-M2-P2.3-CICD-T04` | Rollback strategy  | once    |
| `ENG-M2-P2.3-CICD-T05` | CI/CD validation   | gate    |

## M3 — Expansion & Hardening

### P3.1 — Feature Expansion

**SEC — Security Hardening**

| Spec                  | Title                 | Cadence |
| --------------------- | --------------------- | ------- |
| `ENG-M3-P3.1-SEC-T01` | Auth boundary audit   | once    |
| `ENG-M3-P3.1-SEC-T02` | PII handling audit    | once    |
| `ENG-M3-P3.1-SEC-T03` | Header & policy setup | once    |
| `ENG-M3-P3.1-SEC-T04` | Toolset access review | once    |
| `ENG-M3-P3.1-SEC-T05` | Security approval     | gate    |

**PERF — Performance Optimization**

| Spec                   | Title                 | Cadence    |
| ---------------------- | --------------------- | ---------- |
| `ENG-M3-P3.1-PERF-T01` | Bottleneck analysis   | repeatable |
| `ENG-M3-P3.1-PERF-T02` | Query optimization    | repeatable |
| `ENG-M3-P3.1-PERF-T03` | Dependency audit      | once       |
| `ENG-M3-P3.1-PERF-T04` | Resource optimization | once       |
| `ENG-M3-P3.1-PERF-T05` | Performance sign-off  | gate       |

### P3.2 — Platform Hardening & Security

**HARD — Resilience**

| Spec                   | Title                            | Cadence |
| ---------------------- | -------------------------------- | ------- |
| `ENG-M3-P3.2-HARD-T01` | Backup & restore                 | once    |
| `ENG-M3-P3.2-HARD-T02` | Data export & deletion           | once    |
| `ENG-M3-P3.2-HARD-T03` | Rate limiting & abuse protection | once    |
| `ENG-M3-P3.2-HARD-T04` | Error handling & degradation     | once    |
| `ENG-M3-P3.2-HARD-T05` | Resilience sign-off              | gate    |

**OBS — Observability**

| Spec                  | Title                    | Cadence |
| --------------------- | ------------------------ | ------- |
| `ENG-M3-P3.2-OBS-T01` | Logging specification    | once    |
| `ENG-M3-P3.2-OBS-T02` | Metrics definition       | once    |
| `ENG-M3-P3.2-OBS-T03` | Tracing plan             | once    |
| `ENG-M3-P3.2-OBS-T04` | Alert thresholds         | once    |
| `ENG-M3-P3.2-OBS-T05` | Observability validation | gate    |

**REVIEW — Code Review**

| Spec                     | Title                       | Cadence    |
| ------------------------ | --------------------------- | ---------- |
| `ENG-M3-P3.2-REVIEW-T01` | PR review standards         | repeatable |
| `ENG-M3-P3.2-REVIEW-T02` | Static analysis             | repeatable |
| `ENG-M3-P3.2-REVIEW-T03` | Feature completeness review | repeatable |
| `ENG-M3-P3.2-REVIEW-T04` | Refactor recommendations    | repeatable |
| `ENG-M3-P3.2-REVIEW-T05` | Merge approval              | gate       |

### P3.3 — Growth Enablement

**DEPLOY — Deployment**

| Spec                     | Title                       | Cadence |
| ------------------------ | --------------------------- | ------- |
| `ENG-M3-P3.3-DEPLOY-T01` | Build artifact validation   | once    |
| `ENG-M3-P3.3-DEPLOY-T02` | Production deploy           | once    |
| `ENG-M3-P3.3-DEPLOY-T03` | Smoke tests                 | once    |
| `ENG-M3-P3.3-DEPLOY-T04` | Production config & domains | once    |
| `ENG-M3-P3.3-DEPLOY-T05` | Deploy sign-off             | gate    |

**DOCS — Documentation**

| Spec                   | Title                      | Cadence |
| ---------------------- | -------------------------- | ------- |
| `ENG-M3-P3.3-DOCS-T01` | README & repo docs         | once    |
| `ENG-M3-P3.3-DOCS-T02` | Contributor docs           | once    |
| `ENG-M3-P3.3-DOCS-T03` | Runbooks & operations docs | once    |
| `ENG-M3-P3.3-DOCS-T04` | Architecture documentation | once    |
| `ENG-M3-P3.3-DOCS-T05` | Documentation approval     | gate    |

**UPDATES — Maintenance & Updates**

| Spec                      | Title                     | Cadence    |
| ------------------------- | ------------------------- | ---------- |
| `ENG-M3-P3.3-UPDATES-T01` | Patch backlog review      | repeatable |
| `ENG-M3-P3.3-UPDATES-T02` | Dependency updates        | repeatable |
| `ENG-M3-P3.3-UPDATES-T03` | SEO, metadata & analytics | once       |
| `ENG-M3-P3.3-UPDATES-T04` | Spec reconciliation       | repeatable |
| `ENG-M3-P3.3-UPDATES-T05` | Update release notes      | gate       |
