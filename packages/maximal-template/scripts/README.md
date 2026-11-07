# Governance automation (Node, no extra packages)

All examples are PowerShell-compatible. **Everything defaults to dry-run or read-only.** The GitHub CLI commands require [GitHub CLI](https://cli.github.com/) and authentication. The package itself never creates issues or changes GitHub.

```powershell
# Structural and cross-reference validation (read-only)
node ./scripts/governance/validate.mjs

# Preview one generated issue body from its JSON record (read-only)
node ./scripts/governance/render-issue.mjs --id M1-P1.1-INIT-T01

# Preview what metadata creation would do (no authentication needed)
node ./scripts/governance/sync-taxonomy.mjs

# Preview a single issue or the full catalog (no writes)
node ./scripts/governance/publish-issues.mjs --id M1-P1.1-INIT-T01
node ./scripts/governance/publish-issues.mjs --all
```

After validating approved JSON content and confirming the target repo is correct, explicit `--apply` creates **only missing** labels/milestones or issues:

```powershell
gh auth login
node ./scripts/governance/sync-taxonomy.mjs --apply
node ./scripts/governance/publish-issues.mjs --id M1-P1.1-INIT-T01 --apply
# Only after approval of all 100 records:
# node ./scripts/governance/publish-issues.mjs --all --apply
```

`gh issue create` accepts `--body-file`; it does **not** need raw JSON. `render-issue.mjs` turns each JSON record into a Markdown issue body corresponding to the bug/feature form fields. The script uses safe shell-free subprocess calls and skips issues whose title already starts with `[SPEC-ID] `. A successful create doesn't automatically write the assigned issue number to the tracked JSON; sync-back and reconciliation should be designed before bulk publishing. Existing GitHub Issues and Project states must not be overwritten. The desired Project number in `.github/project.json` is `null` until configured; built-in automations require a separate GitHub settings step.

**Publishing guard:** `--apply` rejects any batch containing a JSON spec without a completed objective, at least one acceptance criterion, and at least one validation command or manual check. This prevents accidental creation of 100 empty GitHub issues. The deliberately blank source templates are otherwise valid.
