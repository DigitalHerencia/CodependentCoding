# Segment Checkpoint

```yaml
segment: 5
outcome: One authoritative runnable Maximal Template source is present and the /maximal explorer reads it directly.
status: completed
```

## Reused / migrated implementation

- Migrated the 440-file `src/TheMaximalTemplate-main` runnable superset into `template/`.
- Retained the existing core artifact inventory as the generator-facing path catalog.

## Changed

- Added explicit `template/MAXIMAL-TEMPLATE-OWNER.md` provenance and ownership marker.
- Replaced the generic `/maximal` placeholder with a source-backed file explorer and README preview.

## Deleted / superseded

- `src/TheMaximalTemplate-main` and `src/TheMaximalTemplate-demo` are historical evidence only; neither is imported by runtime code.

## Compatibility adapters still present

- Existing generator artifact paths remain unchanged and continue to target canonical template-relative paths.

## Evidence

### Executed

- `corepack pnpm --dir apps/web typecheck` — PASS after explorer implementation.
- `template/` contains 440 migrated files and an explicit source-owner marker.

### Skipped

- Independent `template/` application build was not run because it has its own dependency graph and provider setup; no server or provider actions were requested.

### Blocked

- None.

### Inferred

- `/maximal` reads only `template/` via `apps/web/lib/maximal.ts`, so old source trees are not runtime dependencies.

## Known unresolved issues

- Segment 6 must prove resolver generation and Arrangement materialization from this actual source.

## Next segment

- Segment 6: Ontology → Virgule → Arrangement generation semantics.
