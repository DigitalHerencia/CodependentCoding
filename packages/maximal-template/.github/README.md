# GitHub integration

Native GitHub files: `ISSUE_TEMPLATE/{bug,feature,config}.yml`, `pull_request_template.md`, `workflows/ci.yml`, `dependabot.yml`, `CODEOWNERS`, `release.yml`.

Custom metadata (not parsed natively by GitHub): `labels.json`, `milestones.json`, `project.json`, `dependabot.json`. The scripts in `scripts/governance/` read these files. The desired GitHub Projects v2 workflow is documented in `project.json` but its built-in workflow options must be configured and verified in GitHub itself.

For a spec, use its `github.title`, `github.labels`, and `github.milestone`. Render issue-body Markdown with `scripts/governance/render-issue.mjs`; `gh issue create` accepts `--body-file` and does **not** require JSON input. Issue forms are for manual entry and have aligned fields.

Existing `.github/labels.yml` or sync scripts may already be active: reconcile the catalogs before enabling a new sync path. Do not overwrite or duplicate issue labels silently.
