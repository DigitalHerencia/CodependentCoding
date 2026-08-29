# Loaded Vibes™ Plugin Disposition

## Observed state

The workspace already contains an operational Loaded Vibes payload at:

```text
.agents/Loaded-Vibes-Codex-Plugin-v0.1.0/loaded-vibes/
```

The supplied standalone v0.1.0 package contains **68 files**. The embedded workspace copy contains **63 operational files**. A directory comparison showed the operational files are identical; the standalone package adds only:

```text
10.PROJECTS.CODEPENDENTCODING.Loaded-Vibes.Authoritative-Plugin-Spec.md
10.PROJECTS.CODEPENDENTCODING.Loaded-Vibes.Package-Manifest.md
BUILD-VERIFICATION.txt
README.md
SOURCE-NOTES.md
```

During handoff preparation the standalone source executed:

```text
node validators/validate-package.mjs .
PASS: 6 Codex skills validated.

node tests/validator-fixture-test.mjs
PASS.

node --check on every .mjs file
PASS.
```

This is evidence that the package is already substantially complete. It is not permission to redesign it.

## Canonical product boundary

Loaded Vibes:

- operates on **Arrangement™** repositories after generation;
- supplies inspect/classify/implement/review/verify/deliver skills;
- supplies architecture/security/validation/delivery instructions;
- supplies project agent assets;
- supplies deterministic validators/smoke/install tooling;
- does **not** normalize Virgule;
- does **not** prune Maximal Template;
- does **not** materialize Arrangement;
- does **not** replace TypeScripture or repository-local authority.

## Recommended source location

In the final Codependent Coding repository, keep **one first-class maintainable source package** for Loaded Vibes. A path such as `packages/loaded-vibes/` is a reasonable default because the plugin is a product artifact, while `.agents/...` is more naturally an installed/local-use surface. If the final package/build structure has an equally clear canonical plugin source convention, use it instead.

The important invariant is **one source owner, no duplicated active copy**.

If an installed `.agents` copy is retained for local Codex use, it should be derived from or clearly secondary to the canonical package source.
