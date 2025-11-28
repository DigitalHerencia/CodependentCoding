import { DocPage, CodeBlock, Callout, FeatureCard } from '../../components';

export const metadata = {
  title: 'Quick Start - Loaded Vibes',
  description: 'Get up and running with Loaded Vibes in 5 minutes.',
};

export default function QuickstartPage() {
  return (
    <DocPage
      title="Quick Start"
      description="From zero to shipping in 5 minutes. No yak shaving required."
      breadcrumbs={[
        { label: 'Getting Started', href: '/docs/getting-started/installation' },
        { label: 'Quick Start', href: '/docs/getting-started/quickstart' },
      ]}
      prevPage={{ label: 'Installation', href: '/docs/getting-started/installation' }}
      nextPage={{ label: 'Project Structure', href: '/docs/getting-started/project-structure' }}
    >
      <div className="not-prose mb-8 overflow-hidden rounded-xl border border-white/10 bg-black/50 p-6 font-mono text-xs">
        <pre className="text-pink-300">
          {`    ╔═══════════════════════════════════════════════════════╗
    ║  _                    _          _  __   _____ _      ║
    ║ | |    ___   __ _  __| | ___  __| | \\ \\ / /_ _| |__   ║
    ║ | |   / _ \\ / _\` |/ _\` |/ _ \\/ _\` |  \\ V / | || '_ \\  ║
    ║ | |__| (_) | (_| | (_| |  __/ (_| |   | |  | || |_) | ║
    ║ |_____\\___/ \\__,_|\\__,_|\\___|\\__,_|   |_| |___|_.__/  ║
    ║                                                       ║
    ║  Bad vibes · Clean code · Solid infra · Sharted loads ║
    ╚═══════════════════════════════════════════════════════╝`}
        </pre>
      </div>

      <h2>Step 1: Create a New Project</h2>
      <p>
        The <code>lv create</code> command scaffolds a complete project with all framework assets
        pre-configured:
      </p>
      <CodeBlock title="Terminal" language="bash">
        {`# Create a new fullstack project
lv create my-app --stack fullstack

# Or use the interactive wizard
lv create my-app --wizard`}
      </CodeBlock>

      <Callout type="info" title="Stack options">
        Available stacks: <code>fullstack</code>, <code>api</code>, <code>frontend</code>,{' '}
        <code>cli</code>, <code>library</code>. Each includes appropriate DevCycles and
        configuration.
      </Callout>

      <h2>Step 2: Enter the Project</h2>
      <CodeBlock language="bash">
        {`cd my-app
code .   # Open in VS Code for best experience`}
      </CodeBlock>

      <h2>Step 3: Run Your First DevCycle</h2>
      <p>
        DevCycles are the core of Loaded Vibes. Start with the initialization cycle to set up your
        environment:
      </p>
      <CodeBlock title="Terminal" language="bash">
        {`# Run the initialization DevCycle
lv devcycle run init

# Watch the magic happen
lv dashboard`}
      </CodeBlock>

      <Callout type="tip" title="Dashboard">
        The dashboard is a terminal UI that shows real-time progress, phase transitions, and
        execution summaries. It's like watching your code write itself, but with more neon.
      </Callout>

      <h2>Step 4: Scaffold Your Features</h2>
      <p>
        Now that initialization is complete, scaffold your first feature using the scaffolding
        DevCycle:
      </p>
      <CodeBlock language="bash">
        {`# Scaffold a new feature
lv devcycle run scaffold --feature user-authentication

# The orchestrator will:
# 1. Generate boilerplate code
# 2. Create test stubs
# 3. Update project documentation
# 4. Commit with conventional message`}
      </CodeBlock>

      <h2>Step 5: Ship It</h2>
      <p>When you're ready to deploy, the deploy DevCycle handles everything:</p>
      <CodeBlock language="bash">
        {`# Run pre-deployment checks
lv devcycle run validate

# Deploy to your environment
lv devcycle run deploy --env production`}
      </CodeBlock>

      <h2>What Just Happened?</h2>
      <p>In those few commands, the framework:</p>

      <div className="not-prose grid gap-4 sm:grid-cols-2">
        <FeatureCard
          icon="📋"
          title="Generated specs"
          description="PRD and tech requirements with EARS notation"
        />
        <FeatureCard
          icon="🎨"
          title="Scaffolded code"
          description="Boilerplate following your stack conventions"
        />
        <FeatureCard
          icon="🧪"
          title="Created tests"
          description="Unit and integration test stubs"
        />
        <FeatureCard
          icon="📊"
          title="Logged everything"
          description="NDJSON execution summaries for CI"
        />
      </div>

      <h2>Explore More</h2>
      <p>You're now ready to dive deeper. Here's where to go next:</p>
      <ul>
        <li>
          <a href="/docs/concepts/devcycles">DevCycles</a> — Learn about all 18 development cycles
        </li>
        <li>
          <a href="/docs/reference/cli">CLI Reference</a> — Full command documentation
        </li>
        <li>
          <a href="/docs/guides/customization">Customization</a> — Make the framework yours
        </li>
      </ul>

      <div className="not-prose mt-8 rounded-xl border border-pink-500/30 bg-pink-500/10 p-6">
        <p className="text-sm text-pink-200">
          <strong>Pro tip:</strong> Run{' '}
          <code className="rounded bg-black/30 px-1.5 py-0.5 text-cyan-300">lv hint</code> anytime
          for contextual help based on your current project state. It's like having a senior dev who
          never gets annoyed at your questions.
        </p>
      </div>
    </DocPage>
  );
}
