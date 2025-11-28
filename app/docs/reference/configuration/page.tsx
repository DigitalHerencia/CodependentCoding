import { DocPage, CodeBlock, Callout } from '../../components';

export const metadata = {
  title: 'Configuration Reference - Loaded Vibes',
  description: 'Complete configuration options for the Loaded Vibes framework.',
};

export default function ConfigurationPage() {
  return (
    <DocPage
      title="Configuration Reference"
      description="Every knob, dial, and secret lever. Configure the framework to match your chaos."
      breadcrumbs={[
        { label: 'Reference', href: '/docs/reference/cli' },
        { label: 'Configuration', href: '/docs/reference/configuration' },
      ]}
      prevPage={{ label: 'CLI Commands', href: '/docs/reference/cli' }}
      nextPage={{ label: 'Running DevCycles', href: '/docs/guides/running-devcycles' }}
    >
      <h2>Configuration Files</h2>
      <p>Loaded Vibes uses several configuration files, each with a specific purpose:</p>

      <div className="not-prose my-6 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                File
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Purpose
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">
                loaded-vibes.config.json
              </td>
              <td className="px-4 py-2 text-muted-foreground">Main framework configuration</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">.vscode/settings.json</td>
              <td className="px-4 py-2 text-muted-foreground">VS Code workspace settings</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">.vscode/mcp.json</td>
              <td className="px-4 py-2 text-muted-foreground">MCP server configuration</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">.env.local</td>
              <td className="px-4 py-2 text-muted-foreground">Environment variables</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>loaded-vibes.config.json</h2>
      <p>The main configuration file with all framework options:</p>

      <CodeBlock title="loaded-vibes.config.json" language="json">
        {`{
  "$schema": "https://loaded-vibes.dev/schemas/config.json",
  "version": "1.0.0",
  "stack": "fullstack",
  
  "features": {
    "ai": {
      "enabled": true,
      "provider": "copilot",
      "model": "gpt-4o",
      "contextWindow": 128000
    },
    "telemetry": {
      "enabled": true,
      "anonymous": true,
      "endpoint": null
    },
    "upgrades": {
      "strategy": "merge",
      "autoBackup": true,
      "checkFrequency": "weekly"
    },
    "checkpoints": {
      "enabled": true,
      "maxCount": 50,
      "pruneAfterDays": 30
    }
  },
  
  "devcycles": {
    "active": [
      "init", "scaffold", "config", "verify",
      "data", "auth", "test", "validate",
      "features", "debug", "security", "perf",
      "observe", "review", "docs",
      "cicd", "deploy", "updates"
    ],
    "custom": [],
    "defaults": {
      "skipCheckpoints": false,
      "requireApproval": ["deploy", "security"],
      "parallelExecution": false
    }
  },
  
  "paths": {
    "src": "src",
    "tests": "tests",
    "docs": "docs",
    "artifacts": ".github",
    "state": ".loaded-vibes"
  },
  
  "git": {
    "conventionalCommits": true,
    "signCommits": false,
    "protectedBranches": ["main", "production"],
    "defaultBranch": "main"
  },
  
  "security": {
    "firewall": {
      "enabled": true,
      "blockPatterns": [
        "rm -rf",
        "DROP TABLE",
        "DELETE FROM * WHERE 1=1"
      ],
      "requireApproval": ["destructive", "external"]
    },
    "secrets": {
      "scanEnabled": true,
      "blockOnDetection": true
    }
  },
  
  "logging": {
    "level": "info",
    "format": "ndjson",
    "retention": "30d",
    "destinations": ["file", "console"]
  }
}`}
      </CodeBlock>

      <h3>Section Reference</h3>

      <h4>features.ai</h4>
      <div className="not-prose my-4 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Property
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Type
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Default
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">enabled</td>
              <td className="px-4 py-2 text-muted-foreground">boolean</td>
              <td className="px-4 py-2 text-muted-foreground">true</td>
              <td className="px-4 py-2 text-muted-foreground">Enable AI features</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">provider</td>
              <td className="px-4 py-2 text-muted-foreground">string</td>
              <td className="px-4 py-2 text-muted-foreground">"copilot"</td>
              <td className="px-4 py-2 text-muted-foreground">
                AI provider: copilot, openai, anthropic
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">model</td>
              <td className="px-4 py-2 text-muted-foreground">string</td>
              <td className="px-4 py-2 text-muted-foreground">"gpt-4o"</td>
              <td className="px-4 py-2 text-muted-foreground">Model to use</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">contextWindow</td>
              <td className="px-4 py-2 text-muted-foreground">number</td>
              <td className="px-4 py-2 text-muted-foreground">128000</td>
              <td className="px-4 py-2 text-muted-foreground">Context window size</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h4>features.upgrades</h4>
      <div className="not-prose my-4 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Property
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Type
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Default
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Description
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">strategy</td>
              <td className="px-4 py-2 text-muted-foreground">string</td>
              <td className="px-4 py-2 text-muted-foreground">"merge"</td>
              <td className="px-4 py-2 text-muted-foreground">mirror, merge, or sandbox</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">autoBackup</td>
              <td className="px-4 py-2 text-muted-foreground">boolean</td>
              <td className="px-4 py-2 text-muted-foreground">true</td>
              <td className="px-4 py-2 text-muted-foreground">Create backup before upgrade</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">checkFrequency</td>
              <td className="px-4 py-2 text-muted-foreground">string</td>
              <td className="px-4 py-2 text-muted-foreground">"weekly"</td>
              <td className="px-4 py-2 text-muted-foreground">never, daily, weekly, monthly</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>VS Code Settings</h2>
      <p>Workspace settings that integrate with GitHub Copilot and the editor:</p>

      <CodeBlock title=".vscode/settings.json" language="json">
        {`{
  // Copilot Integration
  "github.copilot.chat.codeGeneration.instructions": [
    { "file": ".github/copilot-instructions.md" }
  ],
  "github.copilot.chat.testGeneration.instructions": [
    { "file": ".github/instructions/testing.instructions.md" }
  ],
  "github.copilot.chat.reviewSelection.instructions": [
    { "file": ".github/instructions/review.instructions.md" }
  ],
  
  // Editor Settings
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "explicit"
  },
  
  // TypeScript
  "typescript.preferences.importModuleSpecifier": "relative",
  "typescript.updateImportsOnFileMove.enabled": "always",
  
  // Files
  "files.exclude": {
    "node_modules": true,
    ".next": true,
    ".loaded-vibes/cache": true
  },
  
  // Search
  "search.exclude": {
    "**/node_modules": true,
    "**/.loaded-vibes/logs": true
  }
}`}
      </CodeBlock>

      <h2>MCP Configuration</h2>
      <p>Model Context Protocol server configuration for AI tool access:</p>

      <CodeBlock title=".vscode/mcp.json" language="json">
        {`{
  "servers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-filesystem"],
      "env": {
        "ALLOWED_PATHS": "./src,./tests,./docs"
      }
    },
    "git": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-git"]
    },
    "memory": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-memory"],
      "env": {
        "MEMORY_PATH": "./.loaded-vibes/memory"
      }
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-github"],
      "env": {
        "GITHUB_TOKEN": "\${env:GITHUB_TOKEN}"
      }
    },
    "postgres": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-postgres"],
      "env": {
        "DATABASE_URL": "\${env:DATABASE_URL}"
      }
    },
    "fetch": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-fetch"]
    },
    "sequentialthinking": {
      "command": "npx",
      "args": ["-y", "@anthropic/mcp-sequentialthinking"]
    }
  }
}`}
      </CodeBlock>

      <Callout type="warning" title="Environment variables">
        MCP servers use environment variable substitution with <code>{'${env:VAR_NAME}'}</code>{' '}
        syntax. Ensure sensitive values are stored in <code>.env.local</code> and never committed.
      </Callout>

      <h2>Environment Variables</h2>
      <CodeBlock title=".env.local" language="bash">
        {`# Required
GITHUB_TOKEN=ghp_your_token_here

# Database (if using postgres MCP)
DATABASE_URL=postgresql://user:pass@localhost:5432/db

# Optional: Custom endpoints
LV_API_ENDPOINT=https://api.loaded-vibes.dev

# Optional: Logging
LV_LOG_LEVEL=debug
LV_TRACE=true

# Optional: Telemetry override
LV_NO_TELEMETRY=true`}
      </CodeBlock>

      <h2>Toolset Configuration</h2>
      <p>Toolsets define available MCP tools and their configuration:</p>

      <CodeBlock title=".github/toolsets/default.toolset.jsonc" language="json">
        {`{
  "$schema": "https://loaded-vibes.dev/schemas/toolset.json",
  "name": "default",
  "description": "Default toolset for general development",
  
  "tools": {
    "filesystem": {
      "enabled": true,
      "config": {
        "allowedPaths": ["src/**", "tests/**", "docs/**"],
        "blockedPaths": ["node_modules/**", ".env*", "*.key"],
        "maxFileSize": "10MB"
      }
    },
    "git": {
      "enabled": true,
      "config": {
        "allowCommit": true,
        "allowPush": false,
        "requireConventionalCommits": true,
        "protectedBranches": ["main", "production"]
      }
    },
    "github": {
      "enabled": true,
      "config": {
        "allowPR": true,
        "allowIssues": true,
        "allowReviews": true,
        "requireReviewers": true,
        "minReviewers": 1
      }
    },
    "postgres": {
      "enabled": true,
      "config": {
        "readOnly": false,
        "allowMigrations": false,
        "maxQueryTime": "30s",
        "blockedOperations": ["DROP DATABASE", "TRUNCATE"]
      }
    },
    "memory": {
      "enabled": true,
      "config": {
        "maxEntries": 1000,
        "ttl": "7d"
      }
    },
    "fetch": {
      "enabled": true,
      "config": {
        "allowedDomains": ["*.github.com", "*.npmjs.org"],
        "maxResponseSize": "5MB",
        "timeout": "30s"
      }
    }
  },
  
  "securityPolicy": {
    "requireApproval": ["destructive", "external"],
    "blockPatterns": [
      "rm -rf /",
      "DROP TABLE",
      "DELETE FROM .* WHERE 1=1"
    ],
    "auditAll": true
  }
}`}
      </CodeBlock>

      <h2>DevCycle Manifest</h2>
      <p>Custom DevCycle definitions in the config:</p>

      <CodeBlock title="loaded-vibes.config.json (custom devcycles)" language="json">
        {`{
  "devcycles": {
    "custom": [
      {
        "id": "migrate-legacy",
        "name": "Legacy Migration",
        "description": "Migrate code from legacy systems",
        "instruction": ".github/instructions/migrate.instructions.md",
        "prompt": ".github/prompts/migrate.prompt.md",
        "toolset": ".github/toolsets/migrate.toolset.jsonc",
        "phases": ["analyze", "design", "implement", "validate"],
        "checkpoints": {
          "required": ["design", "validate"],
          "autoCreate": true
        }
      }
    ]
  }
}`}
      </CodeBlock>

      <h2>Configuration Precedence</h2>
      <p>Configuration values are resolved in this order (later overrides earlier):</p>
      <ol>
        <li>Built-in defaults</li>
        <li>Global config (~/.loaded-vibes/config.json)</li>
        <li>Project config (loaded-vibes.config.json)</li>
        <li>Environment variables</li>
        <li>CLI flags</li>
      </ol>

      <Callout type="tip" title="View effective config">
        Use <code>lv config list --resolved</code> to see the final merged configuration with all
        overrides applied.
      </Callout>

      <h2>Next Steps</h2>
      <p>
        Learn how to <a href="/docs/guides/customization">customize the framework</a> for your
        specific needs, or explore <a href="/docs/guides/running-devcycles">Running DevCycles</a> to
        put your configuration to work.
      </p>
    </DocPage>
  );
}
