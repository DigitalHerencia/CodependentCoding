# Specs

The standard build process: 3 milestones → 9 phases → 20 dev cycles → 100 specs (5 per dev cycle). Each spec is one GitHub issue.

- [`catalog.json`](catalog.json): the full tree, in build order.
- `M#/P#.#/<CYCLE>/<spec-id>.json`: one file per spec, validated by [`schema.json`](schema.json).

## IDs

`ENG-M2-P2.1-MVP-T03` = team · milestone · phase · dev cycle · spec. The ID is the stable trace key; titles are labels and can change without breaking links. Filenames and the `id` field omit the `ENG-` prefix; `work_code` and issue titles carry it. Issue title format: `[ENG-…] <dev cycle> – <spec title>`.

## Cadence

| Cadence      | Meaning                                                      | Sub-issues        |
| ------------ | ------------------------------------------------------------ | ----------------- |
| `once`       | Done one time per project                                    | No                |
| `repeatable` | Runs again whenever needed (debugging, reviews, updates)     | Yes, one per run  |
| `expandable` | Covers a list of items (for example one per product feature) | Yes, one per item |
| `gate`       | Sign-off for its dev cycle; needs owner approval             | No                |

Sub-issue IDs extend the parent: `ENG-M2-P2.1-FEATURES-T01.3`. They are recorded in the parent's `sub_issues` and created as GitHub sub-issues.

## What each spec holds

`objective` and `acceptance_criteria` are pre-written so no step of a professional build is skipped. `documentation` lists the doc sections that feed the spec (see [`../docs/`](../docs/README.md)). Before publishing, fill `scope`, `requirements` and `deliverables` from those sections; the publish script refuses specs without an objective, acceptance criteria and validation.

Do not renumber or delete specs. If a spec does not apply, keep it and close its issue as not planned with the reason recorded in `.agents/execution/decisions.json`.
