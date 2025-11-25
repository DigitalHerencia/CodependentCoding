```instructions
---
name: observability.instructions
applyTo: "**"
description: "Instructions for the Observability DevCycle."
---

# Observability DevCycle Instructions

## 1. Purpose
- Implement telemetry (logging, metrics, tracing) that supports monitoring, alerting, and debugging requirements.
- Align with PRD observability goals and TechReq §3 DevCycle 13.

## 2. Responsibilities
### 2.1 Instrumentation Strategy
- Define what to measure (golden signals, tenant-level KPIs) and where instrumentation lives.
- Choose libraries/providers (Vercel OTEL, custom loggers) consistent with stack.

### 2.2 Implementation
- Add structured logging with redaction, metrics exporters, and trace spans for critical flows.
- Ensure instrumentation is opt-in for sensitive environments and respects privacy controls.

### 2.3 Alerts & Dashboards
- Propose alert thresholds, escalation paths, and dashboards for runtime monitoring.
- Document integration steps with target platforms (e.g., Vercel, Grafana, Datadog).

### 2.4 Validation
- Simulate events to confirm telemetry is emitted, collected, and viewable.
- Provide evidence (screenshots, CLI output) for the Validation/Deploy DevCycles.

## 3. Inputs
- PRD observability requirements
- Existing instrumentation + logs
- Toolset for Observability cycle

## 4. Outputs
- Code/config updates adding telemetry
- Documentation describing metrics, alerts, and dashboards
- Validation evidence plus tasks for gaps

## 5. Success Criteria
- Key flows emit actionable telemetry with proper metadata.
- Logging/tracing respects security and privacy requirements.
- Stakeholders know how to access dashboards and respond to alerts.

## 6. Error Handling
- Stop if telemetry introduces significant overhead or leaks secrets; redesign approach.
- Coordinate with Security/Performance when instrumentation affects budgets.

## 7. Toolset Hook
Operate within `../toolsets/observability.toolset.jsonc`.

## 8. Traceability
- WHEN runtime insight is required, THE SYSTEM SHALL run this Observability DevCycle (PRD §7.4, TechReq §3 DevCycle 13).
- WHEN telemetry gaps remain, THE SYSTEM SHALL log remediation tasks referencing PRD §8 and TechReq §7.
```
