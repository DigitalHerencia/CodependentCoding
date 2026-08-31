# Loaded Vibes™ Codex Plugin

**Purpose:** work on **The Arrangement™ Generated Artifact** without casually destroying the architecture that generated it.

Loaded Vibes is the Codex execution derivative of **The Codependent Coding™ WebApp Architecture**. It is deliberately narrow: inspect an Arrangement, classify a change, implement it in the correct owning layer, review the result for architecture/security drift, run proportional evidence-backed verification, and deliver through Git/GitHub when requested.

## Product boundary

```text
Codependent Coding™ WebApp Architecture
             ↓ governs
       The Arrangement™
             ↑
      Loaded Vibes™
  Codex execution derivative
```

Loaded Vibes does **not** generate Arrangements. The Hipster Stack™ does that. Loaded Vibes operates **after generation** on the standalone repository.

## Why this package is shaped this way

The supplied archive contained valuable first-generation ideas: context acquisition, phase-specific instructions, skills, validators, scripts, tool boundaries, and repository inspection. The old 18-DevCycle orchestration model is intentionally not revived. This package keeps the surviving intent and expresses it as a small set of Codex-native skills plus deterministic validators and project-scoped assets.

Current Codex skills use `SKILL.md` with optional `scripts/`, `references/`, `assets/`, and `agents/openai.yaml`. This package follows that layout. Project-scoped custom subagents are provided separately under `assets/arrangement-project/.codex/agents/` because current Codex custom agent roles are project/user configuration rather than reliably plugin-registered content.

## Core workflow

```text
inspect reality
    ↓
classify responsibility
    ↓
plan smallest complete change
    ↓
implement in owning layer
    ↓
review architecture/security drift
    ↓
run proportional validation
    ↓
report evidence
    ↓
Git/GitHub delivery when requested
```

## Included skills

| Skill | Responsibility |
|---|---|
| `loaded-vibes-inspect` | Map an Arrangement, its local rules, provenance, affected architecture, tests, and risks before substantial work. |
| `loaded-vibes-classify` | Classify files/changes into route, feature, block, primitive, fetcher, action, workflow, transaction, auth, authz, provider, webhook, schema/type, cache, constant, or utility ownership. |
| `loaded-vibes-implement` | Execute bounded changes while preserving Arrangement layer contracts and existing repository patterns. |
| `loaded-vibes-review` | Review a diff/repository for architecture, security, tenancy, provider, and responsibility drift. |
| `loaded-vibes-verify` | Select and execute proportional checks, including deterministic architecture validation and Arrangement smoke tests. |
| `loaded-vibes-deliver` | Prepare commits/PRs and evidence-backed handoff when Git/GitHub delivery is requested and authorized. |

## Deterministic tooling

```text
validators/architecture.mjs
validators/arrangement-smoke.mjs
validators/validate-package.mjs
scripts/inspect-arrangement.mjs
scripts/install-project-assets.mjs
```

The validators intentionally enforce only stable mechanical rules. They do not pretend to prove semantic correctness that static inspection cannot establish.

## Project assets

`assets/arrangement-project/` contains conservative templates for:

- root `AGENTS.md` universal workflow;
- `.codex/agents/*.toml` project-scoped agent roles;
- `.codex/config.toml.example`;
- `.editorconfig`;
- `.gitattributes`;
- `.gitignore.loaded-vibes` merge fragment;
- `eslint.loaded-vibes.config.mjs` architecture-rule helper;
- `prettier.config.mjs`;
- GitHub commit and PR instructions.

The installer refuses to overwrite existing project files by default.

## Local use

For local Codex development, install/copy the six skill directories into `$CODEX_HOME/skills` (normally `~/.codex/skills`) or publish/install the package through your normal plugin distribution path. Then inspect the project-asset install plan:

```powershell
node .\scripts\install-project-assets.mjs --target D:\path\to\arrangement --dry-run
```

Apply only when the plan looks correct:

```powershell
node .\scripts\install-project-assets.mjs --target D:\path\to\arrangement
```

Existing files are not replaced unless `--force` is explicitly supplied.

## Package status

This is a **working v0.1 architecture package**, not a claim that it has been submitted to or accepted by the OpenAI Plugin Directory. The `plugin.json` follows the plugin-manifest convention found in the supplied reference archive for portable package metadata; the actual Codex-native operational payload is the skill folders plus project-scoped assets.
