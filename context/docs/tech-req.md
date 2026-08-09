---
title: Loaded Vibes Technical Requirements
artifact: technical-requirements
status: approved-governance
product: Loaded Vibes
authority: source-of-truth
---

# Loaded Vibes Technical Requirements

## 1. Runtime baseline

Generator:

- Node.js `24.x`;
- pnpm `11.1.1`, pinned at repository level;
- TypeScript ESM;
- npm create package `create-loaded-vibes`;
- executable `create-loaded-vibes`.

Generated application versions inherit the canonical Vibes support matrix unless changed through an approved compatibility update.

## 2. CLI dependency policy

Use a deliberately small dependency surface.

| Concern                   | Requirement                                    |
| ------------------------- | ---------------------------------------------- |
| argument parsing          | `commander`                                    |
| interactive prompts       | `@clack/prompts`                               |
| runtime config validation | `zod`                                          |
| subprocess execution      | `execa`                                        |
| package-name validation   | `validate-npm-package-name`                    |
| semantic compatibility    | `semver` where required                        |
| filesystem                | prefer Node `fs/promises`, `fs.cp`, and `path` |

Build/test tooling:

- `tsdown` for bundling unless repository evidence shows incompatibility;
- TypeScript;
- Vitest;
- ESLint;
- Prettier.

Do not add a text templating engine until an actual parameterized-file requirement justifies it. Prefer structured transforms and explicit file operations.

## 3. Repository topology

```text
/
├─ src/
│  ├─ cli.ts
│  ├─ commands/create.ts
│  ├─ config/
│  │  ├─ schema.ts
│  │  ├─ normalize.ts
│  │  └─ defaults.ts
│  ├─ prompts/
│  ├─ preflight/
│  ├─ generator/
│  │  ├─ plan.ts
│  │  ├─ materialize.ts
│  │  ├─ transforms.ts
│  │  ├─ cleanup.ts
│  │  └─ provenance.ts
│  └─ lifecycle/
│     ├─ install.ts
│     ├─ git.ts
│     ├─ validate.ts
│     └─ rollback.ts
├─ template/
│  └─ ...canonical generated application...
├─ modules/
│  └─ ...explicit optional modules only...
├─ tests/
│  ├─ unit/
│  ├─ integration/
│  ├─ generated/
│  └─ fixtures/
├─ context/
├─ .agents/
├─ AGENTS.md
├─ package.json
└─ pnpm-lock.yaml
```

V1 is one published package, not a multi-package framework. Split packages only when executed evidence proves an independent package boundary.

## 4. Configuration model

All input surfaces normalize into one versioned schema.

```text
interactive answers ─┐
CLI flags            ├─> normalize -> validate -> LoadedVibesConfig
config file          ┘
```

Generation logic never consumes raw prompt-library values.

Conceptual fields:

- `schemaVersion`;
- `projectName`;
- `targetDirectory`;
- `preset`;
- supported module selections;
- `git.initialize`;
- `install.enabled`.

Unknown config fields are rejected unless a future approved compatibility rule says otherwise.

## 5. Determinism

For a given generator version, template revision, and normalized supported configuration, planned files, dependencies, scripts, and transformations must be stable.

Do not write volatile timestamps into canonical output.

Determinism tests compare generator-owned file plans and normalized generated source before environment-specific caches/artifacts.

## 6. Filesystem safety

Before writing:

- resolve/normalize target;
- reject dangerous roots;
- reject non-empty directories;
- reject traversal escaping intended parent;
- avoid following destination symlinks outside target;
- validate package name separately from path;
- verify template source.

Generation uses a run-owned sibling staging directory. Cleanup must be idempotent and may remove only run-owned paths.

## 7. Materialization

Generation must:

1. copy canonical `template/`;
2. exclude Git history, caches, credentials, reports, and template-maintenance artifacts;
3. apply structured identity transforms;
4. apply approved module contributions;
5. write stable provenance;
6. validate generated governance/config structure;
7. continue into lifecycle.

Blind global search/replace is prohibited for structured files.

## 8. Package installation

V1 uses pnpm.

Default:

```text
pnpm/corepack compatibility check
-> pnpm install --frozen-lockfile
-> pnpm db:generate
-> required acceptance validation
```

If an approved transform changes dependency resolution, intentionally regenerate and validate the lockfile rather than silently dropping frozen-lockfile guarantees.

Subprocesses use argv arrays, never interpolated user-controlled shell strings.

## 9. Git initialization

Enabled by default unless `--no-git`.

The generator may initialize Git and set the approved initial branch name. It does not create a commit unless a later approved spec explicitly requires it.

Git failure is reported separately from application generation/validation.

## 10. Generated application validation

The Vibes baseline exposes canonical gates including:

- `pnpm validate:fast`;
- `pnpm governance:validate`;
- `pnpm architecture:validate`;
- `pnpm validate`;
- `pnpm validate:ci`;
- `pnpm validate:release`.

Default generator acceptance executes generated `pnpm validate:ci` or its approved successor.

`validate:release` remains a separate credentialed/release claim.

## 11. Generator validation

Required repository scripts:

- `pnpm format:check`;
- `pnpm lint`;
- `pnpm typecheck`;
- `pnpm test`;
- `pnpm test:generated`;
- `pnpm build`;
- `pnpm pack:check`;
- `pnpm validate`.

`test:generated` must invoke the real CLI, not a test-only generator path.

## 12. Generated-output matrix

At minimum prove:

- default generation;
- non-interactive config;
- `--dry-run`;
- `--no-git`;
- `--skip-install` truthful status;
- invalid name/path rejection;
- occupied target rejection;
- deterministic repeat generation;
- Windows path behavior;
- canonical generated `pnpm validate:ci`.

When the first optional module ships, test included and excluded output.

## 13. Packaging

Before release:

- build clean source;
- create npm pack artifact;
- inspect contents;
- execute packed package through isolated `pnpm dlx`/equivalent;
- generate fresh app;
- run generated acceptance validation;
- secret-scan repo and package contents.

Workspace success does not prove package success.

## 14. CI and release

PR CI invokes repository-owned scripts instead of reimplementing them inline.

Release may publish only after generator CI, packed-package proof, default generated-project acceptance, version metadata checks, and security scans pass.

Publishing, deployment, and provider mutation are explicit external actions.

## 15. Deployment boundary

The generator creates Vercel-oriented Next.js output but does not deploy V1 projects.

Generated applications preserve environment separation, typed config, migration-order guidance, build/CI compatibility, rollback guidance, and smoke-test instructions.
