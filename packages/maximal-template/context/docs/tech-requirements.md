# Technical Requirements

> **Status:** Draft · **Owner:** TODO: · **Last updated:** TODO:

The stack, environments, integrations and non-functional requirements the build must meet.

Fill every `TODO:`. Write `None` or `N/A — reason` when a section does not apply; never delete a section. Each section lists the specs it feeds, so the build process can be traced back to this document.

## Stack and versions

_Pinned runtime and framework versions. Defaults come from the template `package.json`; change only with a decision._

| Layer           | Choice                     | Version              |
| --------------- | -------------------------- | -------------------- |
| Runtime         | Node.js                    | 24.x                 |
| Framework       | Next.js (App Router)       | see `package.json`   |
| Database        | PostgreSQL (Neon) + Prisma | see `package.json`   |
| Identity        | Clerk                      | see `package.json`   |
| Hosting         | Vercel                     | —                    |
| Package manager | pnpm                       | see `packageManager` |

**Feeds:** `ENG-M1-P1.1-INIT-T01`, `ENG-M1-P1.1-INIT-T02`, `ENG-M1-P1.2-SCAFF-T02`

## Environments and configuration

_Each environment, its URL, its data, and where its secrets live. `.env.example` is the variable list._

| Environment | URL       | Database branch | Secrets stored in |
| ----------- | --------- | --------------- | ----------------- |
| development | localhost | TODO:           | `.env.local`      |
| preview     | TODO:     | TODO:           | hosting provider  |
| production  | TODO:     | TODO:           | hosting provider  |

**Feeds:** `ENG-M1-P1.1-INIT-T04`, `ENG-M1-P1.2-CONFIG-T03`, `ENG-M3-P3.3-DEPLOY-T04`

## Tooling and code quality

_Required tools and the checks every change passes._

- **Checks:** `pnpm format:check`, `pnpm lint`, `pnpm typecheck`, `pnpm build`
- **Lint rules:** ESLint with the Loaded Vibes doctrine plugin; findings print a `CC-*` ID
- **Required CLIs:** GitHub CLI, Vercel CLI, TODO:
- **Required MCP servers:** TODO:

**Feeds:** `ENG-M1-P1.1-INIT-T03`, `ENG-M1-P1.2-CONFIG-T01`, `ENG-M1-P1.2-CONFIG-T02`, `ENG-M1-P1.2-CONFIG-T05`, `ENG-M3-P3.2-REVIEW-T02`, `ENG-M3-P3.3-DOCS-T02`

## Data and persistence

_Database provider, connection mode, migration policy and data retention._

- **Provider and region:** TODO:
- **Pooled vs direct connections:** runtime uses pooled, migrations use direct
- **Migration policy:** TODO:
- **Retention:** TODO:

**Feeds:** `ENG-M1-P1.2-SCAFF-T03`, `ENG-M1-P1.3-DATA-T02`

## Integrations

_Every third-party service the app uses, why, and how failures are handled. Remove rows for unselected modules._

| Service      | Purpose       | Module    | Webhooks | Failure behavior |
| ------------ | ------------- | --------- | -------- | ---------------- |
| Stripe       | Billing       | billing   | yes      | TODO:            |
| SendGrid     | Email         | email     | yes      | TODO:            |
| Vercel Blob  | Uploads       | uploads   | no       | TODO:            |
| Cloudinary   | Media         | media     | no       | TODO:            |
| Hugging Face | Inference     | inference | no       | TODO:            |
| Upstash      | Rate limiting | ratelimit | no       | TODO:            |

**Feeds:** `ENG-M1-P1.2-SCAFF-T05`, `ENG-M2-P2.1-MVP-T01`, `ENG-M2-P2.1-MVP-T02`, `ENG-M2-P2.1-MVP-T03`, `ENG-M2-P2.1-MVP-T04`

## Background jobs and scheduling

_Work that runs outside a request: schedules, queues, retries. Write `None` if not needed._

| Job   | Trigger / schedule | Idempotent | Retry policy |
| ----- | ------------------ | ---------- | ------------ |
| TODO: |                    |            |              |

**Feeds:** `ENG-M2-P2.1-FEATURES-T04`

## Performance

_Budgets the app must meet, measured on production-like data._

| Metric                  | Budget   |
| ----------------------- | -------- |
| LCP (p75)               | ≤ 2.5 s  |
| INP (p75)               | ≤ 200 ms |
| CLS (p75)               | ≤ 0.1    |
| Server action p95       | TODO:    |
| First-load JS per route | TODO:    |

**Feeds:** `ENG-M3-P3.1-PERF-T01`, `ENG-M3-P3.1-PERF-T02`, `ENG-M3-P3.1-PERF-T04`, `ENG-M3-P3.1-PERF-T05`

## Security and privacy

_Security requirements beyond auth: headers, input validation, dependency policy, compliance needs._

- **Security headers:** CSP, HSTS, X-Frame-Options/frame-ancestors, Referrer-Policy, Permissions-Policy
- **Input validation:** every server input validated with a schema
- **Compliance needs:** TODO:
- **Data residency:** TODO:

**Feeds:** `ENG-M3-P3.1-SEC-T03`, `ENG-M3-P3.2-HARD-T03`

## Reliability

_Backups, recovery targets, rate limits and degraded behavior._

- **RPO / RTO:** TODO:
- **Backups:** TODO:
- **Rate limits:** TODO:
- **Degraded behavior per dependency:** TODO:

**Feeds:** `ENG-M2-P2.3-CICD-T04`, `ENG-M3-P3.2-HARD-T01`, `ENG-M3-P3.2-HARD-T03`, `ENG-M3-P3.2-HARD-T04`, `ENG-M3-P3.2-HARD-T05`, `ENG-M3-P3.3-DOCS-T03`

## Observability

_Logs, metrics, traces and alerts, and the tools that hold them._

- **Logging:** structured, with request and tenant IDs, no PII
- **Error tracking:** TODO:
- **Metrics and traces:** TODO:
- **Alerts and recipients:** TODO:

**Feeds:** `ENG-M3-P3.2-OBS-T01`, `ENG-M3-P3.2-OBS-T02`, `ENG-M3-P3.2-OBS-T03`, `ENG-M3-P3.2-OBS-T04`, `ENG-M3-P3.2-OBS-T05`

## Testing strategy

_Which tests exist, where they run, and what blocks a release._

| Suite             | Command         | Runs where                          |
| ----------------- | --------------- | ----------------------------------- |
| Unit              | `pnpm test`     | local, before release               |
| RLS / integration | `pnpm test:rls` | local against a disposable database |
| E2E               | `pnpm test:e2e` | local, before release               |

**Feeds:** `ENG-M1-P1.3-ALPHA-T04`, `ENG-M2-P2.1-TEST-T01`, `ENG-M2-P2.1-TEST-T02`, `ENG-M2-P2.1-TEST-T03`, `ENG-M2-P2.1-TEST-T04`, `ENG-M2-P2.1-TEST-T05`, `ENG-M2-P2.2-DEBUG-T01`, `ENG-M2-P2.2-DEBUG-T02`, `ENG-M2-P2.2-DEBUG-T03`, `ENG-M2-P2.2-DEBUG-T04`, `ENG-M2-P2.2-DEBUG-T05`, `ENG-M3-P3.3-DEPLOY-T03`

## CI/CD and deployment

_The lean PR baseline and how deploys happen._

- **CI (pull requests):** format check, lint, type check, build
- **Deploys:** hosting Git integration; preview per PR, production on `main`
- **Migrations:** TODO:
- **Rollback:** TODO:

**Feeds:** `ENG-M1-P1.3-ALPHA-T02`, `ENG-M2-P2.1-TEST-T04`, `ENG-M2-P2.3-CICD-T01`, `ENG-M2-P2.3-CICD-T02`, `ENG-M2-P2.3-CICD-T04`, `ENG-M3-P3.3-DEPLOY-T01`, `ENG-M3-P3.3-DEPLOY-T02`, `ENG-M3-P3.3-DOCS-T03`

## Maintenance and dependencies

_How dependencies are updated and how long versions are supported._

- **Update cadence:** Dependabot weekly; security updates immediately
- **Major upgrades:** planned as their own spec
- **Supported browsers:** TODO:

**Feeds:** `ENG-M3-P3.1-PERF-T03`, `ENG-M3-P3.3-UPDATES-T02`
