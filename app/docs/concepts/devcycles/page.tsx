import { DocPage, Callout, CodeBlock } from '../../components';

export const metadata = {
  title: 'DevCycles - Loaded Vibes',
  description: 'The 18 canonical development cycles that power the Loaded Vibes workflow.',
};

const devcycles = [
  {
    id: 'init',
    name: 'Initialization',
    emoji: '🎬',
    description: 'Bootstrap the project structure, install dependencies, configure workspace.',
    phase: 'Setup',
  },
  {
    id: 'scaffold',
    name: 'Scaffolding',
    emoji: '🏗️',
    description: 'Generate boilerplate code, file structure, and initial implementations.',
    phase: 'Setup',
  },
  {
    id: 'config',
    name: 'Configuration',
    emoji: '⚙️',
    description: 'Set up environment variables, feature flags, and runtime configuration.',
    phase: 'Setup',
  },
  {
    id: 'verify',
    name: 'Verification',
    emoji: '✅',
    description: 'Validate project setup, dependencies, and configuration consistency.',
    phase: 'Setup',
  },
  {
    id: 'data',
    name: 'Data',
    emoji: '💾',
    description: 'Database schema, migrations, seed data, and data access patterns.',
    phase: 'Core',
  },
  {
    id: 'auth',
    name: 'Authentication',
    emoji: '🔐',
    description: 'User authentication, authorization, session management, ABAC policies.',
    phase: 'Core',
  },
  {
    id: 'test',
    name: 'Testing',
    emoji: '🧪',
    description: 'Unit tests, integration tests, test fixtures, and mocking setup.',
    phase: 'Core',
  },
  {
    id: 'validate',
    name: 'Validation',
    emoji: '🎯',
    description: 'End-to-end validation, acceptance criteria verification, quality gates.',
    phase: 'Core',
  },
  {
    id: 'features',
    name: 'Features',
    emoji: '✨',
    description: 'Feature implementation, component development, business logic.',
    phase: 'Build',
  },
  {
    id: 'debug',
    name: 'Debug',
    emoji: '🐛',
    description: 'Bug investigation, root cause analysis, fix implementation.',
    phase: 'Build',
  },
  {
    id: 'security',
    name: 'Security',
    emoji: '🛡️',
    description: 'Security audit, vulnerability scanning, hardening, OWASP compliance.',
    phase: 'Build',
  },
  {
    id: 'perf',
    name: 'Performance',
    emoji: '⚡',
    description: 'Performance profiling, optimization, caching, load testing.',
    phase: 'Build',
  },
  {
    id: 'observe',
    name: 'Observability',
    emoji: '📊',
    description: 'Logging, metrics, tracing, alerting, and monitoring setup.',
    phase: 'Ops',
  },
  {
    id: 'review',
    name: 'Code Review',
    emoji: '👀',
    description: 'Automated code review, PR analysis, best practice enforcement.',
    phase: 'Ops',
  },
  {
    id: 'docs',
    name: 'Documentation',
    emoji: '📚',
    description: 'API documentation, user guides, architecture diagrams, changelogs.',
    phase: 'Ops',
  },
  {
    id: 'cicd',
    name: 'CI/CD',
    emoji: '🔄',
    description: 'Pipeline configuration, build automation, deployment workflows.',
    phase: 'Ship',
  },
  {
    id: 'deploy',
    name: 'Deployment',
    emoji: '🚀',
    description: 'Environment provisioning, release management, rollback procedures.',
    phase: 'Ship',
  },
  {
    id: 'updates',
    name: 'Updates',
    emoji: '🔄',
    description: 'Dependency updates, framework upgrades, migration scripts.',
    phase: 'Ship',
  },
];

const phases = ['Setup', 'Core', 'Build', 'Ops', 'Ship'];

export default function DevcyclesPage() {
  return (
    <DocPage
      title="DevCycles"
      description="18 development cycles. One unified workflow. Zero vibes-driven chaos."
      breadcrumbs={[
        { label: 'Concepts', href: '/docs/concepts/architecture' },
        { label: 'DevCycles', href: '/docs/concepts/devcycles' },
      ]}
      prevPage={{ label: 'Architecture', href: '/docs/concepts/architecture' }}
      nextPage={{ label: 'Spec-Driven Workflow', href: '/docs/concepts/spec-driven-workflow' }}
    >
      <h2>What are DevCycles?</h2>
      <p>
        DevCycles are structured development workflows that combine AI-assisted tooling with human
        oversight. Each cycle handles a specific aspect of development and follows the 6-phase
        execution model:{' '}
        <strong>Analyze → Design → Implement → Validate → Reflect → Handoff</strong>.
      </p>

      <Callout type="info" title="Spec-driven by design">
        Every DevCycle reads from and writes to your project's PRD and tech requirements.
        Requirements are expressed in EARS notation for testable, unambiguous specifications.
      </Callout>

      <h2>The 18 Canonical DevCycles</h2>
      <p>DevCycles are organized into 5 phases based on their role in the development lifecycle:</p>

      {phases.map((phase) => (
        <div key={phase} className="mb-8">
          <h3 className="mb-4 text-lg">{phase} Phase</h3>
          <div className="not-prose grid gap-3 sm:grid-cols-2">
            {devcycles
              .filter((dc) => dc.phase === phase)
              .map((dc) => (
                <div
                  key={dc.id}
                  className="group rounded-xl border border-white/10 bg-black/30 p-4 transition hover:border-pink-500/40"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{dc.emoji}</span>
                    <div>
                      <p className="font-display text-sm text-white">{dc.name}</p>
                      <p className="font-mono text-[10px] text-cyan-300">{dc.id}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">{dc.description}</p>
                </div>
              ))}
          </div>
        </div>
      ))}

      <h2>Execution Phases</h2>
      <p>
        Each DevCycle follows a consistent 6-phase execution model. This ensures traceability and
        quality regardless of which cycle you're running.
      </p>

      <div className="not-prose my-8 rounded-xl border border-white/10 bg-black/50 p-6 font-mono text-xs">
        <pre className="text-cyan-300">
          {`┌──────────────────────────────────────────────────────────────┐
│                    DEVCYCLE EXECUTION                         │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│   ┌─────────┐   ┌─────────┐   ┌───────────┐                  │
│   │ ANALYZE │ → │ DESIGN  │ → │ IMPLEMENT │                  │
│   │         │   │         │   │           │                  │
│   │ • Read  │   │ • Plan  │   │ • Code    │                  │
│   │   specs │   │ • ADRs  │   │ • Test    │                  │
│   │ • EARS  │   │ • Tasks │   │ • Commit  │                  │
│   └─────────┘   └─────────┘   └───────────┘                  │
│        │             │              │                         │
│        ▼             ▼              ▼                         │
│   ┌──────────┐  ┌─────────┐   ┌──────────┐                   │
│   │ VALIDATE │← │ REFLECT │ ← │ HANDOFF  │                   │
│   │          │  │         │   │          │                   │
│   │ • QA     │  │ • Retro │   │ • PR     │                   │
│   │ • Gates  │  │ • Debt  │   │ • Deploy │                   │
│   │ • Audit  │  │ • Docs  │   │ • Next   │                   │
│   └──────────┘  └─────────┘   └──────────┘                   │
│                                                               │
└──────────────────────────────────────────────────────────────┘`}
        </pre>
      </div>

      <h3>Phase Breakdown</h3>
      <ol>
        <li>
          <strong>Analyze:</strong> Gather context, parse requirements (EARS notation), identify
          dependencies, generate confidence score
        </li>
        <li>
          <strong>Design:</strong> Create technical design, architecture decisions (ADRs), task
          breakdown based on confidence level
        </li>
        <li>
          <strong>Implement:</strong> Write code, run tests, create commits following conventional
          commit format
        </li>
        <li>
          <strong>Validate:</strong> Run automated tests, check quality gates, verify acceptance
          criteria
        </li>
        <li>
          <strong>Reflect:</strong> Refactor, document, identify tech debt, update changelogs
        </li>
        <li>
          <strong>Handoff:</strong> Create PR, prepare deployment, transition to next cycle
        </li>
      </ol>

      <h2>Running DevCycles</h2>
      <CodeBlock title="Basic usage" language="bash">
        {`# Run a specific DevCycle
lv devcycle run scaffold

# Run with options
lv devcycle run scaffold --feature user-auth --dry-run

# Chain multiple cycles
lv devcycle run init scaffold test

# Interactive mode
lv devcycle run --wizard`}
      </CodeBlock>

      <h2>DevCycle State</h2>
      <p>
        Each DevCycle maintains state in <code>.loaded-vibes/state.json</code>:
      </p>
      <CodeBlock title=".loaded-vibes/state.json" language="json">
        {`{
  "currentCycle": "scaffold",
  "currentPhase": "implement",
  "checkpoint": {
    "id": "scaffold-implement-2024-01-15",
    "status": "in-progress",
    "artifacts": ["src/auth/user.ts", "src/auth/session.ts"]
  },
  "history": [
    { "cycle": "init", "completedAt": "2024-01-15T10:00:00Z" }
  ]
}`}
      </CodeBlock>

      <h2>Checkpoints & Recovery</h2>
      <p>
        DevCycles automatically create checkpoints at phase boundaries. If execution fails, you can
        recover from the last checkpoint:
      </p>
      <CodeBlock language="bash">
        {`# View checkpoints
lv devcycle checkpoints

# Resume from last checkpoint
lv devcycle resume

# Restore to specific checkpoint
lv devcycle restore scaffold-design-2024-01-15`}
      </CodeBlock>

      <Callout type="tip" title="Checkpoint strategy">
        Checkpoints include file snapshots, git state, and execution logs. They're your safety net
        when experiments go sideways.
      </Callout>

      <h2>Custom DevCycles</h2>
      <p>You can create custom DevCycles for project-specific workflows:</p>
      <CodeBlock title="loaded-vibes.config.json" language="json">
        {`{
  "devcycles": {
    "active": ["init", "scaffold", "test", "deploy"],
    "custom": [
      {
        "id": "migrate-legacy",
        "name": "Legacy Migration",
        "instruction": ".github/instructions/migrate.instructions.md",
        "prompt": ".github/prompts/migrate.prompt.md",
        "toolset": ".github/toolsets/migrate.toolset.jsonc"
      }
    ]
  }
}`}
      </CodeBlock>

      <h2>Next Steps</h2>
      <p>
        Learn about the <a href="/docs/concepts/spec-driven-workflow">Spec-Driven Workflow</a> that
        powers DevCycle execution, or explore the{' '}
        <a href="/docs/guides/running-devcycles">Running DevCycles</a> guide for practical examples.
      </p>
    </DocPage>
  );
}
