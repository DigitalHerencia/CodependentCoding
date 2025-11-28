import { DocPage, CodeBlock, Callout } from '../../components';

export const metadata = {
  title: 'Troubleshooting - Loaded Vibes',
  description: 'Common issues and how to fix them.',
};

export default function TroubleshootingPage() {
  return (
    <DocPage
      title="Troubleshooting"
      description="When vibes go bad. Common issues and how to recover gracefully."
      breadcrumbs={[
        { label: 'Guides', href: '/docs/guides/running-devcycles' },
        { label: 'Troubleshooting', href: '/docs/guides/troubleshooting' },
      ]}
      prevPage={{ label: 'Upgrade Strategy', href: '/docs/guides/upgrade-strategy' }}
    >
      <h2>Quick Diagnostics</h2>
      <p>Start with the doctor command to identify issues:</p>

      <CodeBlock language="bash">
        {`# Run full diagnostics
lv doctor --verbose

# Attempt automatic fixes
lv doctor --fix

# Check specific component
lv doctor --check mcp
lv doctor --check git
lv doctor --check config`}
      </CodeBlock>

      <h2>Common Issues</h2>

      <h3>CLI Not Found</h3>
      <p>
        <strong>Symptom:</strong> <code>lv: command not found</code>
      </p>

      <CodeBlock language="bash">
        {`# Check if npm global bin is in PATH
npm config get prefix

# Add to PATH (bash/zsh)
export PATH="$(npm config get prefix)/bin:$PATH"

# Or reinstall globally
npm install -g @loaded-vibes/cli

# Verify installation
lv --version`}
      </CodeBlock>

      <h3>MCP Server Connection Failed</h3>
      <p>
        <strong>Symptom:</strong> <code>Error: MCP server 'filesystem' not responding</code>
      </p>

      <CodeBlock language="bash">
        {`# Check MCP status
lv tools status

# Restart MCP servers
lv tools restart

# Reinstall specific server
lv tools uninstall filesystem
lv tools install filesystem

# Check configuration
cat .vscode/mcp.json`}
      </CodeBlock>

      <Callout type="tip" title="MCP debugging">
        Set <code>LV_DEBUG=mcp</code> environment variable for detailed MCP connection logs.
      </Callout>

      <h3>DevCycle Stuck in Phase</h3>
      <p>
        <strong>Symptom:</strong> DevCycle doesn't progress past a phase
      </p>

      <CodeBlock language="bash">
        {`# Check current state
lv devcycle status --verbose

# View logs for the stuck phase
lv logs --cycle scaffold --phase implement --since 1h

# Force advance to next phase (use with caution)
lv devcycle advance --force

# Or reset and restart
lv devcycle reset scaffold
lv devcycle run scaffold`}
      </CodeBlock>

      <h3>Checkpoint Restore Failed</h3>
      <p>
        <strong>Symptom:</strong>{' '}
        <code>Error: Cannot restore checkpoint - file conflicts detected</code>
      </p>

      <CodeBlock language="bash">
        {`# View checkpoint details
lv devcycle checkpoints show <checkpoint-id>

# Stash local changes first
git stash

# Restore checkpoint
lv devcycle checkpoints restore <checkpoint-id>

# Apply stashed changes if needed
git stash pop`}
      </CodeBlock>

      <h3>Artifact Validation Failed</h3>
      <p>
        <strong>Symptom:</strong> <code>Invalid artifact: .github/prompts/my-prompt.prompt.md</code>
      </p>

      <CodeBlock language="bash">
        {`# Validate with detailed output
lv artifact validate --verbose

# Common issues:
# - Missing required frontmatter fields
# - Invalid YAML syntax
# - Incorrect tool references

# Regenerate from template
lv artifact create prompt my-prompt --force`}
      </CodeBlock>

      <h3>Git State Conflicts</h3>
      <p>
        <strong>Symptom:</strong> <code>Error: Uncommitted changes block operation</code>
      </p>

      <CodeBlock language="bash">
        {`# Check git state
git status

# Stash changes
git stash

# Run operation
lv devcycle run scaffold

# Restore changes
git stash pop

# Or commit first
git add -A
git commit -m "wip: save before devcycle"`}
      </CodeBlock>

      <h3>Configuration Parse Error</h3>
      <p>
        <strong>Symptom:</strong>{' '}
        <code>Error: Invalid configuration in loaded-vibes.config.json</code>
      </p>

      <CodeBlock language="bash">
        {`# Validate configuration
lv config validate

# Reset to defaults
lv config reset

# View effective configuration
lv config list --resolved

# Edit in VS Code for syntax highlighting
code loaded-vibes.config.json`}
      </CodeBlock>

      <h2>Recovery Procedures</h2>

      <h3>Reset Framework State</h3>
      <p>When things are completely broken, reset to a clean state:</p>

      <CodeBlock language="bash">
        {`# Soft reset - clear state, keep artifacts
lv reset --soft

# Hard reset - restore to post-install state
lv reset --hard

# Nuclear option - complete reinstall
rm -rf .loaded-vibes node_modules/.cache/@loaded-vibes
lv init --force`}
      </CodeBlock>

      <h3>Restore from Backup</h3>
      <CodeBlock language="bash">
        {`# List available backups
lv restore --list

# Restore most recent backup
lv restore backup

# Restore specific backup
lv restore backup 2024-01-15-pre-upgrade

# Restore only specific files
lv restore backup --files ".github/**"`}
      </CodeBlock>

      <h3>Fix Corrupted State File</h3>
      <CodeBlock language="bash">
        {`# Validate state file
lv state validate

# Repair if possible
lv state repair

# Reset state (loses in-progress work)
lv state reset

# Manually inspect
cat .loaded-vibes/state.json | jq`}
      </CodeBlock>

      <h2>Debug Mode</h2>
      <p>Enable debug mode for detailed output:</p>

      <CodeBlock language="bash">
        {`# Enable debug logging
export LV_DEBUG=true

# Enable trace logging (very verbose)
export LV_TRACE=true

# Debug specific components
export LV_DEBUG=mcp,devcycle,git

# Run with debug output
LV_DEBUG=true lv devcycle run scaffold`}
      </CodeBlock>

      <h2>Log Analysis</h2>
      <p>Analyze execution logs for issues:</p>

      <CodeBlock language="bash">
        {`# View recent errors
lv logs --level error --since 1h

# Search logs for specific text
lv logs --grep "connection failed"

# Export logs for support
lv logs --format json --since 24h > debug-logs.json

# Tail logs in real-time
lv logs --follow`}
      </CodeBlock>

      <h2>Getting Help</h2>

      <h3>Contextual Help</h3>
      <CodeBlock language="bash">
        {`# Get help based on current state
lv hint

# Get help for last error
lv hint error --detailed

# Get suggestions for what to do next
lv hint next`}
      </CodeBlock>

      <h3>Documentation</h3>
      <CodeBlock language="bash">
        {`# Search documentation
lv docs --search "checkpoint restore"

# Open docs in browser
lv docs --open

# Open specific topic
lv docs devcycles --open`}
      </CodeBlock>

      <h3>Community Support</h3>
      <p>If you're still stuck:</p>
      <ul>
        <li>
          <strong>GitHub Issues:</strong> Search existing issues or create a new one
        </li>
        <li>
          <strong>Discord:</strong> Real-time help from the community
        </li>
        <li>
          <strong>Stack Overflow:</strong> Tag with <code>loaded-vibes</code>
        </li>
      </ul>

      <h3>Bug Reports</h3>
      <p>When reporting bugs, include:</p>

      <CodeBlock language="bash">
        {`# Generate diagnostic report
lv doctor --report > diagnostic-report.txt

# Include version info
lv --version >> diagnostic-report.txt

# Include relevant logs
lv logs --since 1h --format json >> diagnostic-report.txt`}
      </CodeBlock>

      <h2>Prevention</h2>

      <h3>Best Practices</h3>
      <ol>
        <li>
          Run <code>lv doctor</code> before major operations
        </li>
        <li>
          Use <code>--dry-run</code> to preview changes
        </li>
        <li>Commit frequently during long DevCycles</li>
        <li>Keep backups of custom artifacts</li>
        <li>Review logs after each DevCycle completion</li>
      </ol>

      <h3>Monitoring</h3>
      <CodeBlock language="bash">
        {`# Set up health checks
lv config set monitoring.healthCheck.enabled true
lv config set monitoring.healthCheck.interval "1h"

# Enable automatic checkpoint creation
lv config set checkpoints.autoCreate true

# Set backup retention
lv config set upgrades.backupRetention 10`}
      </CodeBlock>

      <Callout type="info" title="Pro tip">
        Run <code>lv dashboard</code> in a terminal tab while working. It shows real-time health
        status and early warning signs of issues.
      </Callout>

      <h2>Quick Reference</h2>

      <div className="not-prose my-6 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Problem
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Quick Fix
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 text-muted-foreground">CLI not found</td>
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">
                npm i -g @loaded-vibes/cli
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 text-muted-foreground">MCP not responding</td>
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">lv tools restart</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 text-muted-foreground">DevCycle stuck</td>
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">
                lv devcycle reset [name]
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 text-muted-foreground">Config error</td>
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">lv config reset</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 text-muted-foreground">State corrupted</td>
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">lv state repair</td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-muted-foreground">Everything broken</td>
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">lv reset --hard</td>
            </tr>
          </tbody>
        </table>
      </div>
    </DocPage>
  );
}
