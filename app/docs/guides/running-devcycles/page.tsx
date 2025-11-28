import { DocPage, CodeBlock, Callout } from '../../components';

export const metadata = {
  title: 'Running DevCycles - Loaded Vibes',
  description: 'Practical guide to executing DevCycles effectively.',
};

export default function RunningDevcyclesPage() {
  return (
    <DocPage
      title="Running DevCycles"
      description="From invocation to handoff. A practical guide to making DevCycles work for you."
      breadcrumbs={[
        { label: 'Guides', href: '/docs/guides/running-devcycles' },
        { label: 'Running DevCycles', href: '/docs/guides/running-devcycles' },
      ]}
      prevPage={{ label: 'Configuration', href: '/docs/reference/configuration' }}
      nextPage={{ label: 'Customization', href: '/docs/guides/customization' }}
    >
      <h2>Basic Execution</h2>
      <p>
        The simplest way to run a DevCycle is with the <code>run</code> command:
      </p>

      <CodeBlock language="bash">
        {`# Run a single DevCycle
lv devcycle run scaffold

# Run with feature context
lv devcycle run scaffold --feature user-authentication

# Preview actions without executing
lv devcycle run scaffold --dry-run`}
      </CodeBlock>

      <h2>Execution Modes</h2>

      <h3>Interactive Mode</h3>
      <p>The wizard walks you through each phase with confirmations:</p>
      <CodeBlock language="bash">
        {`lv devcycle run scaffold --wizard

# Output:
# ┌─────────────────────────────────────┐
# │ 🏗️  Scaffold DevCycle                │
# ├─────────────────────────────────────┤
# │ Feature: user-authentication        │
# │ Phase: Analyze                       │
# ├─────────────────────────────────────┤
# │ Ready to analyze requirements?       │
# │ [Y]es  [N]o  [S]kip                  │
# └─────────────────────────────────────┘`}
      </CodeBlock>

      <h3>Headless Mode</h3>
      <p>For CI/CD pipelines, run without prompts:</p>
      <CodeBlock language="bash">
        {`# Non-interactive execution
lv devcycle run scaffold --no-interactive

# With automatic approval for checkpoints
lv devcycle run scaffold --auto-approve

# Fail on any warning (strict mode)
lv devcycle run scaffold --strict`}
      </CodeBlock>

      <h3>Watch Mode</h3>
      <p>Monitor progress in real-time with the dashboard:</p>
      <CodeBlock language="bash">
        {`# Run with dashboard
lv devcycle run scaffold &
lv dashboard --watch

# Or in one command
lv devcycle run scaffold --dashboard`}
      </CodeBlock>

      <h2>Chaining DevCycles</h2>
      <p>Run multiple DevCycles in sequence:</p>

      <CodeBlock language="bash">
        {`# Chain multiple cycles
lv devcycle run init scaffold test

# With shared context
lv devcycle run scaffold test validate --feature auth

# Stop on first failure
lv devcycle run scaffold test deploy --bail`}
      </CodeBlock>

      <Callout type="info" title="Dependency resolution">
        DevCycles automatically check prerequisites. Running <code>deploy</code>
        without <code>validate</code> will prompt you to run validation first.
      </Callout>

      <h2>Phase Control</h2>
      <p>You can control which phases execute within a DevCycle:</p>

      <CodeBlock language="bash">
        {`# Run specific phases only
lv devcycle run scaffold --phases analyze,design

# Skip specific phases
lv devcycle run scaffold --skip-phases reflect

# Start from a specific phase
lv devcycle run scaffold --from-phase implement

# Stop at a specific phase
lv devcycle run scaffold --to-phase validate`}
      </CodeBlock>

      <h2>Checkpoints</h2>

      <h3>Understanding Checkpoints</h3>
      <p>Checkpoints are snapshots taken at phase boundaries. They include:</p>
      <ul>
        <li>File state (modified, created, deleted files)</li>
        <li>Git state (branch, commit, staged changes)</li>
        <li>Execution logs and metrics</li>
        <li>Environment configuration</li>
      </ul>

      <h3>Managing Checkpoints</h3>
      <CodeBlock language="bash">
        {`# List all checkpoints
lv devcycle checkpoints

# Output:
# ID                              CYCLE     PHASE     DATE
# scaffold-analyze-2024-01-15     scaffold  analyze   2024-01-15 10:00
# scaffold-design-2024-01-15      scaffold  design    2024-01-15 10:30
# scaffold-implement-2024-01-15   scaffold  implement 2024-01-15 11:00

# View checkpoint details
lv devcycle checkpoints show scaffold-design-2024-01-15

# Restore to checkpoint
lv devcycle checkpoints restore scaffold-design-2024-01-15`}
      </CodeBlock>

      <h3>Recovery Workflow</h3>
      <CodeBlock language="bash">
        {`# If something goes wrong during implementation
lv devcycle checkpoints restore scaffold-design-2024-01-15

# Resume from where you left off
lv devcycle resume

# Or restart the cycle with different options
lv devcycle run scaffold --from-phase implement`}
      </CodeBlock>

      <h2>Monitoring Execution</h2>

      <h3>Dashboard</h3>
      <p>The terminal dashboard provides real-time visibility:</p>
      <CodeBlock language="bash">
        {`lv dashboard

# Features:
# - Current cycle and phase
# - Progress bars
# - Live log output
# - Resource usage
# - Error highlights`}
      </CodeBlock>

      <h3>Logs</h3>
      <CodeBlock language="bash">
        {`# Follow logs in real-time
lv logs --follow

# Filter by cycle
lv logs --cycle scaffold --since 1h

# Show only errors
lv logs --level error

# Export for analysis
lv logs --format json > execution-logs.json`}
      </CodeBlock>

      <h2>CI/CD Integration</h2>

      <h3>GitHub Actions Example</h3>
      <CodeBlock title=".github/workflows/devcycle.yml" language="yaml">
        {`name: DevCycle Validation

on:
  pull_request:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Loaded Vibes
        run: npm install -g @loaded-vibes/cli
        
      - name: Run validation
        run: lv devcycle run validate --no-interactive --strict
        env:
          GITHUB_TOKEN: \${{ secrets.GITHUB_TOKEN }}
          
      - name: Upload logs
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: devcycle-logs
          path: .loaded-vibes/logs/`}
      </CodeBlock>

      <h3>Pre-commit Hook</h3>
      <CodeBlock title=".husky/pre-commit" language="bash">
        {`#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

# Run quick validation before commit
lv devcycle run validate --phases analyze --quick`}
      </CodeBlock>

      <h2>Common Workflows</h2>

      <h3>New Feature</h3>
      <CodeBlock language="bash">
        {`# 1. Create feature branch
git checkout -b feature/user-auth

# 2. Run scaffold with feature context
lv devcycle run scaffold --feature user-auth

# 3. Implement and test
lv devcycle run features test --feature user-auth

# 4. Validate before PR
lv devcycle run validate review

# 5. Deploy to staging
lv devcycle run deploy --env staging`}
      </CodeBlock>

      <h3>Bug Fix</h3>
      <CodeBlock language="bash">
        {`# 1. Start debug cycle
lv devcycle run debug --issue 123

# 2. Implement fix
lv devcycle run features --bugfix

# 3. Test fix
lv devcycle run test validate

# 4. Review and merge
lv devcycle run review`}
      </CodeBlock>

      <h3>Production Deployment</h3>
      <CodeBlock language="bash">
        {`# 1. Full validation
lv devcycle run validate --strict

# 2. Security audit
lv devcycle run security

# 3. Performance check
lv devcycle run perf --baseline main

# 4. Deploy with approval
lv devcycle run deploy --env production --wizard`}
      </CodeBlock>

      <h2>Troubleshooting</h2>

      <h3>Cycle Failed</h3>
      <CodeBlock language="bash">
        {`# Check what went wrong
lv logs --level error --cycle scaffold

# Get contextual help
lv hint error --detailed

# Restore and retry
lv devcycle checkpoints restore scaffold-design-2024-01-15
lv devcycle run scaffold --from-phase implement`}
      </CodeBlock>

      <h3>Stuck in Phase</h3>
      <CodeBlock language="bash">
        {`# Check current state
lv devcycle status --verbose

# Force phase transition
lv devcycle advance --force

# Reset cycle state
lv devcycle reset scaffold`}
      </CodeBlock>

      <Callout type="warning" title="Force with caution">
        Using <code>--force</code> flags bypasses safety checks. Only use them when you understand
        the consequences.
      </Callout>

      <h2>Next Steps</h2>
      <p>
        Learn how to <a href="/docs/guides/customization">customize DevCycles</a> for your specific
        needs, or explore <a href="/docs/guides/troubleshooting">troubleshooting</a> for more
        recovery options.
      </p>
    </DocPage>
  );
}
