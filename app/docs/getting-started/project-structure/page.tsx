import { DocPage, CodeBlock, Callout } from '../../components';

export const metadata = {
  title: 'Project Structure - Loaded Vibes',
  description:
    'Understanding the directory layout and file organization in a Loaded Vibes project.',
};

export default function ProjectStructurePage() {
  return (
    <DocPage
      title="Project Structure"
      description="A map of your project's territory. Know where everything lives."
      breadcrumbs={[
        { label: 'Getting Started', href: '/docs/getting-started/installation' },
        { label: 'Project Structure', href: '/docs/getting-started/project-structure' },
      ]}
      prevPage={{ label: 'Quick Start', href: '/docs/getting-started/quickstart' }}
      nextPage={{ label: 'Architecture', href: '/docs/concepts/architecture' }}
    >
      <h2>Overview</h2>
      <p>
        A Loaded Vibes project follows a consistent structure that separates framework assets from
        your application code. Here's what you'll find after running <code>lv create</code>:
      </p>

      <CodeBlock title="Project root" language="text">
        {`my-project/
├── .github/                    # GitHub Copilot & workflow assets
│   ├── agents/                 # Custom AI agent definitions
│   ├── instructions/           # Domain-specific instructions
│   ├── prompts/                # Reusable prompt files
│   ├── toolsets/               # Tool configurations
│   ├── workflows/              # GitHub Actions
│   └── copilot-instructions.md # Global Copilot rules
├── .vscode/                    # VS Code workspace settings
│   ├── settings.json           # Editor configuration
│   ├── extensions.json         # Recommended extensions
│   └── mcp.json                # MCP server configuration
├── .loaded-vibes/              # Framework runtime state
│   ├── state.json              # Current DevCycle state
│   ├── logs/                   # Execution logs (NDJSON)
│   ├── checkpoints/            # Phase checkpoints
│   └── cache/                  # Cached computations
├── docs/                       # Project documentation
│   ├── PRD.md                  # Product requirements
│   ├── TECH_REQUIREMENTS.md    # Technical specifications
│   └── decisions/              # Architecture Decision Records
├── src/                        # Your application code
│   ├── ...                     # (Stack-specific structure)
├── tests/                      # Test files
├── package.json                # Dependencies
└── loaded-vibes.config.json    # Framework configuration`}
      </CodeBlock>

      <h2>Key Directories</h2>

      <h3>.github/ — Copilot & Automation</h3>
      <p>Contains all GitHub Copilot customization and GitHub Actions workflows:</p>
      <CodeBlock language="text">
        {`.github/
├── agents/                     # AI agent profiles
│   ├── architect.agent.md      # Architecture decisions
│   ├── reviewer.agent.md       # Code review
│   └── debugger.agent.md       # Debugging assistance
├── instructions/               # Stack & domain rules
│   ├── nextjs.instructions.md  # Next.js patterns
│   ├── prisma.instructions.md  # Database conventions
│   └── testing.instructions.md # Test requirements
├── prompts/                    # Reusable prompts
│   ├── feature.prompt.md       # Feature implementation
│   ├── bugfix.prompt.md        # Bug fixing
│   └── refactor.prompt.md      # Refactoring
├── toolsets/                   # Tool configurations
│   └── default.toolset.jsonc   # MCP tool bindings
└── copilot-instructions.md     # Global project rules`}
      </CodeBlock>

      <Callout type="tip" title="Layered instructions">
        Instructions are loaded hierarchically: global → stack → domain. More specific instructions
        override general ones without duplicating rules.
      </Callout>

      <h3>.loaded-vibes/ — Runtime State</h3>
      <p>
        This directory contains all framework runtime data. It's gitignored by default but can be
        committed for reproducibility:
      </p>
      <CodeBlock language="text">
        {`.loaded-vibes/
├── state.json                  # Current orchestrator state
├── logs/
│   ├── 2024-01-15-init.ndjson  # DevCycle execution logs
│   └── 2024-01-15-scaffold.ndjson
├── checkpoints/
│   ├── init/                   # Phase snapshots
│   └── scaffold/
├── cache/
│   └── requirements/           # Cached requirement parsing
└── manifests/
    └── installed.json          # Framework version tracking`}
      </CodeBlock>

      <h3>.vscode/ — Workspace Settings</h3>
      <p>VS Code workspace configuration that activates framework features:</p>
      <CodeBlock title=".vscode/settings.json" language="json">
        {`{
  "github.copilot.chat.codeGeneration.instructions": [
    { "file": ".github/copilot-instructions.md" }
  ],
  "github.copilot.chat.testGeneration.instructions": [
    { "file": ".github/instructions/testing.instructions.md" }
  ],
  "editor.formatOnSave": true,
  "typescript.preferences.importModuleSpecifier": "relative"
}`}
      </CodeBlock>

      <h3>docs/ — Living Documentation</h3>
      <p>Project documentation that the framework reads and updates:</p>
      <CodeBlock language="text">
        {`docs/
├── PRD.md                      # Product requirements (EARS notation)
├── TECH_REQUIREMENTS.md        # Technical specifications
├── decisions/
│   ├── ADR-001-auth.md         # Architecture Decision Records
│   └── ADR-002-api.md
└── summaries/                  # Generated execution summaries
    └── 2024-01-15-feature-auth.md`}
      </CodeBlock>

      <h2>Configuration Files</h2>

      <h3>loaded-vibes.config.json</h3>
      <p>The main framework configuration file:</p>
      <CodeBlock title="loaded-vibes.config.json" language="json">
        {`{
  "version": "1.0.0",
  "stack": "fullstack",
  "features": {
    "ai": { "enabled": true, "provider": "copilot" },
    "telemetry": { "enabled": true, "anonymous": true },
    "upgrades": { "strategy": "merge", "autoBackup": true }
  },
  "devcycles": {
    "active": ["init", "scaffold", "test", "deploy"],
    "custom": []
  },
  "paths": {
    "src": "src",
    "tests": "tests",
    "docs": "docs"
  }
}`}
      </CodeBlock>

      <h3>package.json scripts</h3>
      <p>Standard npm scripts for common operations:</p>
      <CodeBlock title="package.json (scripts)" language="json">
        {`{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "test": "vitest",
    "lv": "lv",
    "lv:init": "lv devcycle run init",
    "lv:validate": "lv devcycle run validate",
    "lv:deploy": "lv devcycle run deploy"
  }
}`}
      </CodeBlock>

      <h2>Generated Files</h2>
      <p>
        DevCycles generate various files during execution. These are clearly marked with comments
        indicating their origin:
      </p>

      <CodeBlock title="Example generated file header" language="typescript">
        {`/**
 * @generated by Loaded Vibes
 * @devcycle scaffold
 * @phase implement
 * @timestamp 2024-01-15T10:30:00Z
 *
 * DO NOT EDIT - regenerate with: lv devcycle run scaffold --feature auth
 */

export interface User {
  id: string;
  email: string;
  createdAt: Date;
}`}
      </CodeBlock>

      <Callout type="warning" title="Generated file policy">
        Files marked <code>@generated</code> will be overwritten on the next DevCycle run. If you
        need to customize them, use the <code>--preserve-custom</code> flag or move custom code to
        non-generated files.
      </Callout>

      <h2>Gitignore Defaults</h2>
      <p>The framework sets up sensible gitignore defaults:</p>
      <CodeBlock title=".gitignore" language="text">
        {`# Loaded Vibes runtime (optional - commit for reproducibility)
.loaded-vibes/logs/
.loaded-vibes/cache/
.loaded-vibes/checkpoints/

# Keep state and manifests for reproducibility
!.loaded-vibes/state.json
!.loaded-vibes/manifests/

# Node
node_modules/
.next/
dist/

# Environment
.env*.local`}
      </CodeBlock>

      <h2>Next Steps</h2>
      <p>
        Now that you understand the project layout, learn about the{' '}
        <a href="/docs/concepts/architecture">three-layer architecture</a> that powers the
        framework, or dive into <a href="/docs/concepts/devcycles">DevCycles</a> to understand the
        development workflows.
      </p>
    </DocPage>
  );
}
