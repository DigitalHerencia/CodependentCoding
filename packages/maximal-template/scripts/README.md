# scripts

Governance tooling: plain Node.js ES modules with no dependencies, so they run anywhere Node 24 runs (Windows, macOS, CI). Every command is a dry run unless `--apply` is passed.

| Command                                            | Script               | Does                                                                                                      |
| -------------------------------------------------- | -------------------- | --------------------------------------------------------------------------------------------------------- |
| `pnpm governance:validate`                         | `validate.mjs`       | Read-only. Checks the spec tree, doc ↔ spec feeds, contract sources, labels and milestones                |
| `pnpm governance:render -- --id <spec>`            | `render-issue.mjs`   | Prints the issue body for one spec                                                                        |
| `pnpm governance:taxonomy`                         | `sync-taxonomy.mjs`  | Creates missing labels and milestones                                                                     |
| `pnpm governance:project`                          | `create-project.mjs` | Creates the Projects v2 board, links it to the repo, records its number                                   |
| `pnpm governance:publish -- --id <spec>` / `--all` | `publish-issues.mjs` | Creates missing issues and sub-issues, adds them to the board, writes issue numbers back to the spec JSON |

`common.mjs` holds shared helpers (paths, the catalog walk, the `gh` wrapper, repo detection).

## First run in a new repo

```powershell
gh auth login
gh auth refresh -s project
pnpm governance:validate
pnpm governance:taxonomy -- --apply
pnpm governance:project -- --apply
pnpm governance:publish -- --id ENG-M1-P1.1-INIT-T01 --apply   # check one, then --all
```

Then turn on the Project's **Auto-add to project** workflow (filter `is:issue label:tracked`); GitHub offers no API for it.

Safety: the repo comes from `gh repo view`, never from a file; existing issues (matched by their `[ID] ` title prefix) are skipped; `--apply` refuses specs without an objective, acceptance criteria and validation.
