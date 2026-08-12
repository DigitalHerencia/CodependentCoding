# Hipster Stack Implementation Specs

GitHub Issues are the operational queue. Each active implementation Issue maps to one focused spec. Specs are durable scope/acceptance context, not a second project-management system.

## Current roadmap

```text
HS-301 governance + ecosystem boundary
        ↓
HS-302 active product/runtime rename
        ↓
HS-303 BoldKit + brand/design foundation
        ├───────────────┐
        ▼               ▼
HS-304 Product       HS-306 Builder
        │               │
        └──────┬────────┘
               ▼
         HS-305 interactive Docs
               │
               ▼
         HS-307 cleanup/conformance
```

HS-304 and HS-306 may proceed in parallel after their dependencies are satisfied. HS-305 consumes the shared shell/design and shared Builder/configuration presentation. HS-307 is final cleanup only.

## Visual authority

The local `context/mockups/` files are visual acceptance artifacts. Preserve their structure/aesthetic while correcting illustrative text/controls to match real product semantics.

## Historical specs

`LV-*` specs describe completed historical Loaded Vibes generator work. Preserve them as provenance. New approved work uses `HS-*` after the product boundary decision in HS-301.

## Verification rule

Do not create new test systems for this overhaul. Use only the focused typecheck/build, existing targeted tests, route smoke, interaction checks, and desktop/narrow visual inspection named by each active spec. Expand only when a focused failure demonstrates a cross-package regression.
