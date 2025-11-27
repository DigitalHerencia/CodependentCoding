# Security Policy

Loaded Vibes enforces strict separation between development assets, shipped artifacts, and runtime code. Follow these guidelines when reporting vulnerabilities:

## Supported Versions

The framework is distributed through tagged releases under `dist/**` and the `create-loaded-vibes` CLI. We currently support the latest major release and the immediately preceding release.

## Reporting a Vulnerability

1. Email `security@loadedvibes.dev` (placeholder) or contact `@LoadedVibes/security-team` on GitHub with the following:
   - A detailed description of the vulnerability and the affected DevCycle/CLI command.
   - Steps to reproduce, including logs or sanitized `.loaded-vibes/logs/*.ndjson` excerpts.
   - Impact assessment (data exposure, privilege escalation, etc.).
2. Do **not** open a public issue until maintainers confirm the fix or provide disclosure instructions.
3. Encrypt sensitive details if possible; we can provide a PGP key on request.

## Response Process

- Acknowledge receipt within 24 hours.
- Provide initial assessment within 3 business days.
- Share remediation plan and target release window; critical issues may trigger out-of-band releases.

## Coordinated Disclosure Expectations (SPEC-SECURITY §2)

- Include the DevCycle name and requirement citation (PRD/Tech clause) so we can trace the vulnerability through manifests and instructions.
- Provide Bad Vibes Firewall approval IDs or SHA256 verification output when the issue involves destructive actions or release packaging.
- If the exploit touches shipped assets, share the affected release tag and checksum so we can revoke artifacts in the `create-loaded-vibes` CDN.

## Scope

- Workspace automation (`.github`, `.vscode`, `docs`, `templates`).
- Shipped assets (`dist/**`, `.loaded-vibes/**`).
- Retro CLI commands and GenAIScript orchestrator scripts.

Out-of-scope: third-party dependencies outside our control (report upstream), and user-generated application code under `dist/src/**`.

## Defense-in-Depth Controls (PRD §5.5, TECH §5.4)

- **SHA256 verification:** Every release download runs through `dist/cli/security/shaVerifier.js`; include its logs when reporting tampering or supply-chain issues.
- **Bad Vibes Firewall:** Destructive file operations require explicit approvals that are logged to `.loaded-vibes/genaiscript/state/firewall-approvals.json`; compromise attempts should include these records.
- **File guard boundaries:** CLI writes are confined to `.loaded-vibes/**` unless the operator approves template copies. Report any bypass that writes outside this directory.
- **Secret redaction:** NDJSON logs and telemetry exports automatically redact known secret patterns; notify us if sensitive values appear in exported data.

## Evidence Package Checklist

Before submitting a report, gather:

1. `loaded-vibes doctor --json` output showing environment state.
2. Relevant NDJSON snippets (redacted) plus timestamps.
3. Version numbers (`dist/VERSION`, CLI `--version`, npm package version).
4. Steps already taken (firewall approvals, retries, mitigations).

Thank you for helping keep Loaded Vibes secure.
