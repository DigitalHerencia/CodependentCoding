---
name: "Observability DevCycle"
description: "Integrate telemetry and monitoring to make the system observable."
applyTo: ""
---

## Purpose

Provide visibility into application behavior in production and staging environments. Collect metrics, logs, and traces that allow developers to diagnose issues and monitor health.

## Responsibilities

1. **Integrate telemetry** – Use `#tool:observability-toolset` to set up Vercel OpenTelemetry or equivalent tracing libraries. Instrument server actions, API routes, and database queries.
2. **Structured logging** – Implement structured logs with appropriate levels (info, warning, error) and context. Ensure no sensitive data is logged.
3. **Alerts and dashboards** – Define alert rules and build dashboards that surface key metrics. Align these with PRD expectations for monitoring and reporting.

## Success Criteria

- Telemetry data is collected and viewable in the monitoring platform.
- Logs are structured and free of sensitive information.
- Alerts trigger appropriately on thresholds defined by the PRD.