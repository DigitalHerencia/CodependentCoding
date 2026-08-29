segment: 8
outcome: Loaded Vibes has one clear maintainable source owner with its six skills, agents, validators, and post-generation boundary intact.
authority:

- context/00-governance/04-Segmented-Build-Spec.md
- context/10-authority/loaded-vibes
  reuse:
- .agents/Loaded-Vibes-Codex-Plugin-v0.1.0/loaded-vibes
  change:
- add durable source-owner documentation only; preserve payload intact
  compatibility: Keep installed/local-use surface and plugin manifest unchanged.
  validation:
- package validator
- fixture validator
- node syntax checks
