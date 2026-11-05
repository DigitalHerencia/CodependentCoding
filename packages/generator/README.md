# Maximal Template generator

`@codependent/generator` owns initial application generation. CLI commands and the TUI share its composition and provisioning engines.

- `src/compose/`: application composition, package pruning, branding and access choices.
- `src/setup/`: initial integration/database provisioning and post-compose setup.
- `src/manifest/`: application source resolution (`HIPSTER_TEMPLATE` or the sibling Maximal Template).
- `src/*.mjs`: composition primitives, module validation, ownership and environment rendering.
- `assets/`: canonical module catalog and JSON Schema.
- `scripts/`: factory composition, Prisma module-removal and documentation checks.
- `tests/`: generator regressions and template conformance checks that must not ship inside the application.

The application source has no generator scripts or manifests. Generated app editing metadata is under `.loaded-vibes/`, and its runtime seed order is generated into `prisma/seeds/registry.ts`. Loaded Vibes owns ongoing editing and database lifecycle operations.

This is a local, unpublished factory package. The generator, CLI and plugin use their sibling packages in the factory checkout; generated SaaS applications run independently of that checkout.
