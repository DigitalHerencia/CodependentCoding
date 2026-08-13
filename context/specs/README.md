# Hipster Stack Implementation Specs

GitHub Issues are the operational queue. Each active implementation Issue maps to one focused spec. Specs are durable scope/acceptance context, not a second project-management system.

## Current roadmap

```text
HS-301 governance + ecosystem boundary
        ↓
HS-302 active product/runtime rename
        ↓
HS-303 BoldKit + locked brand/design foundation
        ├───────────────────────┐
        ▼                       ▼
HS-304 Product landing       HS-306 Constituter
        │                       │
        ▼                       │
HS-305 Simples catalog/detail  │
        └───────────┬───────────┘
                    ▼
          HS-307 cleanup/conformance
```

HS-304 and HS-306 may proceed in parallel after their dependencies are satisfied. HS-305 keeps Simples as the `/libraries/*` browse/detail surface while Docs remains canonical. HS-307 is final cleanup only.

## Pre-Codex brand baseline

Before HS-303 implementation begins, the owner locked the site vocabulary, semantic color/typography tokens, mobile-first responsive foundation, public hero/Simples/Constituter copy, wordmarks, and bottom background asset treatment. Active specs must preserve that baseline unless a concrete build/accessibility defect requires a focused correction.

## Visual authority

The local `context/mockups/` files are visual acceptance artifacts. Preserve their structure/aesthetic while correcting illustrative text/controls to match real product semantics.

## Historical specs

`LV-*` specs describe completed historical Loaded Vibes generator work. Preserve them as provenance. New approved work uses `HS-*` after the product boundary decision in HS-301.

## Verification rule

Do not create new test systems for this overhaul. Use only the focused typecheck/build, existing targeted tests, route smoke, interaction checks, and desktop/narrow visual inspection named by each active spec. Expand only when a focused failure demonstrates a cross-package regression.
