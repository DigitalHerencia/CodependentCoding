import { DocPage, Callout, CodeBlock } from '../../components';

export const metadata = {
  title: 'Artifacts - Loaded Vibes',
  description: 'Prompts, instructions, and toolsets that power AI-assisted development.',
};

export default function ArtifactsPage() {
  return (
    <DocPage
      title="Artifacts"
      description="Prompts, Instructions, and Toolsets. The unholy trinity of AI-assisted development."
      breadcrumbs={[
        { label: 'Concepts', href: '/docs/concepts/architecture' },
        { label: 'Artifacts', href: '/docs/concepts/artifacts' },
      ]}
      prevPage={{ label: 'Spec-Driven Workflow', href: '/docs/concepts/spec-driven-workflow' }}
      nextPage={{ label: 'CLI Commands', href: '/docs/reference/cli' }}
    >
      <h2>The Artifact Hierarchy</h2>
      <p>
        Loaded Vibes uses a layered artifact system that separates concerns and enables
        customization at multiple levels:
      </p>

      <div className="not-prose my-8 rounded-xl border border-white/10 bg-black/50 p-6 font-mono text-xs">
        <pre className="text-cyan-300">
          {`┌─────────────────────────────────────────────────────────────┐
│                      ARTIFACT LAYERS                         │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│   ┌─────────────────┐                                        │
│   │   TOOLSETS      │  ← Capability definitions              │
│   │   .toolset.jsonc│    (what tools are available)          │
│   └────────┬────────┘                                        │
│            │                                                 │
│   ┌────────▼────────┐                                        │
│   │  INSTRUCTIONS   │  ← Behavioral rules                    │
│   │  .instructions.md   (how to use the tools)               │
│   └────────┬────────┘                                        │
│            │                                                 │
│   ┌────────▼────────┐                                        │
│   │    PROMPTS      │  ← Task invocations                    │
│   │   .prompt.md    │    (what to accomplish)                │
│   └─────────────────┘                                        │
│                                                              │
└─────────────────────────────────────────────────────────────┘`}
        </pre>
      </div>

      <h2>Prompts</h2>
      <p>
        Prompts are task-specific invocations that combine context with instructions to accomplish
        specific goals. They're the "what" of AI-assisted development.
      </p>

      <h3>Structure</h3>
      <CodeBlock title=".github/prompts/feature.prompt.md" language="markdown">
        {`---
mode: agent
tools:
  - filesystem
  - git
  - github
description: Implement a new feature based on requirements
---

# Feature Implementation

You are implementing a new feature for the project.

## Context
- **Requirements**: #file:docs/PRD.md
- **Tech Specs**: #file:docs/TECH_REQUIREMENTS.md
- **Current Selection**: #selection

## Instructions
Follow the instructions in #file:.github/instructions/features.instructions.md

## Task
Implement the feature described in the current selection:

\`\`\`
#selection
\`\`\`

## Deliverables
1. Implementation code in appropriate location
2. Unit tests with >80% coverage
3. Updated documentation
4. Conventional commit message`}
      </CodeBlock>

      <h3>Invocation</h3>
      <CodeBlock language="bash">
        {`# In VS Code Copilot Chat
#prompt:feature

# Or via CLI
lv prompt run feature --selection "Add user authentication"`}
      </CodeBlock>

      <Callout type="tip" title="Prompt variables">
        Use <code>#file:</code>, <code>#selection</code>, <code>#codebase</code>, and{' '}
        <code>#terminalLastCommand</code> to inject dynamic context into prompts.
      </Callout>

      <h2>Instructions</h2>
      <p>
        Instructions define behavioral rules that shape how AI agents interact with your codebase.
        They're loaded hierarchically: global → stack → domain.
      </p>

      <h3>Structure</h3>
      <CodeBlock title=".github/instructions/nextjs.instructions.md" language="markdown">
        {`---
applyTo: "app/**/*.tsx,components/**/*.tsx"
---

# Next.js Development Instructions

## Component Guidelines
- Use Server Components by default
- Add 'use client' only when necessary
- Prefer composition over prop drilling

## File Conventions
- Use kebab-case for file names
- Colocate tests with components
- Export types from dedicated .types.ts files

## Styling
- Use Tailwind CSS for styling
- Follow the design tokens in globals.css
- Use CSS variables for theming

## Data Fetching
- Use Server Actions for mutations
- Cache aggressively with revalidation tags
- Handle loading and error states`}
      </CodeBlock>

      <h3>Layering Example</h3>
      <div className="not-prose my-6 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Layer
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                File
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Scope
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 text-muted-foreground">Global</td>
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">copilot-instructions.md</td>
              <td className="px-4 py-2 text-muted-foreground">All files (**)</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 text-muted-foreground">Stack</td>
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">nextjs.instructions.md</td>
              <td className="px-4 py-2 text-muted-foreground">app/**/*.tsx</td>
            </tr>
            <tr>
              <td className="px-4 py-2 text-muted-foreground">Domain</td>
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">auth.instructions.md</td>
              <td className="px-4 py-2 text-muted-foreground">**/auth/**</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Toolsets</h2>
      <p>
        Toolsets define what MCP tools are available and how they should be configured for specific
        tasks. They're the capability layer that enables AI actions.
      </p>

      <h3>Structure</h3>
      <CodeBlock title=".github/toolsets/default.toolset.jsonc" language="json">
        {`{
  "$schema": "https://json.schemastore.org/toolset.json",
  "name": "default",
  "description": "Default toolset for general development",
  "tools": {
    "filesystem": {
      "enabled": true,
      "config": {
        "allowedPaths": ["src/**", "tests/**", "docs/**"],
        "blockedPaths": ["node_modules/**", ".env*"]
      }
    },
    "git": {
      "enabled": true,
      "config": {
        "allowCommit": true,
        "requireConventionalCommits": true,
        "protectedBranches": ["main", "production"]
      }
    },
    "github": {
      "enabled": true,
      "config": {
        "allowPR": true,
        "allowIssues": true,
        "requireReviewers": true
      }
    },
    "postgres": {
      "enabled": true,
      "config": {
        "allowMigrations": false,
        "readOnly": false
      }
    }
  },
  "securityPolicy": {
    "requireApproval": ["destructive"],
    "blockPatterns": ["DROP TABLE", "DELETE FROM", "TRUNCATE"]
  }
}`}
      </CodeBlock>

      <h3>Tool Categories</h3>
      <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <h4 className="mb-2 font-display text-sm text-cyan-300">Filesystem</h4>
          <p className="text-xs text-muted-foreground">
            Read, write, and navigate project files. Constrained by allowedPaths.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <h4 className="mb-2 font-display text-sm text-pink-300">Git</h4>
          <p className="text-xs text-muted-foreground">
            Version control operations. Commits, branches, diffs, and history.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <h4 className="mb-2 font-display text-sm text-purple-300">GitHub</h4>
          <p className="text-xs text-muted-foreground">
            Pull requests, issues, reviews, and repository management.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <h4 className="mb-2 font-display text-sm text-amber-300">Database</h4>
          <p className="text-xs text-muted-foreground">
            PostgreSQL queries via Prisma MCP. Schema-aware and safe by default.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <h4 className="mb-2 font-display text-sm text-emerald-300">Memory</h4>
          <p className="text-xs text-muted-foreground">
            Persistent context storage. Knowledge graphs and session state.
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <h4 className="mb-2 font-display text-sm text-white">Fetch</h4>
          <p className="text-xs text-muted-foreground">
            HTTP requests to external services. Documentation, APIs, packages.
          </p>
        </div>
      </div>

      <h2>Artifact Locations</h2>
      <CodeBlock language="text">
        {`.github/
├── prompts/              # Task invocations
│   ├── feature.prompt.md
│   ├── bugfix.prompt.md
│   ├── refactor.prompt.md
│   └── review.prompt.md
├── instructions/         # Behavioral rules
│   ├── nextjs.instructions.md
│   ├── prisma.instructions.md
│   ├── testing.instructions.md
│   └── security.instructions.md
├── toolsets/             # Capability definitions
│   ├── default.toolset.jsonc
│   ├── readonly.toolset.jsonc
│   └── deploy.toolset.jsonc
└── copilot-instructions.md  # Global rules`}
      </CodeBlock>

      <h2>Creating Custom Artifacts</h2>

      <h3>Custom Prompt</h3>
      <CodeBlock language="bash">
        {`# Generate a new prompt from template
lv artifact create prompt my-task

# Edit the generated file
code .github/prompts/my-task.prompt.md`}
      </CodeBlock>

      <h3>Custom Instructions</h3>
      <CodeBlock language="bash">
        {`# Generate new instructions
lv artifact create instructions my-domain

# Specify the scope
lv artifact create instructions my-domain --applyTo "**/domain/**"`}
      </CodeBlock>

      <h3>Custom Toolset</h3>
      <CodeBlock language="bash">
        {`# Generate a new toolset
lv artifact create toolset my-workflow

# Base it on an existing toolset
lv artifact create toolset my-workflow --extends default`}
      </CodeBlock>

      <Callout type="warning" title="Validation">
        All artifacts are validated on creation and during DevCycle execution. Invalid artifacts
        will block the cycle with clear error messages.
      </Callout>

      <h2>Next Steps</h2>
      <p>
        Explore the <a href="/docs/reference/cli">CLI Reference</a> for artifact management
        commands, or learn about <a href="/docs/guides/customization">Customization</a> strategies
        for making the framework yours.
      </p>
    </DocPage>
  );
}
