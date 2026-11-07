# CodependentCoding — Traceable Engineering Governance Kit

**Repository-shaped template package.** All artifact paths are relative to a repository root. This kit does **not** modify the live repository.

## What is inside

- **3 milestones → 9 phases → 20 dev cycles → 100 JSON specifications**, faithfully named from the supplied Engineering exports.
- Two GitHub issue forms: **bug** and **feature**, with 100 pre-classified issue records and GitHub-ready titles.
- Five Markdown documentation templates (PRD, tech requirements, architecture, auth, design), each with **100 individually identified authoring slots**.
- Three YAML contracts and three JSON execution files, cross-referenced to the same stable specification IDs.
- Issue-to-PR traceability, metadata for labels/milestones/Projects v2, read-only validation and dry-run GitHub CLI scripts.

## Naming and source of truth

- Native spec ID / filename: `M1-P1.2-SCAFF-T01` / `M1-P1.2-SCAFF-T01.json`.
- SOP-compatible work code: `ENG-M1-P1.2-SCAFF-T01` (retained inside the JSON).
- A **dev cycle** is the five-spec parent previously called a project in the Engineering export.
- GitHub accepts **Markdown bodies via `gh issue create --body-file`**; JSON is this kit’s machine-readable source, **not a requirement of the GitHub CLI**.
- GitHub does not read `.github/{labels,milestones,project,dependabot}.json` natively; the kit scripts read these metadata files. **Only `.github/dependabot.yml` is a native Dependabot config.**

## Local validation (Windows PowerShell)

```powershell
node ./scripts/governance/validate.mjs
node ./scripts/governance/publish-issues.mjs --id M1-P1.1-INIT-T01
```

The second command is a **dry run**. For explicit GitHub writes, read `scripts/governance/README.md` and add `--apply` after configuring `gh auth login`. Labels and milestones must exist before publishing issues.

## Integration

This package intentionally includes filenames that exist in the live repo, e.g. `context/docs/PRD.md`, `.github/pull_request_template.md`, `LICENSE`, and agent contracts. **Review and merge their contents; do not extract this ZIP blindly over the repository.** Preserve existing application doctrine, CC-numbered work, history, and validated functionality.

## Source authority

The user-confirmed Engineering CSV export supplies **milestone and task names**. Digital Herencia’s [Ticketing SOP](https://app.notion.com/p/2d8a4e63bf2380dd9a04cbbb762b9c7c) supplies the work-code shape and ticket rollup semantics. Source Ontologies™ are maintained as a nine-item registry, not invented assignments to unrelated work. Empty requirement content is intended to be filled in by users.

## Files

[Roadmap](ROADMAP.md) · [Context](context/README.md) · [Agents](.agents/README.md) · [GitHub](.github/README.md) · [Security](SECURITY.md) · [Support](SUPPORT.md) · [License](LICENSE)
