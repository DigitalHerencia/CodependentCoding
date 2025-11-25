# Security Policy

Loaded Vibes enforces strict separation between development assets, shipped artifacts, and runtime code. Follow these guidelines when reporting vulnerabilities:

## Supported Versions

The framework is distributed through tagged releases under `lv_artifacts/**` and the `create-loaded-vibes` CLI. We currently support the latest major release and the immediately preceding release.

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

## Scope

- Workspace automation (`.github`, `.vscode`, `docs`, `templates`).
- Shipped assets (`lv_artifacts/**`, `.loaded-vibes/**`).
- Retro CLI commands and GenAIScript orchestrator scripts.

Out-of-scope: third-party dependencies outside our control (report upstream), and user-generated application code under `lv_artifacts/src/**`.

Thank you for helping keep Loaded Vibes secure.
