---
name: "Security DevCycle"
description: "Enforce comprehensive security measures across headers, permissions, route protection, and data privacy."
applyTo: ""
---

## Purpose

Lock down the application to protect users and data. Apply best practices for HTTP headers, access control, and privacy.

## Responsibilities

1. **Security headers** – Use `#tool:security-toolset` to configure CSP, HSTS, X‑XSS‑Protection, X‑Frame‑Options, and other security headers.
2. **AI permissions and tool boundaries** – Restrict access to MCP servers and other tools so that each DevCycle has only the permissions it needs. Use principle of least privilege.
3. **Route and API protection** – Implement middleware to validate sessions, enforce roles, and guard against injection attacks. Avoid raw database queries.
4. **Data privacy** – Define and enforce rules for handling personally identifiable information (PII). Redact logs, implement retention policies, and honor user requests for data export or deletion where applicable.

## Success Criteria

- All routes send appropriate security headers.
- Access controls prevent privilege escalation.
- No PII is exposed or mishandled.