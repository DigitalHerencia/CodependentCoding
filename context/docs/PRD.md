---
title: Codependent Coding — Product Requirements
doc: PRD
status: active
owner: Ivan P. Roman
updated: 2026-10-22
compiles_to: .claude/contracts/application.yaml
---

# Codependent Coding — Product Requirements

## 1. Purpose

Codependent Coding is Ivan's **internal software factory**: a local toolchain that turns a SaaS idea into a running, architecture-conformant MVP in **hours instead of weeks**, so ideas can be validated before committing to a full build.

It is not a hosted product. It has one user, runs locally, and is never published to npm. The landing page exists as a portfolio/brand surface only.

## 2. Problem

The first implementation tried to be a product: a public catalog site, a configuration workbench (Anthimeria), a multi-state application definition (Virgule), a hand-maintained generator ownership catalog, and five overlapping documentation authorities. Every truth lived in several places, drifted, and broke:

- The generator's file catalog pointed at 226 paths that no longer existed; a "bare" app generated 63 pages.
- Doctrine was written in prose and partially enforced; the template drifted from it (241 doctrine findings on audit).
- Lint could not run (TypeScript 7 vs typescript-eslint); `pnpm test` pointed at a folder that did not exist.

## 3. Goals

| ID  | Goal                                           | Measure                                                                                        |
| --- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------- |
| G1  | Scaffold a new SaaS app locally in one command | `hipster-stack new` → running app with auth + tenancy in ≤ 10 minutes                          |
| G2  | Template-to-MVP in hours                       | A dogfood idea reaches a validated MVP running locally in ≤ 1 working day                      |
| G3  | Doctrine is executable                         | Every mechanizable doctrine rule is an ESLint rule with a `CC-*` ID; template lints clean      |
| G4  | One source of truth per fact                   | Module ownership is computed from naming conventions; no hand-maintained file catalogs         |
| G5  | Agents build inside the rails                  | Loaded Vibes plugin + hooks keep Claude Code on the template's patterns and nomenclature       |
| G6  | Hand-coding stays easy                         | Scaffolds produce correctly named, correctly placed files; lint explains violations by rule ID |

## 4. Non-goals

- Publishing the CLI or template as a package or hosted service.
- A hosted configuration workbench or server-backed catalog. (The site's static doctrine docs, template browser and command builder are allowed: DEC-069.)
- Supporting stacks other than the fixed Hipster Stack (Next.js / Prisma / Neon / Clerk).
- Multi-user collaboration features for the factory itself.
- Production hardening of generated apps beyond the base security contract (that happens after an idea is validated).

## 5. User

**Ivan** — solo builder, self-taught full-stack developer, works in VS Code on Windows with Claude Code (Pro plan, usage-limited) and PowerShell 7. Validates many ideas; wants opinionated defaults, his own nomenclature everywhere, and minimal decisions per project.

Constraint that shapes everything: **agent usage is metered**. Deterministic work (scaffolding, renaming, composing) belongs in the CLI, not in tokens.

## 6. Product components

| Component | Name               | Role                                                                                                         |
| --------- | ------------------ | ------------------------------------------------------------------------------------------------------------ |
| Doctrine  | Codependent Coding | Architecture rules, naming, layer contracts — enforced by ESLint/Prettier                                    |
| Template  | Maximal Template   | One runnable Next.js app containing the base + every module; the workshop where modules are developed        |
| CLI       | Hipster Stack      | Local CLI: `new`, `add`, `slice`, `doctor`, `compose`                                                        |
| Plugin    | Loaded Vibes       | Claude Code plugin: idea grill, planning, slicing, checking, shipping, handoff                               |
| Site      | Landing page       | Static site: landing, Doctrine docs, Maximal browser, Hipster Stack builder, Loaded Vibes, FAQ/Terms/Privacy |

Retired vocabulary: Anthimeria, Virgule, Arrangement, Simples, Ontologies (as product terms). Starter bundles are now called **presets**.

## 7. Functional requirements

### 7.1 Landing page (FR-SITE)

- FR-SITE-1 Routes: `/`, `/doctrine`, `/maximal`, `/hipster-stack`, `/loaded-vibes`, `/faq`, `/terms`, `/privacy` (plus framework `not-found`, `error`, `loading`). Header and footer link only to these (DEC-069).
- FR-SITE-2 Keeps current visual language and assets (crown, Digital Herencia, desert).
- FR-SITE-3 Static; no data access; deploys on Vercel.

### 7.2 Maximal Template (FR-TPL)

- FR-TPL-1 Runnable standalone Next.js app at `template/` with its own `package.json` and lockfile.
- FR-TPL-2 **Base** (always generated): Clerk auth, application-owned users/organizations/memberships, RBAC authz, RLS tenant transactions, shells/nav, design system, settings, onboarding, public pages (landing, FAQ, terms, privacy), error/loading conventions, Clerk webhook sync, dev-only design-system proof page.
- FR-TPL-3 **Domain modules**: `crm`, `projects`, `support`, `marketing`, `invoicing`, `social`, `ai`, `portal`, `admin`.
- FR-TPL-4 **Add-on modules**: `billing` (Stripe), `uploads` (Vercel Blob), `media` (Cloudinary), `email` (SendGrid), `inference` (Hugging Face), `ratelimit` (Upstash).
- FR-TPL-5 `projects` is the **golden module**: the reference vertical slice every scaffold derives from.
- FR-TPL-6 Lints clean against the doctrine (`pnpm lint` exits 0), type-checks, formats, and passes tests.
- FR-TPL-7 Base builds with zero modules; every module builds with only its declared dependencies.

### 7.3 Module system (FR-MOD)

- FR-MOD-1 One build manifest: `template/hipster.modules.json` (id, kind, label, dependsOn, extra owned globs, npm deps, env vars, presets).
- FR-MOD-2 File ownership is **computed** from naming conventions (Architecture §6). Every file is owned by base or exactly one module; an orphan check fails CI otherwise.
- FR-MOD-3 Runtime contributions (nav, dashboard widgets, permissions) live in `lib/modules/<id>.module.ts`; `lib/modules/registry.ts` lists installed modules and is rewritten by the CLI.
- FR-MOD-4 Prisma uses multi-file schema (`prisma/schema/<id>.prisma`); cross-module relation fields on base models carry a `// @module <id>` tag the CLI strips.
- FR-MOD-5 RLS policies live in `prisma/rls/<id>.sql`, applied by `pnpm db:init`.
- FR-MOD-6 Lint forbids cross-module imports not declared in `dependsOn`, and base imports of module code.

### 7.4 Hipster Stack CLI (FR-CLI)

- FR-CLI-1 Local only; installed with `pnpm link --global`; binary `hipster-stack`.
- FR-CLI-2 `new <dir>`: prompts for app name, preset or modules, primary brand color; resolves `dependsOn`; composes by pruning unowned files; rewrites registry, package deps, `.env.example`; writes `hipster.json`; installs generated-app governance (CLAUDE.md, context docs, contracts, execution files); installs deps; `git init`.
- FR-CLI-3 `--provision` (optional): creates GitHub repo (`gh`), Neon project/branch (`neonctl`), Vercel project + env (`vercel`); Clerk runs in keyless dev mode until keys are pasted.
- FR-CLI-4 `slice <entity> --module <id> --fields "<dsl>"`: generates the full vertical slice (Prisma model, schema, types, select, DTO, fetchers, actions, features, form, skeletons, pages, permissions, RLS SQL, test stub) from golden-module templates.
- FR-CLI-5 `add <module>`: adds a module to an existing generated app.
- FR-CLI-6 `doctor`: verifies env, database reachability, migrations, lint, and structure.
- FR-CLI-7 `compose --all|--preset|--modules <dir>`: non-interactive composition for CI.
- FR-CLI-8 Deterministic: same inputs → byte-identical output (excluding timestamps in `hipster.json`).

### 7.5 Loaded Vibes plugin (FR-PLG)

- FR-PLG-1 Claude Code plugin installed from a local marketplace in this repo.
- FR-PLG-2 Activates only in repos containing `hipster.json`.
- FR-PLG-3 Skills: `idea` (grill session → 5 docs → 3 YAML contracts), `plan` (docs → issues, optional GitHub sync), `slice` (calls CLI, then fills domain logic), `classify` (where does this file go), `check` (runs validation, fixes by rule ID), `ship` (deploy + smoke), `handoff` (updates decisions/progress/handoff).
- FR-PLG-4 Hooks: lint every edited file (PostToolUse); block session end when code changed but execution files did not (Stop).
- FR-PLG-5 Subagents: `reviewer` (architecture/security review), `verifier` (runs evidence, never trusts claims).

### 7.6 Governance (FR-GOV)

- FR-GOV-1 Human intent in `context/docs/*.md`; machine contracts in `.claude/contracts/*.yaml`; execution state in `.claude/execution/*.json`; work items in `context/specs/issues/*.md`.
- FR-GOV-2 CLAUDE.md is a router (≤ 60 lines).
- FR-GOV-3 Issues sync to GitHub (labels, milestones, Project v2) by script.
- FR-GOV-4 Generated apps receive the same governance shape, unfilled.

## 8. Success criteria (v1.0.0)

1. `hipster-stack new demo --preset blank --yes` produces an app that installs, lints, type-checks, and builds.
2. CI composes blank, each preset, and the maximal set; all pass lint/typecheck/build.
3. Template: 0 doctrine findings; RLS cross-tenant test passes against real Postgres.
4. A timed dogfood run (idea → `/idea` → 3 slices → `/check`) produces a validated app running locally in one working day. Deploying an app (`/ship`) is the owner's call per app, not a v1 gate (DEC-060).
5. All issues in milestones M0–M6 closed with evidence recorded in `progress.json`.

## 9. Risks

| Risk                                             | Mitigation                                                                       |
| ------------------------------------------------ | -------------------------------------------------------------------------------- |
| Naming-convention ownership misclassifies a file | Orphan check + explicit `owns` globs in manifest; CI composes every module alone |
| Agent usage limits stall work                    | Small issues; deterministic CLI scaffolds; concise CLAUDE.md                     |
| Prisma relation tags edited by hand incorrectly  | CLI validates tags; `prisma validate` runs after every compose in CI             |
| Toolchain churn (TS/ESLint majors)               | Exact pins; Dependabot grouped; upgrades are explicit issues                     |
| Scope creep toward a product                     | Non-goals above; any new surface needs a decision record                         |
