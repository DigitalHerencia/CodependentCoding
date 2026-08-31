# Chapter 08: System Architecture Terminology

**The Book of Implementation™**

## Nomenclature

- Files use kebab-case plus responsibility suffix: `.fetcher.ts`, `.action.ts`, `.workflow.ts`, `.tx.ts`, `.policy.ts`, `.schema.ts`.
- React exports use PascalCase. Functions use verb-first camelCase. Capabilities use `<resource>.<operation>[.<scope>]`. Domain events use past tense. Error codes use stable `UPPER_SNAKE_CASE`.

## Presentation naming

- Use `Primitive`, `Block`, and `Feature` as architectural terms. “Shared component” and “domain component” may describe reuse or subject matter but do not create independent architectural layers.

## Boundary naming

- Names should disclose responsibility and cardinality: `getProjectDetail`, `listOrganizationProjects`, `archiveProjectWorkflow`, `reserveSeatTx`; avoid generic names that hide scope.
