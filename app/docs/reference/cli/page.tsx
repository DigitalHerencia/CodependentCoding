import { DocPage, CodeBlock, Callout, CommandTable } from '../../components';

export const metadata = {
  title: 'CLI Reference - Loaded Vibes',
  description: 'Complete command reference for the Loaded Vibes CLI.',
};

export default function CLIReferencePage() {
  return (
    <DocPage
      title="CLI Reference"
      description="Every command. Every flag. Every way to make your terminal do the thing."
      breadcrumbs={[
        { label: 'Reference', href: '/docs/reference/cli' },
        { label: 'CLI Commands', href: '/docs/reference/cli' },
      ]}
      prevPage={{ label: 'Artifacts', href: '/docs/concepts/artifacts' }}
      nextPage={{ label: 'Configuration', href: '/docs/reference/configuration' }}
    >
      <h2>Global Options</h2>
      <p>These options are available for all commands:</p>
      <CommandTable
        commands={[
          { cmd: '--help, -h', desc: 'Show help for command' },
          { cmd: '--version, -v', desc: 'Show CLI version' },
          { cmd: '--verbose', desc: 'Enable verbose output' },
          { cmd: '--quiet, -q', desc: 'Suppress non-essential output' },
          { cmd: '--no-color', desc: 'Disable colored output' },
          { cmd: '--json', desc: 'Output in JSON format' },
        ]}
      />

      <h2>Project Commands</h2>

      <h3>lv create</h3>
      <p>Create a new Loaded Vibes project from scratch.</p>
      <CodeBlock language="bash">
        {`lv create <project-name> [options]

Options:
  --stack <type>       Stack type: fullstack, api, frontend, cli, library
  --wizard             Use interactive wizard
  --template <name>    Use a specific template
  --skip-install       Skip dependency installation
  --git                Initialize git repository (default: true)

Examples:
  lv create my-app --stack fullstack
  lv create my-api --stack api --template express
  lv create my-lib --stack library --skip-install`}
      </CodeBlock>

      <h3>lv init</h3>
      <p>Initialize Loaded Vibes in an existing project.</p>
      <CodeBlock language="bash">
        {`lv init [options]

Options:
  --stack <type>       Stack type (auto-detected if not provided)
  --force              Overwrite existing configuration
  --minimal            Minimal setup without optional features
  --migrate            Migrate from a previous version

Examples:
  lv init
  lv init --stack fullstack --force
  lv init --migrate`}
      </CodeBlock>

      <h2>DevCycle Commands</h2>

      <h3>lv devcycle run</h3>
      <p>Execute one or more DevCycles.</p>
      <CodeBlock language="bash">
        {`lv devcycle run <cycle...> [options]

Options:
  --feature <name>     Feature context for the cycle
  --dry-run            Preview actions without executing
  --skip-checkpoints   Skip checkpoint creation
  --continue           Continue from last checkpoint
  --wizard             Interactive mode with confirmations

Cycles:
  init, scaffold, config, verify, data, auth, test, validate,
  features, debug, security, perf, observe, review, docs,
  cicd, deploy, updates

Examples:
  lv devcycle run scaffold
  lv devcycle run scaffold --feature user-auth
  lv devcycle run init scaffold test --dry-run
  lv devcycle run deploy --wizard`}
      </CodeBlock>

      <h3>lv devcycle status</h3>
      <p>Show current DevCycle state and progress.</p>
      <CodeBlock language="bash">
        {`lv devcycle status [options]

Options:
  --cycle <name>       Show status for specific cycle
  --history            Include execution history
  --json               Output as JSON

Examples:
  lv devcycle status
  lv devcycle status --cycle scaffold --history`}
      </CodeBlock>

      <h3>lv devcycle checkpoints</h3>
      <p>Manage DevCycle checkpoints.</p>
      <CodeBlock language="bash">
        {`lv devcycle checkpoints [action] [options]

Actions:
  list                 List all checkpoints (default)
  show <id>            Show checkpoint details
  restore <id>         Restore to a checkpoint
  delete <id>          Delete a checkpoint
  prune                Remove old checkpoints

Options:
  --cycle <name>       Filter by cycle
  --before <date>      Filter by date
  --keep <n>           Keep last N checkpoints (for prune)

Examples:
  lv devcycle checkpoints
  lv devcycle checkpoints show scaffold-design-2024-01-15
  lv devcycle checkpoints restore scaffold-design-2024-01-15
  lv devcycle checkpoints prune --keep 5`}
      </CodeBlock>

      <h2>Dashboard & Monitoring</h2>

      <h3>lv dashboard</h3>
      <p>Launch the interactive terminal dashboard.</p>
      <CodeBlock language="bash">
        {`lv dashboard [options]

Options:
  --watch              Auto-refresh on file changes
  --logs               Show live execution logs
  --minimal            Minimal UI mode

Examples:
  lv dashboard
  lv dashboard --watch --logs`}
      </CodeBlock>

      <h3>lv logs</h3>
      <p>View and search execution logs.</p>
      <CodeBlock language="bash">
        {`lv logs [options]

Options:
  --cycle <name>       Filter by cycle
  --phase <name>       Filter by phase
  --level <level>      Filter by level (info, warn, error)
  --since <time>       Logs since time (1h, 2d, etc.)
  --follow, -f         Follow log output
  --format <fmt>       Output format (text, json, table)

Examples:
  lv logs --cycle scaffold --since 1h
  lv logs --level error --follow
  lv logs --format json > logs.json`}
      </CodeBlock>

      <h2>Diagnostics</h2>

      <h3>lv doctor</h3>
      <p>Run diagnostic checks on your environment.</p>
      <CodeBlock language="bash">
        {`lv doctor [options]

Options:
  --fix                Attempt to fix issues automatically
  --verbose            Show detailed diagnostic info
  --json               Output as JSON

Checks:
  - Node.js version
  - npm/pnpm version
  - Git configuration
  - VS Code integration
  - MCP server connectivity
  - Framework integrity

Examples:
  lv doctor
  lv doctor --fix --verbose`}
      </CodeBlock>

      <Callout type="tip" title="Automated fixes">
        Many common issues can be fixed automatically with <code>lv doctor --fix</code>. This
        includes reinstalling MCP servers, resetting configurations, and fixing file permissions.
      </Callout>

      <h2>Upgrade & Maintenance</h2>

      <h3>lv upgrade</h3>
      <p>Upgrade framework components.</p>
      <CodeBlock language="bash">
        {`lv upgrade [options]

Options:
  --strategy <type>    Upgrade strategy: mirror, merge, sandbox
  --check              Check for updates without upgrading
  --force              Force upgrade without confirmation
  --backup             Create backup before upgrade (default: true)

Strategies:
  mirror  - Replace all framework files (clean slate)
  merge   - Merge updates preserving customizations
  sandbox - Apply to copy for testing

Examples:
  lv upgrade --check
  lv upgrade --strategy merge
  lv upgrade --strategy sandbox`}
      </CodeBlock>

      <h3>lv restore</h3>
      <p>Restore from backup or previous state.</p>
      <CodeBlock language="bash">
        {`lv restore [target] [options]

Targets:
  backup               Restore from latest backup
  checkpoint <id>      Restore to checkpoint
  version <version>    Restore to specific version

Options:
  --list               List available restore points
  --dry-run            Preview restore actions

Examples:
  lv restore --list
  lv restore backup
  lv restore checkpoint scaffold-design-2024-01-15`}
      </CodeBlock>

      <h2>Configuration</h2>

      <h3>lv config</h3>
      <p>Manage framework configuration.</p>
      <CodeBlock language="bash">
        {`lv config [action] [key] [value] [options]

Actions:
  get <key>            Get configuration value
  set <key> <value>    Set configuration value
  list                 List all configuration
  reset                Reset to defaults
  edit                 Open config in editor

Options:
  --global             Use global configuration
  --json               Output as JSON

Examples:
  lv config list
  lv config get features.ai.enabled
  lv config set features.telemetry.anonymous true
  lv config edit`}
      </CodeBlock>

      <h2>Artifact Management</h2>

      <h3>lv artifact</h3>
      <p>Create and manage framework artifacts.</p>
      <CodeBlock language="bash">
        {`lv artifact <action> <type> [name] [options]

Actions:
  create               Create new artifact
  list                 List artifacts
  validate             Validate artifacts
  sync                 Sync with templates

Types:
  prompt               Prompt file (.prompt.md)
  instructions         Instructions file (.instructions.md)
  toolset              Toolset file (.toolset.jsonc)
  agent                Agent definition

Options:
  --extends <name>     Extend existing artifact
  --applyTo <glob>     Set applyTo pattern (instructions)
  --template <name>    Use specific template

Examples:
  lv artifact create prompt my-task
  lv artifact create instructions my-domain --applyTo "**/domain/**"
  lv artifact list --type prompt
  lv artifact validate`}
      </CodeBlock>

      <h2>Utilities</h2>

      <h3>lv hint</h3>
      <p>Get contextual help based on project state.</p>
      <CodeBlock language="bash">
        {`lv hint [topic] [options]

Topics:
  (none)               Auto-detect from current state
  devcycle             DevCycle suggestions
  error                Help with last error
  next                 What to do next

Options:
  --detailed           Show detailed explanations

Examples:
  lv hint
  lv hint devcycle
  lv hint error --detailed`}
      </CodeBlock>

      <h3>lv docs</h3>
      <p>Access documentation.</p>
      <CodeBlock language="bash">
        {`lv docs [topic] [options]

Options:
  --open               Open in browser
  --search <query>     Search documentation

Examples:
  lv docs
  lv docs devcycles --open
  lv docs --search "EARS notation"`}
      </CodeBlock>

      <h3>lv telemetry</h3>
      <p>Manage telemetry settings.</p>
      <CodeBlock language="bash">
        {`lv telemetry <action>

Actions:
  status               Show current settings
  enable               Enable telemetry
  disable              Disable telemetry
  reset                Reset to defaults

Examples:
  lv telemetry status
  lv telemetry disable`}
      </CodeBlock>

      <h2>Tool Integration</h2>

      <h3>lv tools</h3>
      <p>Manage MCP tool servers.</p>
      <CodeBlock language="bash">
        {`lv tools <action> [options]

Actions:
  list                 List available tools
  status               Show tool status
  install <tool>       Install a tool
  uninstall <tool>     Uninstall a tool
  restart              Restart all tools

Options:
  --verbose            Show detailed info

Examples:
  lv tools list
  lv tools status
  lv tools install postgres
  lv tools restart`}
      </CodeBlock>

      <h2>Exit Codes</h2>
      <CommandTable
        commands={[
          { cmd: '0', desc: 'Success' },
          { cmd: '1', desc: 'General error' },
          { cmd: '2', desc: 'Invalid arguments' },
          { cmd: '3', desc: 'Configuration error' },
          { cmd: '4', desc: 'DevCycle failure' },
          { cmd: '5', desc: 'Checkpoint required' },
          { cmd: '10', desc: 'User cancelled' },
        ]}
      />

      <h2>Environment Variables</h2>
      <CodeBlock language="bash">
        {`# Core
LV_CONFIG_PATH       # Custom config file path
LV_LOG_LEVEL         # Log level (debug, info, warn, error)
LV_NO_COLOR          # Disable colored output
LV_NO_TELEMETRY      # Disable telemetry

# MCP Integration
GITHUB_TOKEN         # GitHub API token
DATABASE_URL         # Database connection string

# Development
LV_DEBUG             # Enable debug mode
LV_TRACE             # Enable trace logging`}
      </CodeBlock>

      <h2>Next Steps</h2>
      <p>
        See the <a href="/docs/reference/configuration">Configuration Reference</a> for detailed
        configuration options, or explore{' '}
        <a href="/docs/guides/running-devcycles">Running DevCycles</a> for practical examples.
      </p>
    </DocPage>
  );
}
