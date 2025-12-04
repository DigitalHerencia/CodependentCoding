```instructions
---
name: performance.instructions
applyTo: "**"
description: "Instructions for the Performance DevCycle."
---

# Performance DevCycle Instructions

## 1. Purpose
- Audit and optimize application performance, including bundle size, server response times, database queries, and dependency health.
- Ensure the experience meets PRD performance promises and TechReq §6 guidelines.

## 2. Responsibilities
### 2.1 Measurement
- Capture baseline metrics (Core Web Vitals, API latency, database query timing, memory usage) using profiling tools available in the toolset.
- Record scenarios, datasets, and environment info for repeatability.

### 2.2 Optimization
- Address bottlenecks: code splitting, caching, query batching, background processing, etc.
- Minimize bundle size via dependency pruning, lazy loading, and compression settings.

### 2.3 Database & API Efficiency
- Review Prisma queries for N+1 issues, add indexes, adjust pagination, and enforce connection pooling best practices.
- Evaluate external API usage for throttling/backoff compliance.

### 2.4 Regression Protection
- Update alerts, dashboards, or automated tests to detect performance regressions.
- Document budgets and guardrails for future DevCycles.

## 3. Inputs
- Observability metrics/logs
- Current implementation + dependencies
- Toolset for Performance cycle (profilers, benchmarking scripts)

## 4. Outputs
- Performance report with before/after metrics
- Code/config updates implementing optimizations
- Updated budgets or alerts; tasks for remaining risks

## 5. Success Criteria
- Key metrics meet or beat targets defined in PRD/Tech Requirements.
- Changes are validated via repeatable benchmarks and tests.
- Human reviewer accepts trade-offs or approves residual risks.

## 6. Error Handling
- If tooling cannot profile (e.g., missing data), coordinate with Observability/Deploy to provision environments.
- Roll back optimizations that regress correctness or security.

## 7. Toolset Hook
Use only the tools described in `../toolsets/performance.toolset.jsonc`.

## 8. Traceability
- WHEN performance budgets must be validated, THE SYSTEM SHALL execute this Performance DevCycle (PRD §7.4, TechReq §3 DevCycle 12).
- WHEN optimizations change behavior, THE SYSTEM SHALL document outcomes referencing PRD §8 and TechReq §7.
```
