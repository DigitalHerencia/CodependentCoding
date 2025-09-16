# Codependent Coding (MVP)

 Feature: Monday's Archive Theater
 Branch: `001-product-requirements-document`
 Spec: D:\Monday\specs\001-product-requirements-document\spec.md
 Plan: D:\Monday\specs\001-product-requirements-document\plan.md

 Overview: This task list is TDD-first, dependency-ordered, and executable by an LLM or developer. Tasks marked [P] can be executed in parallel. Each task includes the file(s) to create/update and a clear acceptance test (usually a failing test first).

 T001 — Setup: Repo scaffold & dependencies

- Description: Initialize package files and install dependencies.
- Actions:
    1. Create `package.json` with scripts: `dev`, `build`, `start`, `lint`, `test`.
    2. Run `npm install` for: next, react, react-dom, typescript, prisma, @prisma/client, tailwindcss, postcss, autoprefixer, @clerk/nextjs, @clerk/backend, zod, @uploadthing/react, @uploadthing/middleware, @uploadthing/next, vitest/jest as test runner, and eslint.
    3. Run `npx tailwindcss init -p` and update `tailwind.config.js` content paths.
- Files:
  - `package.json`, `tailwind.config.js`, `postcss.config.js`
- Acceptance (TDD): `npx --no-install next --version` must print Next version (smoke test).
- Depends on: none
- Parallelizable: No

 T002 — Setup: Prisma & Neon connection (test-first) [P]

- Description: Add `prisma/schema.prisma` and create a failed migration test until DB is configured.
- Actions:
    1. Create `prisma/schema.prisma` with `User` and `Archive` models (from data-model.md).
    2. Create `lib/prisma.ts` exporting PrismaClient and safe connection helpers for serverless (handle unpooling if necessary).
    3. Add test `tests/prisma/connection.test.ts` that attempts `prisma.user.findMany()` and expects an error when DATABASE_URL not set (red test).
- Files:
  - `prisma/schema.prisma`, `lib/prisma.ts`, `tests/prisma/connection.test.ts`
- Acceptance (TDD): The test should run and FAIL (no DB). After env is provided and `npx prisma db push` is run, test becomes PASS.
- Depends on: T001
- Parallelizable: Yes [P]

 T003 — Contracts: Create API contract tests (contract-first) [P]

- Description: Add OpenAPI contract and failing contract tests for core endpoints.
- Actions:
    1. Create `specs/001-product-requirements-document/contracts/api-openapi.yaml` (already present).
    2. Add contract test harness `tests/contracts/archives.contract.test.ts` that loads the OpenAPI file and asserts the /archives endpoint schema. Test should fail because implementation doesn't exist.
- Files:
  - `tests/contracts/archives.contract.test.ts`
- Acceptance (TDD): Contract test runs and FAILS initially.
- Depends on: T001
- Parallelizable: Yes [P]

 T004 — Webhook handler contract & tests (contract-first)

- Description: Create contract/tests for the Clerk webhook endpoint and HMAC verification.
- Actions:
    1. Create `tests/contracts/webhook.contract.test.ts` asserting POST /webhook/clerk expects 200 or 401 per signature.
    2. Create unit tests `tests/webhook/signature.test.ts` that exercise `verifyClerkWebhook(rawBody, signature)` and expect failure for invalid signature (RED).
- Files:
  - `tests/contracts/webhook.contract.test.ts`, `tests/webhook/signature.test.ts`
- Acceptance (TDD): Tests fail until implementation (RED).
- Depends on: T001
- Parallelizable: Yes [P]

 T005 — Implement Prisma models (make tests pass for models)

- Description: Implement Prisma schema and run `npx prisma db push` when DB available.
- Actions:
    1. Ensure `prisma/schema.prisma` matches `data-model.md`.
    2. Run `npx prisma generate` and `npx prisma db push` (requires `DATABASE_URL_UNPOOLED` for migrations).
- Files:
  - `prisma/schema.prisma` (update), generated client in `node_modules/.prisma`
- Acceptance: `lib/prisma.ts` can successfully create a user and archive in a test DB.
- Depends on: T002
- Parallelizable: No

 T006 — Webhook handler implementation (server route)

- Description: Implement `app/api/clerk/webhook-handler/route.ts` to verify signature and upsert Clerk user to DB.
- Actions:
    1. Create `lib/verifyClerkWebhook.ts` implementing timing-safe HMAC verification using `CLERK_PRODUCTION_WEBHOOK_SECRET`.
    2. Create `app/api/clerk/webhook-handler/route.ts` to parse raw body, validate signature, upsert user into DB via `lib/prisma.ts`.
    3. Add server-side unit tests in `tests/webhook/handler.test.ts` that mock the request and validate response codes.
- Files:
  - `lib/verifyClerkWebhook.ts`, `app/api/clerk/webhook-handler/route.ts`, `tests/webhook/handler.test.ts`
- Acceptance (TDD): `tests/webhook/signature.test.ts` and `tests/webhook/handler.test.ts` should initially FAIL until `verifyClerkWebhook` is implemented, then PASS when correct secret provided.
- Depends on: T002, T003, T004
- Parallelizable: No

 T007 — Server Actions: Archive create (TDD)

- Description: Implement Server Action `lib/actions/archive.ts` with zod validation.
- Actions:
    1. Create `lib/actions/archive.ts` with `use server` and zod schemas for archive creation payload.
    2. Add failing unit test `tests/actions/archive.create.test.ts` that submits invalid payloads and expects validation errors (RED).
- Files:
  - `lib/actions/archive.ts`, `tests/actions/archive.create.test.ts`
- Acceptance (TDD): Tests fail (no implementation) then pass after implementation.
- Depends on: T002, T005
- Parallelizable: No

 T008 — Upload pipeline & parsing (ZIP handling) [P]

- Description: Implement upload UI and server parsing of ChatGPT `.zip` files.
- Actions:
    1. Create `components/upload/UploadDropzone.tsx` (client component) and `features/archive/upload` server action endpoints.
    2. Implement server utility `lib/parseChatGPTZip.ts` to extract JSON files and attachments and return conversation objects.
    3. Add tests `tests/upload/parse.test.ts` with sample export zips (failing initially).
- Files:
  - `components/upload/UploadDropzone.tsx`, `lib/parseChatGPTZip.ts`, `tests/upload/parse.test.ts`
- Acceptance (TDD): Parse tests fail initially, then pass with parser implementation.
- Depends on: T001, T005
- Parallelizable: Yes [P]

 T009 — Archive CRUD endpoints & UI

- Description: Implement archive list/detail pages and server actions for CRUD.
- Actions:
    1. Create server routes and pages under `app/(dashboard)/archives/` for list and detail views.
    2. Implement `features/archive` components and hooks that call server actions.
    3. Add integration tests `tests/integration/archives.flow.test.ts` that exercise upload → parse → create → list → view. These tests must be written first and fail (RED).
- Files:
  - `app/(dashboard)/archives/page.tsx`, `app/(dashboard)/archives/[id]/page.tsx`, `features/archive/*`, `tests/integration/archives.flow.test.ts`
- Acceptance (TDD): Integration test fails until the flow is implemented, then passes.
- Depends on: T006, T007, T008
- Parallelizable: No

 T010 — Search & Filters

- Description: Add search and tag filters for archives (backend + UI).
- Actions:
    1. Implement search API `app/api/search/route.ts` and server-side search helpers using Postgres full-text search or simple ILIKE filtering.
    2. Create UI filter controls in `features/archive/filters/*`.
    3. Add tests `tests/integration/search.test.ts` for search scenarios from quickstart and spec.
- Files:
  - `app/api/search/route.ts`, `features/archive/filters/*`, `tests/integration/search.test.ts`
- Acceptance: Search tests FAIL until implementation; PASS after.
- Depends on: T005, T009
- Parallelizable: Yes [P]

 T011 — Admin dashboard

- Description: Implement admin listing for users and archive counts and export capability.
- Actions:
    1. Create `app/(admin)/users/page.tsx` and API endpoints for admin queries, guarded by admin role.
    2. Add tests `tests/integration/admin.users.test.ts`.
- Files:
  - `app/(admin)/users/page.tsx`, `app/api/admin/*`, `tests/integration/admin.users.test.ts`
- Acceptance: Admin tests pass when endpoints return correct counts.
- Depends on: T005
- Parallelizable: Yes [P]

 T012 — Viewer Theater Mode (rendering) [P]

- Description: Implement the full-screen conversation reader with themes.
- Actions:
    1. Create `components/viewer/ConversationViewer.tsx` and subcomponents for message blocks, sticky headers, timeline, and theme switcher.
    2. Implement markdown rendering with `react-markdown` + custom renderers to display system/user/assistant roles.
    3. Add visual snapshot tests (e.g., @playwright or storybook snapshots) `tests/visual/viewer.snap.test.ts` (RED initially).
- Files:
  - `components/viewer/*`, `tests/visual/viewer.snap.test.ts`
- Acceptance: Snapshot tests pass when rendering matches approved snapshots.
- Depends on: T009, T008
- Parallelizable: Yes [P]

 T013 — Tagging & Auto-tagging

- Description: Implement manual tagging UI and an auto-tagging worker that uses a GPT/Sentiment function.
- Actions:
    1. Create `features/tags/*` UI and server actions to apply tags.
    2. Create `lib/autotag.ts` which given archive content returns suggested tags (wraps GPT or simple sentiment lib).
    3. Add tests `tests/unit/autotag.test.ts`.
- Files:
  - `features/tags/*`, `lib/autotag.ts`, `tests/unit/autotag.test.ts`
- Acceptance: Unit tests pass when autotag returns expected tags for sample content.
- Depends on: T009, T012
- Parallelizable: Yes [P]

 T014 — Timeline Viewer (experimental)

- Description: Implement an analytics visualization for token counts over time.
- Actions:
    1. Create `components/analytics/TimelineChart.tsx` using a lightweight chart lib.
    2. Add endpoint `app/api/analytics/route.ts` returning token/time buckets.
    3. Add tests `tests/integration/analytics.test.ts`.
- Files:
  - `components/analytics/*`, `app/api/analytics/route.ts`, `tests/integration/analytics.test.ts`
- Acceptance: Chart renders for sample data; tests validate API shape.
- Depends on: T005
- Parallelizable: Yes [P]

 T015 — QA & Dev Tools

- Description: Developer panel, replay button, raw JSON viewer.
- Actions:
    1. Create `components/dev/DevPanel.tsx` with toggles for replay and raw JSON viewing.
    2. Implement server action to replay conversation to GPT for commentary (rate-limited behind a feature flag).
    3. Add tests `tests/dev/replay.test.ts`.
- Files:
  - `components/dev/*`, `lib/replay.ts`, `tests/dev/replay.test.ts`
- Acceptance: Dev tools render and replay action triggers expected behaviour in tests (mocked)
- Depends on: T009, T012
- Parallelizable: Yes [P]

 T016 — Security & Rate Limiting

- Description: Add middleware for per-user rate limiting on uploads and webhooks and encrypt S3 uploads.
- Actions:
    1. Implement middleware `lib/middleware/rateLimit.ts` and apply to upload and webhook routes.
    2. Ensure S3 uploads use server-side encryption headers or configure provider encryption.
    3. Add tests `tests/security/rate.test.ts`.
- Files:
  - `lib/middleware/rateLimit.ts`, modifications to `app/api/*` routes, `tests/security/rate.test.ts`
- Acceptance: Rate limit tests pass when configured limits are enforced.
- Depends on: T006, T008
- Parallelizable: Yes [P]

 T017 — CI/CD and tests in GitHub Actions

- Description: Create a CI workflow that lints, type-checks, and runs the test suite.
- Actions:
    1. Add `.github/workflows/ci.yml` to run `npm ci`, `npm run lint`, `npm run build`, and `npm test`.
    2. Add caching for node modules and prisma prisma cache.
- Files:
  - `.github/workflows/ci.yml`
- Acceptance: CI pipeline runs passing on PR with test environment variables (mocked).
- Depends on: T001, T002
- Parallelizable: Yes [P]

 T018 — Deploy to Vercel (prep)

- Description: Prepare Vercel configuration and environment variable checklist.
- Actions:
    1. Add `vercel.json` if needed and document required env vars in `README.md`.
    2. Add a deploy checklist in `docs/deploy.md`.
- Files:
  - `vercel.json`, `README.md` (deploy section), `docs/deploy.md`
- Acceptance: Vercel deployment succeeds when env vars provided.
- Depends on: T001, T017
- Parallelizable: Yes [P]

 T019 — Polish & Docs

- Description: Final unit tests, performance tuning, accessibility check, finalize docs.
- Actions:
    1. Write remaining unit tests, fix accessibility issues, finalize developer docs.
    2. Run performance profiling on parsing and search queries.
- Files:
  - `docs/*`, `tests/*` (additional), `perf/*`
- Acceptance: All tests pass, performance within acceptable bounds.
- Depends on: T009, T012, T017
- Parallelizable: Yes [P]

 ---

 Parallel execution groups (examples):

- Group A [P]: T002, T003, T004 (prisma setup and contract tests)
- Group B [P]: T008, T012, T013 (upload parsing, viewer UI, autotagging UI components)
- Group C [P]: T010, T011, T014 (search, admin, analytics)

 How to run a single task (example) — for dev/LLM agents:

- Task agent command template (replace TXXX with task id):

  - Read task TXXX from `specs/001-product-requirements-document/tasks.md`
  - Create the files and tests listed under "Files" in the task
  - Run the test suite for tests that were added
  - If tests fail (expected), implement minimal code to make tests pass (follow TDD flow above)

 Notes & assumptions

- All tasks follow Test-First: tests must be added before code. Contract and integration tests are prioritized.
- Serverless DB connection patterns (Prisma + Neon) should use recommended unpooled patterns during migrations.
- Upload storage provider choices deferred to research; default to UploadThing (managed uploads via @uploadthing/* packages) unless a different provider is explicitly required.
- Implementation note: implementers should add a small server router (e.g., lib/uploadthing.ts or app/api/uploadthing/route.ts) and a client upload component (components/upload/UploadDropzone.tsx) that use @uploadthing/react and @uploadthing/next. See UploadThing docs for Next.js integration.

 Prepared by automated tasks generator from `plan.md`, `data-model.md`, `contracts/`, and `research.md`.
