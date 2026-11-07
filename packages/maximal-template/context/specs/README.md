# Engineering specifications

The catalog is [`catalog.json`](catalog.json): `M1|M2|M3 → Pn.n → 20 dev cycles → 100 specs`. Each dev cycle contains five `T01..T05` JSON files. The work code in every spec retains the Notion SOP `ENG-` prefix; the filename omits it by user preference.

All 100 records have unique GitHub-ready titles, initial `bug|feature` classifications, and complete metadata links to the five docs and three agent contracts. Requirements, owners, acceptance criteria, evidence and ontology assignment are user-fillable. Each JSON validates structurally with [`schema.json`](schema.json); changing a spec ID requires updating its catalog, docs, contracts, and execution records.

Source IDs are not GitHub issue numbers: GitHub assigns numbers when created. Preserve existing `CC-...` issues separately; do not overwrite or renumber them.
