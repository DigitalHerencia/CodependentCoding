# Support Policy

Loaded Vibes framework maintainers provide support for the authoring workspace and the shipped `lv_artifacts` payload under the Spec-Driven Workflow contract.

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

## Self-Serve Resources

- `docs/PRD.md` and `docs/TECH_REQUIREMENTS.md` for canonical requirements.
- `README.md` for directory ownership guidance.
- Retro CLI `loaded-vibes doctor` command for diagnostics.
- `.genaiscript/instructions/llms-full.txt` plus `.github/instructions/genaiscript.instructions.md` for scripting questions.

Please reference this document whenever raising or triaging support requests to keep responses predictable and auditable.
