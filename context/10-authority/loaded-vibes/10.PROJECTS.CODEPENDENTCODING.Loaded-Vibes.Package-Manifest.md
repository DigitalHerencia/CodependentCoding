---
title: Loaded Vibes™ Codex Plugin — Package Manifest
type: package-manifest
scope: loaded-vibes
status: active
version: 0.1.0
created: 2026-08-22
updated: 2026-08-22
---

# Loaded Vibes™ Codex Plugin — Package Manifest

## Operational payload

### Skills

- `loaded-vibes-inspect`
- `loaded-vibes-classify`
- `loaded-vibes-implement`
- `loaded-vibes-review`
- `loaded-vibes-verify`
- `loaded-vibes-deliver`

Each skill contains Codex `SKILL.md` metadata/instructions and `agents/openai.yaml` UI metadata. Skills that need deterministic execution include local scripts; conditional doctrine is stored in references.

### Project agent assets

- `arrangement-engineer.toml`
- `arrangement-reviewer.toml`
- `arrangement-verifier.toml`

### Validators

- `architecture.mjs`
- `arrangement-smoke.mjs`
- `validate-package.mjs`

### Project assets

- `AGENTS.md`
- `.codex/config.toml.example`
- `.codex/agents/*.toml`
- `.editorconfig`
- `.gitattributes`
- `.gitignore.loaded-vibes`
- `eslint.loaded-vibes.config.mjs`
- `prettier.config.mjs`
- `.github/commit-instructions.md`
- `.github/pull-request-instructions.md`

### Install/inspection scripts

- `scripts/Install-LoadedVibes.ps1`
- `scripts/install-project-assets.mjs`
- `scripts/inspect-arrangement.mjs`

## Validation performed on package build

- package manifest/skill structure validator;
- all JavaScript/ESM files parsed with `node --check`;
- skill frontmatter limited to `name` + `description`;
- `agents/openai.yaml` prompts reference the matching `$skill-name`;
- short UI descriptions checked for expected length;
- architecture validator exercised against a clean fixture and an intentional violation fixture;
- Arrangement smoke validator exercised against a synthetic valid Arrangement shape;
- project-asset installer dry-run exercised.

PowerShell execution could not be runtime-tested in the build container because `pwsh` was not installed; the PowerShell installer is therefore inspection-only in this package build.
