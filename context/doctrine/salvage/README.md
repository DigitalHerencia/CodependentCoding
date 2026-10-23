# Salvage

Reference copies kept when CC-007 removed the retired generator packages. Code files carry a `.txt` suffix so nothing builds, lints, or imports them.

| Path | From | Reused by |
| --- | --- | --- |
| `core/presets.ts.txt`, `core/ontologies.ts.txt` | `packages/core/src/` | M4 CLI presets and module defaults |
| `loaded-vibes/validators/` | `packages/loaded-vibes/validators/` | M5 Loaded Vibes plugin checks |
| `loaded-vibes/prompts/` | `packages/loaded-vibes/prompts/` | M5 Loaded Vibes plugin prompts |

`core/*.ts.txt` import `@hipster-stack/schema`, which no longer exists. Port the shapes, not the imports.
