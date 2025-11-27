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

| Layer              | Description               | Allowed Contents                                        | Owner / Access        | Primary References    |
| ------------------ | ------------------------- | ------------------------------------------------------- | --------------------- | --------------------- |
| Framework Assets   | Shipped to end users      | `templates/`, `dist/`, `genaiscript/`, `agent/` | Product Snapshot      | `PRD §4.1`, `TECH §2` |
| Development Assets | Maintainer-only workspace | `.github/`, `.vscode/`, `docs/`, `scripts/`             | Maintainers           | `PRD §4.2`, `TECH §1` |
| Generated Assets   | Produced by DevCycles     | `dist/src/`, `.loaded-vibes/logs/`, reports     | End Users / DevCycles | `PRD §4.3`, `TECH §6` |

### 1.2 Layer Responsibilities

- Framework layer packages canonical instructions, prompts, toolsets, CLI scripts, and GenAIScript automation. It MUST remain immutable once released `[PRD §2]`.
- Development layer hosts authoring experience (Copilot instructions, MCP configs, specs). It MUST never import runtime code or shipped payloads `[PRD §4.2]`.
- Generated layer captures DevCycle outputs (state, logs, source scaffolding) within consumer environments, isolated under `.loaded-vibes/` or `dist/src/**` `[TECH §5.1]`.

## 2. Layer Boundaries

- Framework assets must not import or depend on developer workspace files; cross-layer references go through manifests and templates `[TECH §2]`.
- Development assets must not reference runtime files (`dist/src/**`) to prevent leakage of user code back into the framework `[PRD §4.3]`.
- Generated runtime files must not feed back into Development assets; bootstrapper enforces one-way synchronization `[TECH §4.4]`.
- WHEN a DevCycle produces outputs, THE SYSTEM SHALL emit them under the Generated layer only and log paths for audit `[PRD §5.3]`.

## 3. Path & Ownership Rules

- Only DevCycle actions may write to `dist/**` and only when regenerating shipped payloads with maintainer approval `[PRD §4.1]`.
- Only maintainers may modify `.github/**`, `.vscode/**`, or `docs/**`; CI should block external contributors from touching shipped payloads `[PRD §9]`.
- No file in `src/**` may be modified by templates post-generation (immutable after Init Cycle) `[TECH §6.1]`.
- Bootstrapper logs any cross-layer mutation attempt and triggers the Bad Vibes Firewall for destructive operations `[PRD §5.5]`.

## 4. Interaction & Data Flow

1. **Bootstrapper** loads Development assets, validates manifests, then stages Framework assets for release `[TECH §4.4]`.
2. **Orchestrator** reads Framework assets (prompts/instructions/toolsets) and writes Generated outputs referenced by CLI dashboards `[TECH §4.2`, `§5.2`].
3. **CLI** surfaces status by reading Generated logs and state, never mutating Development files `[PRD §5.2]`.
4. **DevCycles** update `TODO.md` / `CHANGELOG.md` (Development) while emitting runtime code under Generated paths, ensuring traceability via requirement IDs `[PRD §5.3]`.

## 5. Validation & Tagging

- GitHub issues touching architecture MUST cite `[SPEC-ARCH]` plus the impacted PRD/Tech sections.
- CI scripts SHALL verify directory ownership (no references from shipped assets to `.github/**`) and fail on violations `[TECH §7]`.
- `loaded-vibes doctor` reports drift across the three layers and proposes remediation `[PRD §5.4]`.

