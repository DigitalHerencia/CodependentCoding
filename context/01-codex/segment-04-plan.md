segment: 4
outcome: Anthimeria configuration workbench produces a portable Application Definition through the shared resolver.
authority:

- context/00-governance/04-Segmented-Build-Spec.md
- context/10-authority/anthimeria
  reuse:
- packages/schema
- packages/core
  change:
- apps/web/app/anthimeria
- apps/web/features
  compatibility: Preserve legacy configuration and resolver contracts.
  validation:
- focused typecheck
- production build
- browser interaction smoke
