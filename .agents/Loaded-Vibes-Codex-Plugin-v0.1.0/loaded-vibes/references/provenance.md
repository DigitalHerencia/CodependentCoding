# Arrangement Provenance

An Arrangement may contain `hipsterstack.json` and `.hipsterstack/manifest.json` as intentional generation provenance.

Use them when present to understand:

- selected starting definition / Ontology;
- resolved capabilities;
- generator/template revision;
- generated artifact ownership/provenance;
- supported post-generation additions;
- remaining setup requirements.

Treat them as evidence, not as authority to overwrite the repository's current implementation. If current code and provenance disagree, inspect the history and local governance before deciding which side is stale.

Generator-only ownership catalogs, pruning internals, Anthimeria UI state, and generator implementation do not belong to normal Arrangement runtime architecture.
