# Segment 3 Plan

```yaml
Segment: 3 - Ontology normalized defaults
Outcome: Replace the four transitional product presets with nine canonical Ontology starter definitions owned by the shared schema/core resolver, and expose one source-backed /ontologies catalog plus inspectable detail routes.
Existing implementation to reuse: packages/schema application-definition and recipe contracts; packages/core resolver, capability registry, dependency closure, manifest, and existing preset normalization; the authoritative Ontology source specification and canonical catalog; the staged /ontologies web surface.
Files/owners to change: packages/schema/src/{recipe,application-definition,index}.ts; packages/core/src/{presets,application-definition,index,browser}.ts and directly imported tests/fixtures; apps/web features/routes/components that currently render the staged Ontology surface; machine contracts and execution records.
Compatibility adapters (if any): retain the four product preset IDs as an explicit deprecated compatibility map only where existing CLI/config inputs require them; canonical resolver output and web catalog use nine Ontology IDs and never expose arbitrary constituent toggles.
Focused validation: parse the authoritative nine-entry list and canonical catalog; assert nine unique schema/core Ontology IDs; resolve and inspect every default through the shared resolver; run targeted package tests/typechecks, web typecheck/build, and browser catalog/detail smoke including source-backed relationships and real Copy/Download actions.
Deletion/removal deferred until: four-preset compatibility aliases remain until CLI/config and generated-package checks prove no callers depend on them; duplicate Libraries/catalog models remain migration evidence for Segment 4.
```
