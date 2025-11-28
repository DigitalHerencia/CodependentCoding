# Spec-Driven Workflow

> The methodology behind Loaded Vibes: bridging requirements and implementation.

---

## Philosophy

Loaded Vibes is built on a simple premise:

> **If you can't trace a line of code back to a requirement, you're writing vibes, not software.**

The Spec-Driven Workflow ensures every artifact — from prompts to production code — is:

- **Traceable** — Links back to PRD and Tech Requirements
- **Verifiable** — Has clear acceptance criteria
- **Documented** — Updates TODO.md and CHANGELOG.md
- **Auditable** — Logged with requirement IDs

---

## The Core Artifacts

Spec-Driven Workflow revolves around these living documents:

| Artifact                 | Purpose                              | Updated By          |
| ------------------------ | ------------------------------------ | ------------------- |
| **PRD.md**               | User stories and acceptance criteria | Product/Maintainers |
| **TECH_REQUIREMENTS.md** | Technical architecture and specs     | Engineering         |
| **TODO.md**              | Running implementation task list     | DevCycles + You     |
| **CHANGELOG.md**         | Version history and changes          | DevCycles           |

These aren't write-once documents. They're living artifacts that evolve with your project.

---

## EARS Notation

Requirements are written in **EARS** (Easy Approach to Requirements Syntax):

### Patterns

| Pattern          | Template                                        | Use Case                 |
| ---------------- | ----------------------------------------------- | ------------------------ |
| **Ubiquitous**   | THE SYSTEM SHALL [behavior]                     | Always-true requirements |
| **Event-Driven** | WHEN [trigger] THE SYSTEM SHALL [behavior]      | Triggered behavior       |
| **State-Driven** | WHILE [state] THE SYSTEM SHALL [behavior]       | Conditional behavior     |
| **Unwanted**     | IF [condition] THEN THE SYSTEM SHALL [response] | Error handling           |
| **Optional**     | WHERE [feature] THE SYSTEM SHALL [behavior]     | Feature flags            |

### Examples

```markdown
# Ubiquitous

THE SYSTEM SHALL validate all user inputs before processing.

# Event-Driven

WHEN a user submits a form, THE SYSTEM SHALL display a loading indicator.

# State-Driven

WHILE the user is unauthenticated, THE SYSTEM SHALL redirect to /login.

# Unwanted

IF the database connection fails, THEN THE SYSTEM SHALL retry 3 times with exponential backoff.

# Optional

WHERE premium features are enabled, THE SYSTEM SHALL show advanced analytics.
```

### Quality Criteria

Every EARS requirement must be:

- **Testable** — Can be verified
- **Unambiguous** — Single interpretation
- **Necessary** — Contributes to purpose
- **Feasible** — Can be implemented
- **Traceable** — Links to PRD

---

## The Execution Loop

Spec-Driven Workflow follows a 6-phase loop for every task:

```
     ┌────────────────────────────────────────────────────────────────┐
     │                                                                │
     ▼                                                                │
┌─────────┐   ┌─────────┐   ┌───────────┐   ┌──────────┐   ┌─────────┤   ┌─────────┐
│ ANALYZE │ → │ DESIGN  │ → │ IMPLEMENT │ → │ VALIDATE │ → │ REFLECT │ → │ HANDOFF │
└─────────┘   └─────────┘   └───────────┘   └──────────┘   └─────────┘   └─────────┘
     │                                                                        │
     │◀───────────────────── (if issues found) ◀──────────────────────────────│
     │
     ▼
   START
```

### Phase Details

#### 1. ANALYZE

**Objective:** Understand the problem completely before acting.

**Checklist:**

- [ ] Read all provided documentation
- [ ] Define requirements in EARS notation
- [ ] Identify dependencies and constraints
- [ ] Map data flows
- [ ] Catalog edge cases
- [ ] Assess confidence (0-100%)

**Critical Rule:** Do not proceed until all requirements are clear.

#### 2. DESIGN

**Objective:** Create a comprehensive plan.

**Adaptive Strategy Based on Confidence:**

| Confidence          | Strategy                         |
| ------------------- | -------------------------------- |
| **>85% (High)**     | Full implementation, skip PoC    |
| **66-85% (Medium)** | Build PoC/MVP first, then expand |
| **<66% (Low)**      | Research phase first, re-analyze |

**Checklist:**

- [ ] Document architecture
- [ ] Define data models
- [ ] Create error handling matrix
- [ ] Define testing strategy
- [ ] Order tasks by dependency

**Critical Rule:** Do not implement until design is validated.

#### 3. IMPLEMENT

**Objective:** Write production-quality code.

**Checklist:**

- [ ] Code in small, testable increments
- [ ] Implement from dependencies upward
- [ ] Follow conventions
- [ ] Add meaningful comments
- [ ] Update task status in real-time

**Critical Rule:** Do not merge until all steps are documented.

#### 4. VALIDATE

**Objective:** Verify implementation meets requirements.

**Checklist:**

- [ ] Execute automated tests
- [ ] Perform manual verification
- [ ] Test edge cases
- [ ] Verify performance
- [ ] Log execution traces

**Critical Rule:** Do not proceed until all issues are resolved.

#### 5. REFLECT

**Objective:** Improve and document.

**Checklist:**

- [ ] Refactor for maintainability
- [ ] Update all documentation
- [ ] Identify improvements
- [ ] Validate success criteria
- [ ] Create technical debt issues

**Critical Rule:** Do not close until all actions are logged.

#### 6. HANDOFF

**Objective:** Package for review.

**Checklist:**

- [ ] Generate executive summary
- [ ] Prepare pull request
- [ ] Finalize workspace
- [ ] Update TODO.md and CHANGELOG.md
- [ ] Transition to next task

**Critical Rule:** Do not consider complete until documented.

---

## Documentation Templates

### Action Documentation

Use this template for every action:

```markdown
### [TYPE] - [ACTION] - [TIMESTAMP]

**Objective**: What are we trying to accomplish?
**Context**: Current state and requirements
**Decision**: Approach chosen and rationale
**Execution**: Steps taken with commands/code
**Output**: Results, logs, metrics
**Validation**: How we verified success
**Next**: What happens next
```

### Decision Record

For significant decisions:

```markdown
### Decision - [TIMESTAMP]

**Decision**: What was decided
**Context**: Why this decision was needed
**Options**: Alternatives considered
**Rationale**: Why this option is best
**Impact**: Consequences for the project
**Review**: When to revisit this decision
```

### Streamlined Action Log

For changelogs and summaries:

```
[TYPE][TIMESTAMP] Goal: X → Action: Y → Result: Z → Next: W
```

---

## Requirement Traceability

Every artifact must trace back to requirements:

```
PRD Requirement (PRD §5.1)
    │
    ├── TECH_REQUIREMENTS clause (TECH §4.2)
    │
    ├── DevCycle instruction (features.instructions.md)
    │       │
    │       ├── Implementation (src/components/Dashboard.tsx)
    │       │
    │       └── Test (src/__tests__/Dashboard.test.tsx)
    │
    ├── TODO.md item
    │
    └── CHANGELOG.md entry
```

### Citing Requirements

In code comments:

```typescript
/**
 * User dashboard component
 * @requirement PRD-5.1 User can view their stats
 * @see TECH-4.2 Dashboard data fetching
 */
export function Dashboard() { ... }
```

In DevCycle logs:

```json
{
  "event": "implement",
  "requirementId": "PRD-5.1",
  "techRef": "TECH-4.2",
  "artifact": "src/components/Dashboard.tsx"
}
```

In TODO.md:

```markdown
- [ ] Implement Dashboard [PRD-5.1] [TECH-4.2]
```

---

## Technical Debt Management

### Identification

Technical debt is automatically tracked when:

- Shortcuts are taken (documented in Decision Records)
- Code quality drops below threshold
- Documentation is incomplete
- Tests are skipped

### Issue Template

```markdown
**Title**: [Technical Debt] - Brief Description
**Priority**: High/Medium/Low
**Location**: File paths and lines
**Reason**: Why debt was incurred (link Decision Record)
**Impact**: Current and future consequences
**Remediation**: Resolution steps
**Effort**: S/M/L estimate
```

### Remediation Priority

| Priority   | Criteria                          |
| ---------- | --------------------------------- |
| **High**   | Blocks features, security risk    |
| **Medium** | Slows development, increases bugs |
| **Low**    | Cosmetic, non-blocking            |

---

## Quality Gates

### Automated Checks

- **Static Analysis** — Linting, type checking
- **Test Coverage** — Minimum 80%
- **Documentation** — Public APIs documented
- **Complexity** — Cyclomatic complexity < 10

### Quality Metrics

| Metric                 | Target            |
| ---------------------- | ----------------- |
| Code coverage          | ≥ 80%             |
| Cyclomatic complexity  | ≤ 10 per function |
| Documentation coverage | 100% public APIs  |
| Technical debt ratio   | ≤ 5%              |

---

## Troubleshooting & Retry

When you encounter blockers:

```
┌───────────┐
│ BLOCKED   │
└─────┬─────┘
      │
      ▼
┌───────────────┐     ┌───────────────┐
│ Re-ANALYZE    │ ──▶ │ Clarify reqs  │
└───────────────┘     └───────────────┘
      │
      ▼
┌───────────────┐     ┌───────────────┐
│ Re-DESIGN     │ ──▶ │ Update plan   │
└───────────────┘     └───────────────┘
      │
      ▼
┌───────────────┐     ┌───────────────┐
│ RETRY         │ ──▶ │ Execute again │
└───────────────┘     └───────────────┘
      │
      ▼ (still blocked?)
┌───────────────┐
│ ESCALATE      │ ──▶ Document + seek help
└───────────────┘
```

**Critical Rule:** Never proceed with unresolved blockers. Always document.

---

## Integration with DevCycles

Each DevCycle automatically follows the Spec-Driven Workflow:

1. **Prompt** triggers ANALYZE phase
2. **Orchestrator** executes all 6 phases
3. **Instruction** provides domain rules
4. **Toolset** constrains available operations
5. **Outputs** update TODO.md and CHANGELOG.md

---

## Best Practices

### 1. Write Requirements First

Before any code, write EARS requirements:

```markdown
WHEN the user clicks "Submit",
THE SYSTEM SHALL validate all form fields
AND display inline errors for invalid inputs.
```

### 2. Design Before Implementing

Spend time in DESIGN phase proportional to complexity:

| Complexity | Design Time   |
| ---------- | ------------- |
| Simple     | 5-10 minutes  |
| Medium     | 30-60 minutes |
| Complex    | 2-4 hours     |

### 3. Document Decisions

Every significant decision gets a Decision Record:

- Architecture choices
- Technology selections
- Trade-offs made
- Shortcuts taken

### 4. Update Artifacts Immediately

Don't batch documentation updates:

- Update TODO.md as tasks complete
- Update CHANGELOG.md per feature
- Update Decision Records when decisions change

### 5. Trace Everything

Every line of code should trace to a requirement:

```
Requirement → Design → Code → Test → Documentation
```

---

## Next Steps

- **[Artifacts](./artifacts.md)** — Prompts, instructions, toolsets
- **[DevCycles](./devcycles.md)** — The 18 development phases
- **[Customization](../guides/customization.md)** — Tailoring the workflow

---

> "The best time to document was yesterday. The second best time is right now, before you forget what you did."
