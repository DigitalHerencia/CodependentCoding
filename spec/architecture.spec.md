# Loaded Vibes Architecture Specification

**Reference ID:** SPEC-ARCH

## Purpose

Define the high-level structural architecture of the Loaded Vibes framework: asset categories, workspace layers, and boundaries.

## Authoritative References

- `[PRD §4.1–4.3]` Asset taxonomy, directory responsibilities, workspace vs. release enforcement.
- `[PRD §9]` Directory ownership matrix.
- `[TECH §1–2]` System context, layered architecture overview.
- `[TECH §6]` Canonical DevCycle table (drives generated assets).

## 1. Core Architecture Model

### 1.1 Asset Layers

| Layer              | Description               | Allowed Contents                                                                                                                                                              | Owner / Access        | Primary References    |
| ------------------ | ------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------- | --------------------- |
| Development Assets | Maintainer-only workspace | `.github/`, `.vscode/`, `docs/`, `spec/`, `templates/`, `decisions/`, `.agent_work/`, marketing site (`app/`, `public/`)                                                      | Maintainers           | `PRD §4.2`, `TECH §1` |
| Framework Assets   | Shipped to end users      | `dist/.vscode/`, `dist/.github/`, `dist/docs/`, `dist/.genaiscript/`, `dist/genaiscript/`, `dist/cli/`, `dist/scripts/`, `dist/packages/`, `dist/.loaded-vibes/`, `dist/src/` | Product Snapshot      | `PRD §4.1`, `TECH §2` |
| Generated Assets   | Produced by DevCycles     | User project: `.loaded-vibes/logs/`, `src/` (mirrored from `dist/src/`)                                                                                                       | End Users / DevCycles | `PRD §4.3`, `TECH §6` |

### 1.2 Layer Responsibilities

- Framework layer packages canonical instructions, prompts, toolsets, CLI scripts, and GenAIScript automation. It MUST remain immutable once released `[PRD §2]`.
- Development layer hosts authoring experience (Copilot instructions, MCP configs, specs, templates). It MUST never import runtime code or shipped payloads from `dist/**` `[PRD §4.2]`.
- Generated layer captures DevCycle outputs (state, logs, source scaffolding) within consumer environments, isolated under `.loaded-vibes/**` or `src/**` `[TECH §5.1]`.

## 2. Layer Boundaries

- Framework assets must not import or depend on developer workspace files; cross-layer references go through manifests and templates `[TECH §2]`.
- Development assets must not reference runtime files (`dist/src/**`) to prevent leakage of user code back into the framework `[PRD §4.3]`.
- Generated runtime files must not feed back into Development assets; bootstrapper enforces one-way synchronization `[TECH §4.4]`.
- WHEN a DevCycle produces outputs, THE SYSTEM SHALL emit them under the Generated layer only and log paths for audit `[PRD §5.3]`.

## 3. Path & Ownership Rules

- Only DevCycle actions may write to `dist/**` and only when regenerating shipped payloads with maintainer approval `[PRD §4.1]`.
- Only maintainers may modify `.github/**`, `.vscode/**`, `docs/**`, `spec/**`, `templates/**`, `decisions/**`, or `.agent_work/**`; CI should block external contributors from touching shipped payloads `[PRD §9]`.
- No file in user project `src/**` may be modified by templates post-generation (immutable after Init Cycle) `[TECH §6.1]`.
- Bootstrapper logs any cross-layer mutation attempt and triggers the Bad Vibes Firewall for destructive operations `[PRD §5.5]`.
- WHEN referencing `.loaded-vibes/**`, distinguish between the shipped snapshot (`dist/.loaded-vibes/**`) and the user's runtime mirror (`<project-root>/.loaded-vibes/**`) `[PRD §4.3]`.

## 4. Interaction & Data Flow

1. **Bootstrapper** loads Development assets, validates manifests, then stages Framework assets for release `[TECH §4.4]`.
2. **Orchestrator** reads Framework assets (`dist/.github/prompts/`, `dist/.github/instructions/`, `dist/.github/toolsets/`) and writes Generated outputs to `dist/.loaded-vibes/**` which later mirror to user projects `[TECH §4.2`, `§5.2`].
3. **CLI** surfaces status by reading Generated logs (`dist/.loaded-vibes/logs/` or user `.loaded-vibes/logs/`) and state, never mutating Development files `[PRD §5.2]`.
4. **DevCycles** update `TODO.md` / `CHANGELOG.md` (Development) while emitting runtime code under `dist/src/` (later mirrored to user `src/`), ensuring traceability via requirement IDs `[PRD §5.3]`.

## 5. Validation & Tagging

- GitHub issues touching architecture MUST cite `[SPEC-ARCH]` plus the impacted PRD/Tech sections.
- CI scripts SHALL verify directory ownership (no references from `dist/**` assets to workspace `.github/**`, `.vscode/**`, `docs/**`) and fail on violations `[TECH §7]`.
- `loaded-vibes doctor` reports drift across the three layers (Development, Framework, Generated) and proposes remediation `[PRD §5.4]`.
