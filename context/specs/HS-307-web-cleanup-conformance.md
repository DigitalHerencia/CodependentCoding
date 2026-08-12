---
id: HS-307
title: Remove superseded web code and run focused UI conformance
status: active
type: implementation-spec
order: 307
depends_on: [HS-304, HS-305, HS-306]
issue: 141
---

# HS-307 — Web cleanup and conformance

## Outcome

Finish the overhaul by deleting superseded web code and proving the focused Product/Docs/Builder result without expanding into a repository-wide validation project.

## Required inputs

Read this spec, Issue #141, changed web files/direct imports from HS-304..HS-306, active `context/docs/web.md`, and the mockups. Expand only for a concrete failure.

## Cleanup

- delete dead Libraries-only presentation after redirects exist;
- delete replaced old generator branding, wordmark cropping, custom icons, obsolete Builder helpers, and CSS/tokens with no caller;
- dedupe only proven duplicate presentation responsibilities;
- search active web/runtime content for incorrect generator references to Loaded Vibes while preserving historical and legitimate downstream references.

## Conformance

Verify Product, interactive Docs, Builder, shared shell, wordmark, and desert horizon are one coherent responsive system. Verify visible actions/links are real and no illustrative dead control remains.

## Non-goals

No broad refactor, dependency upgrade, new tests/screenshots framework, generator/template migration, or deployment.

## Verification

Web typecheck, web build, directly affected configurator test, route/action smoke, desktop mockup comparison, and one narrow-width check. Report unrun checks truthfully.
