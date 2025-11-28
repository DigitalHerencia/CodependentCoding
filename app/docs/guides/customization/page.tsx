import { DocPage, CodeBlock, Callout } from '../../components';

export const metadata = {
  title: 'Customization - Loaded Vibes',
  description: 'Make the framework yours. Customize prompts, instructions, and DevCycles.',
};

export default function CustomizationPage() {
  return (
    <DocPage
      title="Customization"
      description="Make it yours. Bend the framework to your will without breaking it."
      breadcrumbs={[
        { label: 'Guides', href: '/docs/guides/running-devcycles' },
        { label: 'Customization', href: '/docs/guides/customization' },
      ]}
      prevPage={{ label: 'Running DevCycles', href: '/docs/guides/running-devcycles' }}
      nextPage={{ label: 'Upgrade Strategy', href: '/docs/guides/upgrade-strategy' }}
    >
      <h2>Customization Philosophy</h2>
      <p>
        Loaded Vibes is designed to be customized, not forked. The framework provides extension
        points at every layer so you can adapt it to your needs while still receiving updates.
      </p>

      <div className="not-prose my-8 rounded-xl border border-pink-500/30 bg-pink-500/10 p-6">
        <p className="text-sm text-pink-200">
          <strong>Golden rule:</strong> Extend, don't modify. Add your own artifacts instead of
          editing framework files. This keeps upgrades clean and your customizations safe.
        </p>
      </div>

      <h2>Custom Instructions</h2>
      <p>Add domain-specific coding rules that layer on top of framework defaults:</p>

      <h3>Create New Instructions</h3>
      <CodeBlock language="bash">
        {`# Generate from template
lv artifact create instructions my-domain

# With specific scope
lv artifact create instructions payments --applyTo "**/payments/**"`}
      </CodeBlock>

      <h3>Instruction Structure</h3>
      <CodeBlock title=".github/instructions/payments.instructions.md" language="markdown">
        {`---
applyTo: "**/payments/**,**/billing/**"
---

# Payment Domain Instructions

## Security Requirements
- All payment amounts must use decimal types, never floats
- PCI DSS compliance is mandatory for card data
- Log transaction IDs, never card numbers

## API Patterns
- Use idempotency keys for all mutations
- Implement retry with exponential backoff
- Return structured error responses

## Testing
- Mock all external payment provider calls
- Test edge cases: zero amounts, refunds, partial payments
- Include timezone edge cases for billing cycles`}
      </CodeBlock>

      <h3>Layering Instructions</h3>
      <p>Instructions are applied in order of specificity:</p>
      <ol>
        <li>
          <code>copilot-instructions.md</code> — Global rules
        </li>
        <li>
          <code>nextjs.instructions.md</code> — Stack rules
        </li>
        <li>
          <code>payments.instructions.md</code> — Domain rules
        </li>
      </ol>

      <Callout type="tip" title="Override behavior">
        More specific instructions can override general ones. If your payment instructions conflict
        with general rules, the payment rules win for files matching the <code>applyTo</code>{' '}
        pattern.
      </Callout>

      <h2>Custom Prompts</h2>
      <p>Create task-specific prompts for common operations:</p>

      <h3>Create New Prompt</h3>
      <CodeBlock language="bash">{`lv artifact create prompt migration`}</CodeBlock>

      <h3>Prompt Structure</h3>
      <CodeBlock title=".github/prompts/migration.prompt.md" language="markdown">
        {`---
mode: agent
tools:
  - filesystem
  - git
  - postgres
description: Create database migration for schema changes
---

# Database Migration

You are creating a database migration.

## Context
- **Schema**: #file:prisma/schema.prisma
- **Current Selection**: #selection

## Instructions
Follow #file:.github/instructions/prisma.instructions.md

## Task
Create a migration for:

\`\`\`
#selection
\`\`\`

## Requirements
1. Use Prisma migrate format
2. Include rollback steps
3. Add data migration if needed
4. Update seed data

## Output
- Migration file in prisma/migrations/
- Updated schema.prisma if needed
- Migration documentation`}
      </CodeBlock>

      <h3>Using Custom Prompts</h3>
      <CodeBlock language="bash">
        {`# In VS Code Copilot Chat
#prompt:migration

# Or via CLI
lv prompt run migration --selection "Add email verification field"`}
      </CodeBlock>

      <h2>Custom Toolsets</h2>
      <p>Define what tools are available for specific operations:</p>

      <h3>Create New Toolset</h3>
      <CodeBlock language="bash">
        {`# New toolset from scratch
lv artifact create toolset readonly

# Extend existing toolset
lv artifact create toolset deploy --extends default`}
      </CodeBlock>

      <h3>Toolset Configuration</h3>
      <CodeBlock title=".github/toolsets/deploy.toolset.jsonc" language="json">
        {`{
  "name": "deploy",
  "description": "Toolset for production deployments",
  "extends": "default",
  
  "tools": {
    "filesystem": {
      "enabled": true,
      "config": {
        "allowedPaths": ["src/**", "dist/**"],
        "blockedPaths": ["*.env*", "*.key", "secrets/**"]
      }
    },
    "git": {
      "enabled": true,
      "config": {
        "allowCommit": true,
        "allowPush": true,
        "allowedBranches": ["main", "release/*"]
      }
    },
    "github": {
      "enabled": true,
      "config": {
        "allowPR": false,
        "allowRelease": true,
        "requireApproval": true
      }
    }
  },
  
  "securityPolicy": {
    "requireApproval": ["all"],
    "auditAll": true,
    "blockPatterns": ["DROP", "DELETE", "TRUNCATE"]
  }
}`}
      </CodeBlock>

      <h2>Custom DevCycles</h2>
      <p>Create DevCycles for project-specific workflows:</p>

      <h3>Define in Configuration</h3>
      <CodeBlock title="loaded-vibes.config.json" language="json">
        {`{
  "devcycles": {
    "custom": [
      {
        "id": "onboard",
        "name": "Developer Onboarding",
        "description": "Set up new developer environment",
        "instruction": ".github/instructions/onboard.instructions.md",
        "prompt": ".github/prompts/onboard.prompt.md",
        "toolset": ".github/toolsets/default.toolset.jsonc",
        "phases": ["analyze", "implement", "validate"],
        "checkpoints": {
          "required": ["validate"],
          "autoCreate": true
        }
      }
    ]
  }
}`}
      </CodeBlock>

      <h3>Create Supporting Artifacts</h3>
      <CodeBlock language="bash">
        {`# Create instruction file
lv artifact create instructions onboard

# Create prompt file  
lv artifact create prompt onboard`}
      </CodeBlock>

      <h3>Run Custom DevCycle</h3>
      <CodeBlock language="bash">{`lv devcycle run onboard --wizard`}</CodeBlock>

      <h2>Custom Agents</h2>
      <p>Define specialized AI agents for specific roles:</p>

      <CodeBlock title=".github/agents/security-reviewer.agent.md" language="markdown">
        {`---
name: Security Reviewer
description: Reviews code for security vulnerabilities
tools:
  - filesystem
  - git
instructions:
  - .github/copilot-instructions.md
  - .github/instructions/security.instructions.md
---

# Security Reviewer Agent

You are a security-focused code reviewer. Your job is to identify
potential vulnerabilities and suggest fixes.

## Focus Areas
- Authentication and authorization flaws
- Input validation gaps
- SQL injection possibilities
- XSS vulnerabilities
- Sensitive data exposure
- Cryptographic weaknesses

## Review Process
1. Scan for common vulnerability patterns
2. Check authentication flows
3. Verify input sanitization
4. Review data handling
5. Assess cryptographic usage

## Output Format
For each issue found:
- Severity: Critical/High/Medium/Low
- Location: File and line number
- Description: What's wrong
- Recommendation: How to fix
- Reference: CWE or OWASP ID`}
      </CodeBlock>

      <h2>Modifying Global Rules</h2>
      <p>To safely modify global behavior, extend rather than replace:</p>

      <CodeBlock title=".github/copilot-instructions.md (adding to existing)" language="markdown">
        {`# Project-Specific Additions

## Custom Conventions
In addition to framework defaults, this project follows:

- Use snake_case for database columns
- Prefix private methods with underscore
- Include JSDoc for all exported functions

## Domain Context
This is an e-commerce platform. Key concepts:
- Products have variants and SKUs
- Orders go through fulfillment states
- Payments are handled by Stripe

## Team Preferences
- Prefer explicit over implicit
- Favor composition over inheritance
- Write tests before implementation`}
      </CodeBlock>

      <h2>Preserving Customizations</h2>

      <h3>During Upgrades</h3>
      <p>Use the merge upgrade strategy to preserve your changes:</p>
      <CodeBlock language="bash">
        {`lv upgrade --strategy merge

# Preview changes first
lv upgrade --strategy merge --dry-run`}
      </CodeBlock>

      <h3>Backup Custom Artifacts</h3>
      <CodeBlock language="bash">
        {`# Export customizations
lv artifact export --output customizations.tar.gz

# Import after fresh install
lv artifact import customizations.tar.gz`}
      </CodeBlock>

      <Callout type="warning" title="Framework files">
        Files marked <code>@framework</code> in their headers should not be modified directly.
        Create your own files that extend or override them.
      </Callout>

      <h2>Validation</h2>
      <p>Validate your customizations before committing:</p>
      <CodeBlock language="bash">
        {`# Validate all artifacts
lv artifact validate

# Check for conflicts with framework
lv doctor --verbose

# Test custom DevCycle
lv devcycle run my-custom-cycle --dry-run`}
      </CodeBlock>

      <h2>Next Steps</h2>
      <p>
        Learn about the <a href="/docs/guides/upgrade-strategy">upgrade strategy</a> to keep your
        customizations safe during updates, or explore{' '}
        <a href="/docs/guides/troubleshooting">troubleshooting</a> for common issues.
      </p>
    </DocPage>
  );
}
