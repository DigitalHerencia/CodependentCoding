# Support Policy

Loaded Vibes framework maintainers provide support for the authoring workspace and the shipped `dist` payload under the Spec-Driven Workflow contract.

## Primary Channels

- **Issues:** Open a GitHub issue using the template in `.github/ISSUE_TEMPLATE.md` for bugs, feature requests, or documentation gaps.
- **Security Reports:** Follow `SECURITY.md` for responsible disclosure instructions before filing a public ticket.
- **Discussions:** For questions about DevCycles or automation, start a GitHub Discussion or contact the `@LoadedVibes/framework-maintainers` team.

## What to Include

1. Workspace path (`D:/LoadedVibes`) and whether the issue occurs in the dev workspace or a `.loaded-vibes/` consumer tree.
2. DevCycle name, prompt, or CLI command executed.
3. Relevant logs from `.loaded-vibes/logs/*.ndjson` or the VS Code GenAIScript output channel.
4. References to the governing requirement in `docs/PRD.md` or `docs/TECH_REQUIREMENTS.md`.

## Response Targets

| Severity | Example                                         | Target Response     |
| -------- | ----------------------------------------------- | ------------------- |
| Critical | Security regression, data loss, blocked release | < 24 hours          |
| High     | Broken DevCycle, CLI failure, automation drift  | < 2 business days   |
| Normal   | Documentation gaps, minor tooling issues        | < 5 business days   |
| Low      | Questions, enhancement ideas                    | As bandwidth allows |

## Troubleshooting Workflow (PRD §5.4, TECH §5.3)

1. Run `loaded-vibes doctor --auto-remediate` to collect environment diagnostics and apply supported fixes.
2. Capture the latest NDJSON evidence with `loaded-vibes logs --devcycle <name> --since <iso>` and, if applicable, export Markdown snapshots for attachments.
3. Use `loaded-vibes telemetry export --format json` when CI or compliance teams need machine-readable traces.
4. Verify DevCycle manifest alignment via `loaded-vibes devcycle <name> --dry-run --verbose` to ensure instructions and toolsets match the canonical manifest.
5. Reproduce the issue in `loaded-vibes dashboard` to confirm whether it is systemic (queue stalled, Bad Vibes Firewall approval pending) before filing.

## Escalation & Approvals

- **Security-sensitive findings** must follow `SECURITY.md` and remain private until the security team acknowledges receipt.
- **Bad Vibes Firewall approvals** should be included when destructive operations are blocked; attach `.loaded-vibes/genaiscript/state/firewall-approvals.json` excerpts if safe.
- **DevCycle governance incidents** (missing TODO/CHANGELOG entries, manifest drift) should reference the PRD/Tech clauses impacted so maintainers can route the issue to the right DevCycle owner.

## Data Handling Requirements (SPEC-SECURITY §2, SPEC-OBS §3)

- Sanitize NDJSON attachments by letting the built-in redaction pipeline run; never share raw secrets or customer data.
- Pin the workspace path (`D:/LoadedVibes` vs `.loaded-vibes/`) in every report so responders know whether the problem affects the authoring or shipped environment.
- Encrypt any archives that include state snapshots, telemetry exports, or TODO/CHANGELOG fragments prior to emailing the maintainer alias.

## Self-Serve Resources

- `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` for canonical requirements.
- `README.md` for directory ownership guidance.
- Retro CLI `loaded-vibes doctor` command for diagnostics.
- `.genaiscript/instructions/llms-full.txt` plus `.github/instructions/genaiscript.instructions.md` for scripting questions.

Please reference this document whenever raising or triaging support requests to keep responses predictable and auditable.
