# GenAIScript Test Coverage

This directory contains test coverage for the Loaded Vibes GenAIScript orchestrator and phase scripts per TECH_REQUIREMENTS §10 and SPEC-DEV §3.

## Overview

The test suite covers:

- **Orchestrator flows**: Context hydration, state persistence, execution snapshots
- **Phase script execution**: Five-stage workflow (Analyze → Design → Implement → Validate → Reflect)
- **Mocked environment**: File operations are mocked to avoid real writes
- **Coverage reporting**: Test results are tracked and reported

## Running Tests

### All GenAIScript Tests

```bash
# From repository root
node --test dist/genaiscript/tests/*.test.js
```

### Individual Test Suites

```bash
# Orchestrator tests
node --test dist/genaiscript/tests/orchestrator.test.js

# Phase runner tests
node --test dist/genaiscript/tests/phaseRunner.test.js
```

### Using npm Script

```bash
# From dist/genaiscript directory
cd dist/genaiscript
npm test
```

### Using genaiscript CLI

```bash
# Run with GenAIScript test runner (if configured)
npx genaiscript test
```

## Test Files

| File | Description | References |
|------|-------------|------------|
| `mockEnvironment.js` | Mock utilities for file operations and orchestrator environment | TECH §10 |
| `orchestrator.test.js` | Tests for orchestrator context hydration and state persistence | TECH §4.2, SPEC-ENGINE §4 |
| `phaseRunner.test.js` | Tests for phase script five-stage workflow | TECH §4.3, SPEC-ENGINE §4 |

## Mock Environment

The `mockEnvironment.js` module provides:

### `createMockFileSystem()`

Creates an in-memory file system to avoid real file writes during testing.

```javascript
const fs = createMockFileSystem();
fs.writeFile('/test/file.txt', 'content');
const content = fs.readFile('/test/file.txt');
```

### `createMockOrchestratorEnv()`

Creates a complete mock environment for orchestrator testing.

```javascript
const mockEnv = createMockOrchestratorEnv();
mockEnv.setVars({ phase: 'scaffolding', mode: 'execute' });
const context = mockEnv.getContext();
```

### `createMockManifest()`

Creates a mock DevCycle manifest for testing phase lookups.

```javascript
const manifest = createMockManifest();
const entry = manifest.getEntry('scaffolding');
```

### `createMockPhaseRunner()`

Creates a mock phase runner for testing stage execution.

```javascript
const runner = createMockPhaseRunner('testing');
runner.logNDJSON('analyze', 'analyze-start', 'TECH §4.3', 'info', 'Starting');
```

### `createCoverageReporter()`

Creates a coverage reporter for test result tracking.

```javascript
const reporter = createCoverageReporter();
reporter.recordResult('Suite', 'Test', 'passed');
reporter.printReport();
```

## Coverage Reporting

Tests automatically generate a coverage report showing:

- Total tests executed
- Passed/Failed/Skipped counts
- Pass rate percentage
- Results grouped by test suite

Example output:

```
════════════════════════════════════════════════════════════════
📊 GENAISCRIPT TEST COVERAGE REPORT
════════════════════════════════════════════════════════════════

Total Tests: 42
Passed: 42 ✅
Failed: 0 ❌
Skipped: 0 ⏭️
Pass Rate: 100.00%

Suites:
  Context Hydration: 8/8 passed
    ✅ should load PRD content with memoization
    ✅ should load Tech Requirements content
    ...
```

## Acceptance Criteria

Per Issue #32 acceptance criteria:

- [x] Orchestrator test suite covering context hydration and state persistence
- [x] Phase script test suite covering five-stage workflow
- [x] Mocked environment to avoid real file writes
- [x] Coverage reporting with pass/fail metrics
- [x] Clear failure output with error messages
- [x] Documentation for running tests

## References

- **TECH_REQUIREMENTS §10**: Validation & Traceability
- **SPEC-DEV §3**: Local Testing & Validation
- **SPEC-ENGINE §4**: Phase Runner Template
- **SPEC-OBS §3**: NDJSON Event Logging
- **Issue #32**: [Feature] Implement genaiscript test coverage

## Related Files

- `dist/genaiscript/orchestrator.genai.js` - Orchestrator implementation
- `dist/genaiscript/phases/phase-template.genai.js` - Phase runner template
- `dist/genaiscript/shared/contextLoader.js` - Context loading utilities
- `dist/genaiscript/shared/statePersistence.js` - State persistence utilities
- `dist/genaiscript/shared/idempotency.js` - Idempotency checks
