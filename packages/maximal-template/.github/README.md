# .github

| File                         | Read by         | Purpose                                                        |
| ---------------------------- | --------------- | -------------------------------------------------------------- |
| `ISSUE_TEMPLATE/feature.yml` | GitHub          | Form for a spec or sub-issue the scripts did not create        |
| `ISSUE_TEMPLATE/bug.yml`     | GitHub          | Defect form; defects are sub-issues of `ENG-M2-P2.2-DEBUG-T01` |
| `ISSUE_TEMPLATE/config.yml`  | GitHub          | Disables blank issues                                          |
| `pull_request_template.md`   | GitHub          | One spec per PR, with evidence and governance checklist        |
| `workflows/ci.yml`           | GitHub Actions  | Lean PR check: format, lint, type check, governance, build     |
| `dependabot.yml`             | Dependabot      | Weekly npm and Actions updates                                 |
| `release.yml`                | GitHub Releases | Release-note categories by label                               |
| `CODEOWNERS`                 | GitHub          | Review owners (set before enabling)                            |
| `labels.json`                | `scripts/`      | Labels: type, phase, dev cycle, cadence, status                |
| `milestones.json`            | `scripts/`      | The three milestones                                           |
| `project.json`               | `scripts/`      | Project title, recorded project number, default workflows      |
| `dependabot.json`            | humans          | Notes on the Dependabot setup                                  |

`labels.json`, `milestones.json` and `project.json` are not read by GitHub; `pnpm governance:taxonomy`, `governance:project` and `governance:publish` apply them. See [`scripts/README.md`](../scripts/README.md).
