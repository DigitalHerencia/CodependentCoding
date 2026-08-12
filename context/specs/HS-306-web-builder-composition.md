---
id: HS-306
title: Rebuild Builder as schema-driven composition workbench
status: active
type: implementation-spec
order: 306
depends_on: [HS-302, HS-303]
issue: 140
---

# HS-306 — Builder composition workbench

## Outcome

Refactor `/configure` into the approved dense two-panel Builder while preserving one shared configuration authority and existing working semantics.

## Required inputs

Read this spec, Issue #140, `context/docs/{web,configuration}.md`, `builder.png`, current `Configurator`, web configurator helper, shared capability/preset/schema files, and directly affected test/CSS/components only.

Do not crawl the template or unrelated generator code unless an actual semantic contradiction blocks acceptance.

## Architecture

```text
/configure route
  → Builder feature/client orchestration
    → pure Builder controls/blocks
      → BoldKit UI primitives
    → browser-safe shared configuration resolver
```

The client island owns local draft/UI state only. Shared code owns valid values, dependencies, conflicts, normalization, and generated output meaning.

## UI/functionality

Preserve the mockup's left controls/right inspectable result layout. Organize visible controls around generated-application concerns using only currently supported fields. Reuse generic property-control shapes where useful, but do not create ceremony. Right panel shows actual normalized `hipsterstack.json`, resolved/required capability consequences, CLI handoff, and output summary. Preserve working download/copy/share behavior if still cheap.

TanStack may inform compact control hierarchy and inspectable-plan behavior; mockup styling remains authoritative.

## Cleanup

Remove hardcoded web-only option/rule duplication and replaced Builder CSS/helpers after final callers disappear.

## Non-goals

No fake future à-la-carte options, hosted generation, account/backend state, template rewrite, provider changes, or new validation system.

## Verification

Web typecheck/build, directly affected configurator unit test, representative preset/dependency/edit/copy/share actions, desktop comparison, and one narrow-width check.
