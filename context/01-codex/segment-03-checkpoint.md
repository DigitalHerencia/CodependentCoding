# Segment Checkpoint

```yaml
segment: 3
outcome: Nine canonical Ontology defaults flow through shared schema/core resolver and a source-backed web catalog/detail surface.
status: completed
```

## Reused / migrated implementation

- Existing `ApplicationDefinition` schema, capability registry, and resolver remain the semantic owner.
- Canonical catalog metadata is represented in `packages/core/src/ontologies.ts` with the authority catalog source reference.

## Changed

- Added nine `ontologyIds` alongside retained legacy product preset aliases.
- Added ontology registry, shared presets, core/browser exports, catalog/detail routes, copy and download actions.
- Added responsive Ontology workbench styling aligned to supplied mockup hierarchy.

## Deleted / superseded

- The generic placeholder Ontologies surface is superseded by the interactive catalog.

## Compatibility adapters still present

- Four historical product preset IDs remain accepted for existing CLI/config consumers and tests.

## Evidence

### Executed

- `corepack pnpm --dir apps/web typecheck` — PASS (Next route type generation and TypeScript).
- Production docs server stopped after prior smoke checks.

### Skipped

- Full production build and browser smoke for this segment were not rerun after the final catalog edits.

### Blocked

- None.

### Inferred

- Catalog/detail routes use the shared `@hipster-stack/core` registry and resolver exports; static route generation covers all nine IDs.

## Known unresolved issues

- Visual browser verification and full build should be run before final completion.

## Next segment

- Segment 4: Anthimeria configuration workbench over the shared Application Definition resolver.
