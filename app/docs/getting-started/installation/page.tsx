import { DocPage, CodeBlock, Callout, CommandTable } from '../../components';

export const metadata = {
  title: 'Installation - Loaded Vibes',
  description: 'How to install the Loaded Vibes CLI and set up your development environment.',
};

export default function InstallationPage() {
  return (
    <DocPage
      title="Installation"
      description="Get the Loaded Vibes CLI installed and your environment configured in under 5 minutes."
      breadcrumbs={[
        { label: 'Getting Started', href: '/docs/getting-started/installation' },
        { label: 'Installation', href: '/docs/getting-started/installation' },
      ]}
      prevPage={{ label: 'Introduction', href: '/docs' }}
      nextPage={{ label: 'Quick Start', href: '/docs/getting-started/quickstart' }}
    >
      <h2>Prerequisites</h2>
      <p>Before installing Loaded Vibes, ensure your system meets these requirements:</p>

      <CommandTable
        commands={[
          { cmd: 'Node.js', desc: '≥ 18.0 (LTS recommended)' },
          { cmd: 'npm', desc: '≥ 9.0 or pnpm ≥ 8.0' },
          { cmd: 'Git', desc: '≥ 2.30' },
          { cmd: 'VS Code', desc: '≥ 1.85 (with GitHub Copilot extension)' },
        ]}
      />

      <Callout type="tip" title="Optional but recommended">
        Install the GitHub Copilot and GitHub Copilot Chat extensions for full AI-assisted
        development. The framework works without them, but you'll miss out on the good vibes.
      </Callout>

      <h2>Installation Methods</h2>

      <h3>npm (recommended)</h3>
      <CodeBlock title="Global installation" language="bash">
        {`npm install -g @loaded-vibes/cli`}
      </CodeBlock>

      <h3>pnpm</h3>
      <CodeBlock title="pnpm installation" language="bash">
        {`pnpm add -g @loaded-vibes/cli`}
      </CodeBlock>

      <h3>npx (no install)</h3>
      <CodeBlock title="Run without installing" language="bash">
        {`npx @loaded-vibes/cli init my-project`}
      </CodeBlock>

      <h2>Verify Installation</h2>
      <p>Confirm the CLI is installed correctly:</p>
      <CodeBlock language="bash">
        {`lv --version
# Output: @loaded-vibes/cli v1.0.0

lv doctor
# Checks environment, MCP servers, and VS Code integration`}
      </CodeBlock>

      <h2>Post-Install Setup</h2>

      <h3>1. Configure MCP Servers</h3>
      <p>
        Loaded Vibes uses Model Context Protocol servers for AI integration. The CLI will
        auto-detect your configuration, but you can also set it up manually:
      </p>
      <CodeBlock title=".vscode/mcp.json" language="json">
        {`{
  "servers": {
    "filesystem": { "command": "npx", "args": ["-y", "@anthropic/mcp-filesystem"] },
    "git": { "command": "npx", "args": ["-y", "@anthropic/mcp-git"] },
    "memory": { "command": "npx", "args": ["-y", "@anthropic/mcp-memory"] },
    "github": { "command": "npx", "args": ["-y", "@anthropic/mcp-github"] }
  }
}`}
      </CodeBlock>

      <h3>2. Set Up GitHub Token</h3>
      <p>For GitHub MCP server integration:</p>
      <CodeBlock language="bash">
        {`# Create a GitHub Personal Access Token with repo scope
# Then set it in your environment:
export GITHUB_TOKEN=ghp_your_token_here

# Or add to your shell profile (~/.zshrc, ~/.bashrc)`}
      </CodeBlock>

      <h3>3. Open in VS Code</h3>
      <p>
        After initializing a project, open it in VS Code to activate the workspace-specific settings
        and Copilot instructions:
      </p>
      <CodeBlock language="bash">{`code my-project`}</CodeBlock>

      <Callout type="info" title="Auto-configuration">
        The <code>lv init</code> command sets up VS Code settings, MCP configurations, and Copilot
        instructions automatically. You shouldn't need to configure anything manually unless you're
        customizing the framework.
      </Callout>

      <h2>Troubleshooting</h2>

      <h3>Command not found</h3>
      <p>
        If <code>lv</code> isn't recognized after installation:
      </p>
      <CodeBlock language="bash">
        {`# Check npm global bin is in PATH
npm config get prefix

# Add to PATH (example for zsh)
export PATH="$(npm config get prefix)/bin:$PATH"`}
      </CodeBlock>

      <h3>Permission errors</h3>
      <p>On macOS/Linux, if you get permission errors:</p>
      <CodeBlock language="bash">
        {`# Fix npm permissions (one-time setup)
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
export PATH=~/.npm-global/bin:$PATH`}
      </CodeBlock>

      <h3>MCP Server connection issues</h3>
      <CodeBlock language="bash">
        {`# Run diagnostics
lv doctor --verbose

# Reset MCP configuration
lv config --reset-mcp`}
      </CodeBlock>

      <Callout type="warning" title="Windows users">
        Some MCP servers may require WSL2 for optimal performance. If you encounter issues, run the
        CLI inside WSL2 or use the Docker-based installation method.
      </Callout>

      <h2>Next Steps</h2>
      <p>
        Now that you have the CLI installed, head to the{' '}
        <a href="/docs/getting-started/quickstart">Quick Start</a> guide to create your first
        project, or explore the <a href="/docs/concepts/architecture">Architecture</a> documentation
        to understand how the framework is structured.
      </p>
    </DocPage>
  );
}
