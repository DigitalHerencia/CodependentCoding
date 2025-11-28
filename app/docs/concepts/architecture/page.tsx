import { DocPage, Callout } from '../../components';

export const metadata = {
  title: 'Architecture - Loaded Vibes',
  description: 'Understanding the three-layer architecture of the Loaded Vibes framework.',
};

export default function ArchitecturePage() {
  return (
    <DocPage
      title="Architecture"
      description="Three layers. Clear boundaries. No vibes crossing lanes."
      breadcrumbs={[
        { label: 'Concepts', href: '/docs/concepts/architecture' },
        { label: 'Architecture', href: '/docs/concepts/architecture' },
      ]}
      prevPage={{ label: 'Project Structure', href: '/docs/getting-started/project-structure' }}
      nextPage={{ label: 'DevCycles', href: '/docs/concepts/devcycles' }}
    >
      <h2>The Three Layers</h2>
      <p>
        Loaded Vibes uses a strict three-layer architecture to maintain separation of concerns and
        ensure predictable behavior. Each layer has clear ownership and responsibilities.
      </p>

      {/* Visual diagram */}
      <div className="not-prose my-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-xl border-2 border-cyan-500/50 bg-cyan-500/10 p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-cyan-500/30 text-sm">
              📦
            </span>
            <h3 className="font-display text-lg text-cyan-300">Development</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Source-of-truth assets: specs, templates, and maintainer configurations. Where the
            framework itself is authored.
          </p>
          <div className="mt-4 font-mono text-[10px] text-cyan-400/60">
            <p>.github/ · .vscode/ · docs/</p>
            <p>spec/ · templates/ · decisions/</p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-pink-500/50 bg-pink-500/10 p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-pink-500/30 text-sm">
              🚀
            </span>
            <h3 className="font-display text-lg text-pink-300">Framework</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            The shipped payload delivered to users. Version-controlled, checksummed, and treated as
            immutable after installation.
          </p>
          <div className="mt-4 font-mono text-[10px] text-pink-400/60">
            <p>dist/.github/ · dist/.vscode/</p>
            <p>dist/cli/ · dist/genaiscript/</p>
          </div>
        </div>

        <div className="rounded-xl border-2 border-purple-500/50 bg-purple-500/10 p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-lg bg-purple-500/30 text-sm">
              ⚡
            </span>
            <h3 className="font-display text-lg text-purple-300">Generated</h3>
          </div>
          <p className="text-sm text-muted-foreground">
            Output of DevCycle execution: application code, summaries, and runtime state. Managed by
            the orchestrator.
          </p>
          <div className="mt-4 font-mono text-[10px] text-purple-400/60">
            <p>src/ · tests/</p>
            <p>.loaded-vibes/ · *.summary.json</p>
          </div>
        </div>
      </div>

      <h2>Layer Boundaries</h2>
      <p>
        Each layer operates under strict rules to prevent cross-contamination and maintain
        traceability:
      </p>

      <h3>Development → Framework</h3>
      <ul>
        <li>Development assets reference Framework assets only through templates and manifests</li>
        <li>
          Templates in <code>templates/</code> seed artifacts in <code>dist/</code>
        </li>
        <li>No direct imports of runtime outputs during authoring</li>
      </ul>

      <h3>Framework → Generated</h3>
      <ul>
        <li>Framework provides instructions, prompts, and toolsets</li>
        <li>Generated code follows patterns defined in Framework layer</li>
        <li>Framework never directly modifies Generated files</li>
      </ul>

      <h3>Generated → Framework</h3>
      <ul>
        <li>Generated files can read Framework assets</li>
        <li>Generated files never modify Framework assets</li>
        <li>Feedback flows through DevCycle execution summaries</li>
      </ul>

      <Callout type="warning" title="Boundary violations">
        Crossing layer boundaries without using proper channels (templates, manifests, DevCycle
        outputs) will trigger warnings from <code>lv doctor</code> and may cause unpredictable
        upgrade behavior.
      </Callout>

      <h2>Data Flow</h2>
      <p>Data flows through the system in a predictable pattern:</p>

      <div className="not-prose my-8 rounded-xl border border-white/10 bg-black/50 p-6 font-mono text-xs">
        <pre className="text-cyan-300">
          {`┌─────────────────────────────────────────────────────────────┐
│                     DEVELOPMENT LAYER                        │
│  docs/PRD.md → templates/*.template.md → spec/*.spec.md     │
└─────────────────────────────┬───────────────────────────────┘
                              │ Template Expansion
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      FRAMEWORK LAYER                         │
│  dist/.github/ ← prompts, instructions, toolsets, agents   │
│  dist/.vscode/ ← workspace settings, MCP configuration     │
│  dist/cli/     ← CLI commands, dashboard components        │
└─────────────────────────────┬───────────────────────────────┘
                              │ DevCycle Execution
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      GENERATED LAYER                         │
│  src/          ← application code, components, services     │
│  tests/        ← unit tests, integration tests              │
│  .loaded-vibes/ ← state, logs, checkpoints                  │
└─────────────────────────────────────────────────────────────┘`}
        </pre>
      </div>

      <h2>Orchestrator Role</h2>
      <p>
        The orchestrator is the central coordinator that manages state transitions and ensures layer
        integrity:
      </p>
      <ul>
        <li>
          <strong>State Management:</strong> Tracks current DevCycle, phase, and checkpoint status
        </li>
        <li>
          <strong>Artifact Resolution:</strong> Loads prompts, instructions, and toolsets from the
          correct layer
        </li>
        <li>
          <strong>Execution Logging:</strong> Records all actions in NDJSON format for auditability
        </li>
        <li>
          <strong>Boundary Enforcement:</strong> Prevents unauthorized cross-layer modifications
        </li>
      </ul>

      <h2>MCP Integration</h2>
      <p>Model Context Protocol servers provide controlled access to system capabilities:</p>

      <div className="not-prose my-6 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Server
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Purpose
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Layer Access
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">filesystem</td>
              <td className="px-4 py-2 text-muted-foreground">File read/write operations</td>
              <td className="px-4 py-2 text-muted-foreground">Generated, Framework (read)</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">git</td>
              <td className="px-4 py-2 text-muted-foreground">Version control operations</td>
              <td className="px-4 py-2 text-muted-foreground">
                All layers (read), Generated (write)
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">memory</td>
              <td className="px-4 py-2 text-muted-foreground">Persistent context storage</td>
              <td className="px-4 py-2 text-muted-foreground">.loaded-vibes/ only</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">postgres</td>
              <td className="px-4 py-2 text-muted-foreground">Database operations</td>
              <td className="px-4 py-2 text-muted-foreground">Generated layer data only</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">github</td>
              <td className="px-4 py-2 text-muted-foreground">GitHub API integration</td>
              <td className="px-4 py-2 text-muted-foreground">External service</td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">fetch</td>
              <td className="px-4 py-2 text-muted-foreground">HTTP requests</td>
              <td className="px-4 py-2 text-muted-foreground">External services</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs text-cyan-300">sequentialthinking</td>
              <td className="px-4 py-2 text-muted-foreground">Multi-step reasoning</td>
              <td className="px-4 py-2 text-muted-foreground">Orchestrator internal</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Callout type="info" title="Security boundary">
        MCP servers operate within the Bad Vibes Firewall. Destructive operations require explicit
        human approval through checkpoint confirmation.
      </Callout>

      <h2>Next Steps</h2>
      <p>
        Now that you understand the architecture, explore{' '}
        <a href="/docs/concepts/devcycles">DevCycles</a> to learn how the framework orchestrates
        development workflows across these layers.
      </p>
    </DocPage>
  );
}
