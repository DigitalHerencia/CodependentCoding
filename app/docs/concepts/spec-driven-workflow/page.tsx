import { DocPage, Callout, CodeBlock } from '../../components';

export const metadata = {
  title: 'Spec-Driven Workflow - Loaded Vibes',
  description: 'EARS notation, 6-phase execution, and structured development methodology.',
};

export default function SpecDrivenWorkflowPage() {
  return (
    <DocPage
      title="Spec-Driven Workflow"
      description="Requirements that mean something. Workflows that work. Documentation that doesn't rot."
      breadcrumbs={[
        { label: 'Concepts', href: '/docs/concepts/architecture' },
        { label: 'Spec-Driven Workflow', href: '/docs/concepts/spec-driven-workflow' },
      ]}
      prevPage={{ label: 'DevCycles', href: '/docs/concepts/devcycles' }}
      nextPage={{ label: 'Artifacts', href: '/docs/concepts/artifacts' }}
    >
      <h2>Why Spec-Driven?</h2>
      <p>
        Most development workflows fail at the same point: requirements are vague, designs are
        implicit, and documentation is an afterthought. The spec-driven approach flips this by
        making requirements the foundation everything else builds on.
      </p>

      <div className="not-prose my-8 rounded-xl border border-pink-500/30 bg-pink-500/10 p-6">
        <p className="text-sm text-pink-200">
          <strong>Core principle:</strong> If you can't express a requirement in testable,
          unambiguous language, you don't actually have a requirement—you have a vibe. And vibes
          don't deploy.
        </p>
      </div>

      <h2>EARS Notation</h2>
      <p>
        EARS (Easy Approach to Requirements Syntax) provides a structured format for expressing
        requirements that are both human-readable and machine-parseable:
      </p>

      <h3>Requirement Patterns</h3>

      <div className="not-prose my-6 space-y-4">
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-cyan-300">Ubiquitous</p>
          <p className="font-mono text-sm text-white">THE SYSTEM SHALL [expected behavior]</p>
          <p className="mt-2 text-xs text-muted-foreground">
            For requirements that always apply, unconditionally.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-pink-300">Event-driven</p>
          <p className="font-mono text-sm text-white">
            WHEN [trigger event] THE SYSTEM SHALL [expected behavior]
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            For requirements triggered by specific events.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-purple-300">State-driven</p>
          <p className="font-mono text-sm text-white">
            WHILE [in specific state] THE SYSTEM SHALL [expected behavior]
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            For requirements that apply only during certain states.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-amber-300">
            Unwanted behavior
          </p>
          <p className="font-mono text-sm text-white">
            IF [unwanted condition] THEN THE SYSTEM SHALL [required response]
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            For handling error conditions and edge cases.
          </p>
        </div>

        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <p className="mb-2 text-[10px] uppercase tracking-wider text-emerald-300">Optional</p>
          <p className="font-mono text-sm text-white">
            WHERE [feature is included] THE SYSTEM SHALL [expected behavior]
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            For optional features or configuration-dependent behavior.
          </p>
        </div>
      </div>

      <h3>Example Requirements</h3>
      <CodeBlock title="docs/PRD.md" language="markdown">
        {`## Authentication Requirements

### REQ-AUTH-001: Session Creation
WHEN a user provides valid credentials
THE SYSTEM SHALL create a new authenticated session
AND return a signed JWT token with 24-hour expiration.

### REQ-AUTH-002: Session Validation
WHILE a user session is active
THE SYSTEM SHALL validate the JWT signature on each request
AND reject requests with expired or invalid tokens.

### REQ-AUTH-003: Rate Limiting
IF a user exceeds 100 login attempts per hour
THEN THE SYSTEM SHALL block further attempts for 15 minutes
AND log the incident to the security audit trail.`}
      </CodeBlock>

      <h2>The 6-Phase Execution Loop</h2>
      <p>
        Every DevCycle follows this structured execution model. No skipping phases. No vibes-driven
        shortcuts.
      </p>

      <div className="not-prose my-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-xl border border-cyan-500/40 bg-cyan-500/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-cyan-500/30 text-xs font-bold text-cyan-300">
                1
              </span>
              <h4 className="font-display text-sm text-cyan-300">Analyze</h4>
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Read specs and context</li>
              <li>• Parse EARS requirements</li>
              <li>• Generate confidence score</li>
              <li>• Identify dependencies</li>
            </ul>
          </div>

          <div className="rounded-xl border border-pink-500/40 bg-pink-500/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-pink-500/30 text-xs font-bold text-pink-300">
                2
              </span>
              <h4 className="font-display text-sm text-pink-300">Design</h4>
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Create technical design</li>
              <li>• Write ADRs for decisions</li>
              <li>• Build task breakdown</li>
              <li>• Adapt to confidence level</li>
            </ul>
          </div>

          <div className="rounded-xl border border-purple-500/40 bg-purple-500/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-purple-500/30 text-xs font-bold text-purple-300">
                3
              </span>
              <h4 className="font-display text-sm text-purple-300">Implement</h4>
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Write production code</li>
              <li>• Create tests alongside</li>
              <li>• Document as you go</li>
              <li>• Commit incrementally</li>
            </ul>
          </div>

          <div className="rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-amber-500/30 text-xs font-bold text-amber-300">
                4
              </span>
              <h4 className="font-display text-sm text-amber-300">Validate</h4>
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Run automated tests</li>
              <li>• Check quality gates</li>
              <li>• Verify acceptance criteria</li>
              <li>• Performance profiling</li>
            </ul>
          </div>

          <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-emerald-500/30 text-xs font-bold text-emerald-300">
                5
              </span>
              <h4 className="font-display text-sm text-emerald-300">Reflect</h4>
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Refactor for quality</li>
              <li>• Update documentation</li>
              <li>• Identify tech debt</li>
              <li>• Log lessons learned</li>
            </ul>
          </div>

          <div className="rounded-xl border border-white/20 bg-white/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <span className="flex size-6 items-center justify-center rounded-full bg-white/20 text-xs font-bold text-white">
                6
              </span>
              <h4 className="font-display text-sm text-white">Handoff</h4>
            </div>
            <ul className="space-y-1 text-xs text-muted-foreground">
              <li>• Create pull request</li>
              <li>• Generate summaries</li>
              <li>• Prepare deployment</li>
              <li>• Transition to next cycle</li>
            </ul>
          </div>
        </div>
      </div>

      <h2>Confidence-Based Execution</h2>
      <p>
        The Analyze phase generates a confidence score (0-100%) that determines how the Design phase
        proceeds:
      </p>

      <div className="not-prose my-6 overflow-hidden rounded-xl border border-white/10">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-white/5">
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Confidence
              </th>
              <th className="px-4 py-2 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Strategy
              </th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-emerald-300">High (&gt;85%)</td>
              <td className="px-4 py-2 text-muted-foreground">
                Full implementation. Skip PoC. Comprehensive plan.
              </td>
            </tr>
            <tr className="border-b border-white/5">
              <td className="px-4 py-2 font-mono text-xs text-amber-300">Medium (66-85%)</td>
              <td className="px-4 py-2 text-muted-foreground">
                Start with PoC/MVP. Validate approach before full build.
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-mono text-xs text-red-300">Low (&lt;66%)</td>
              <td className="px-4 py-2 text-muted-foreground">
                Research phase first. Re-analyze after knowledge gain.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Documentation Templates</h2>

      <h3>Action Documentation</h3>
      <p>Every action during execution gets logged with this structure:</p>
      <CodeBlock title="Action document template" language="markdown">
        {`### [TYPE] - [ACTION] - [TIMESTAMP]
**Objective**: Goal being accomplished
**Context**: Current state and references
**Decision**: Approach chosen and rationale
**Execution**: Steps taken with parameters
**Output**: Complete results and logs
**Validation**: Success verification
**Next**: Continuation plan`}
      </CodeBlock>

      <h3>Decision Records</h3>
      <p>All decisions are captured for future reference:</p>
      <CodeBlock title="Decision record template" language="markdown">
        {`### Decision - [TIMESTAMP]
**Decision**: What was decided
**Context**: Situation and data
**Options**: Alternatives evaluated
**Rationale**: Why this option
**Impact**: Anticipated consequences
**Review**: Reassessment conditions`}
      </CodeBlock>

      <Callout type="info" title="Traceability">
        Every code change links back to a requirement ID, decision record, and DevCycle phase. This
        creates an audit trail from feature request to production deployment.
      </Callout>

      <h2>Artifact Outputs</h2>
      <p>DevCycles generate dual-format outputs for both humans and machines:</p>

      <div className="not-prose my-6 grid gap-4 sm:grid-cols-2">
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <h4 className="mb-2 font-display text-sm text-cyan-300">NDJSON (Machine)</h4>
          <p className="text-xs text-muted-foreground">
            Structured logs for CI/CD integration, metrics, and programmatic analysis. One JSON
            object per line for easy streaming.
          </p>
          <p className="mt-2 font-mono text-[10px] text-cyan-400/60">.loaded-vibes/logs/*.ndjson</p>
        </div>
        <div className="rounded-xl border border-white/10 bg-black/30 p-4">
          <h4 className="mb-2 font-display text-sm text-pink-300">Markdown (Human)</h4>
          <p className="text-xs text-muted-foreground">
            Readable summaries for pull requests, changelogs, and documentation. Formatted for
            review and collaboration.
          </p>
          <p className="mt-2 font-mono text-[10px] text-pink-400/60">docs/summaries/*.md</p>
        </div>
      </div>

      <h2>Next Steps</h2>
      <p>
        Learn about the <a href="/docs/concepts/artifacts">Artifacts</a> that make up the
        framework's tooling, or dive into the{' '}
        <a href="/docs/guides/running-devcycles">Running DevCycles</a> guide for practical examples.
      </p>
    </DocPage>
  );
}
