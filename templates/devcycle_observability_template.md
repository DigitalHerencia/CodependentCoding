---
name: observability.instructions
applyTo: "**"
description: Instructions for the Observability DevCycle.
---

# Observability DevCycle Instructions

The **Observability** DevCycle defines how the system is monitored, logged, traced, and measured in real-world execution. This phase is stack-agnostic at the instruction level.

## 1. Purpose
- Ensure the system is fully observable during runtime.
- Provide monitoring, logging, tracing, and alerting capabilities.
- Align observability design with PRD + TechReq.

## 2. Responsibilities
### 2.1 Define Logging Strategy
The agent MUST:
- Identify what events should be logged.
- Define required metadata for logs.
- Define severity/level structure (info, warn, error, etc.).
- Ensure logs avoid PII exposure.

### 2.2 Define Metrics Strategy
The agent MUST specify:
- Key performance indicators (KPIs).
- Business-critical metrics.
- Operational metrics.
- Error rate metrics.

### 2.3 Define Tracing Strategy
- Establish basic request tracing.
- Identify multi-step workflows requiring trace spans.
- Map high-level architecture to traceable segments.

### 2.4 Define Alerts
The agent MUST:
- Identify critical failure conditions.
- Define alert triggers.
- Specify severity tiers.

### 2.5 Ensure Compliance with PRD + TechReq
The agent MUST:
- Validate observability requirements exist in specs.
- Surface missing monitoring or reporting expectations.

## 3. Inputs
- PRD
- TechReq
- Performance DevCycle outputs
- Toolset for Observability phase

## 4. Outputs
- Logging specification
- Metrics specification
- Tracing specification
- Alerts specification
- Tasks added to `todo.md`
- Changelog entry summarizing observability decisions

## 5. Success Criteria
Observability DevCycle is complete when:
- Logging rules are fully defined
- Metrics are mapped to system behaviors
- Tracing is logically planned
- Alert conditions cover critical scenarios
- Human approves the observability specification

## 6. Error Handling
The agent MUST:
- Halt if observability is insufficient to detect critical failures
- Detect missing or contradictory metrics
- Identify unclear workflow traces
- Provide corrective recommendations

These instructions define the complete behavior of the Observability DevCycle.

