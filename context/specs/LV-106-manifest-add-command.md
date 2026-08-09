# LV-106 — Generation manifest and `add` command

## Outcome

Let users start smaller and add supported capability packs later without pretending Loaded Vibes can merge arbitrary upgrades forever.

## Scope

- define `.loadedvibes/manifest.json` or equivalent;
- record generator/template/recipe/module provenance;
- implement `loaded-vibes add <module>`;
- read current recipe/manifest, resolve prerequisites, show plan, apply supported module, update manifest;
- refuse unsupported or ambiguous add operations clearly.

## Acceptance

- a supported module can be added to a generated project through the CLI;
- prerequisites are automatically resolved;
- the command summarizes files/capabilities/setup added;
- no generic repository upgrade engine is introduced.
