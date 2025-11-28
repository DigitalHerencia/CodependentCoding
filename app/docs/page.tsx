import Link from 'next/link';

export const metadata = {
  title: 'Documentation - Loaded Vibes',
  description:
    'Complete documentation for the Loaded Vibes framework. Learn how to build spec-driven, AI-assisted development workflows.',
};

const quickLinks = [
  {
    href: '/docs/getting-started/quickstart',
    title: 'Quick Start',
    description: 'Get up and running in 5 minutes with the Loaded Vibes CLI.',
    icon: '⚡',
  },
  {
    href: '/docs/concepts/devcycles',
    title: 'DevCycles',
    description: 'Explore the 18 canonical development cycles that power your workflow.',
    icon: '🔄',
  },
  {
    href: '/docs/reference/cli',
    title: 'CLI Reference',
    description: 'Complete command reference for the lv CLI tool.',
    icon: '💻',
  },
  {
    href: '/docs/guides/customization',
    title: 'Customization',
    description: 'Make the framework yours with custom prompts and instructions.',
    icon: '🎨',
  },
];

const highlights = [
  {
    title: '18 DevCycles',
    stat: 'Init → Updates',
    description: 'Full lifecycle coverage from scaffolding to maintenance.',
  },
  {
    title: 'Spec-Driven',
    stat: 'EARS Notation',
    description: 'Requirements that actually mean something to both humans and CI.',
  },
  {
    title: 'AI-Assisted',
    stat: '7 MCP Servers',
    description: 'AI agents with constrained, auditable, and replayable actions.',
  },
  {
    title: 'Dual Output',
    stat: 'JSON + Markdown',
    description: 'Structured data for machines, readable docs for humans.',
  },
];

export default function DocsPage() {
  return (
    <div className="space-y-12">
      {/* Hero */}
      <header className="space-y-4 border-b border-white/10 pb-8">
        <p className="text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
          Documentation
        </p>
        <h1 className="font-display text-4xl tracking-tight text-white sm:text-5xl">
          Loaded Vibes
          <span className="block bg-linear-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
            Framework Docs
          </span>
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          A synthwave-flavored development framework that wires AI agents, specs, and infrastructure
          into one repeatable loop. Bad vibes filtered. Clean code shipped.
        </p>
      </header>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {highlights.map((item) => (
          <div
            key={item.title}
            className="group rounded-xl border border-white/10 bg-black/30 p-4 transition hover:border-pink-500/40"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-pink-300">{item.title}</p>
            <p className="mt-1 font-display text-lg text-white">{item.stat}</p>
            <p className="mt-2 text-xs text-muted-foreground">{item.description}</p>
          </div>
        ))}
      </section>

      {/* Quick Links */}
      <section className="space-y-4">
        <h2 className="font-display text-xl text-white">Quick Links</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {quickLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="group flex gap-4 rounded-xl border border-white/10 bg-linear-to-br from-slate-950/80 via-slate-950/60 to-slate-900/80 p-4 transition hover:-translate-y-0.5 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.25)]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-xl">
                {link.icon}
              </span>
              <div>
                <h3 className="font-display text-base text-white group-hover:text-pink-300">
                  {link.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">{link.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Getting Started */}
      <section className="space-y-4">
        <h2 className="font-display text-xl text-white">Getting Started</h2>
        <div className="rounded-xl border border-white/10 bg-black/40 p-6">
          <p className="mb-4 text-muted-foreground">
            Ready to weaponize your workflow? Here's the shortest path to shipping:
          </p>
          <ol className="space-y-4">
            <li className="flex gap-4">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-xs font-bold text-pink-300">
                1
              </span>
              <div>
                <p className="font-medium text-white">Install the CLI</p>
                <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-3 text-xs">
                  <code className="text-cyan-300">npm install -g @loaded-vibes/cli</code>
                </pre>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-xs font-bold text-pink-300">
                2
              </span>
              <div>
                <p className="font-medium text-white">Initialize a project</p>
                <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-3 text-xs">
                  <code className="text-cyan-300">lv init my-project --stack fullstack</code>
                </pre>
              </div>
            </li>
            <li className="flex gap-4">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-pink-500/20 text-xs font-bold text-pink-300">
                3
              </span>
              <div>
                <p className="font-medium text-white">Start vibing</p>
                <pre className="mt-2 overflow-x-auto rounded-lg border border-white/10 bg-black/50 p-3 text-xs">
                  <code className="text-cyan-300">lv devcycle run scaffold</code>
                </pre>
              </div>
            </li>
          </ol>
        </div>
      </section>

      {/* Architecture Overview */}
      <section className="space-y-4">
        <h2 className="font-display text-xl text-white">The Three Layers</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-xl border border-cyan-500/30 bg-cyan-500/5 p-4">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-cyan-400" />
              <h3 className="font-display text-base text-cyan-300">Development</h3>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Your source-of-truth docs, specs, and templates. Where the framework gets built and
              maintained.
            </p>
            <p className="mt-3 font-mono text-[10px] text-cyan-400/60">
              .github/ · .vscode/ · docs/ · templates/
            </p>
          </div>
          <div className="rounded-xl border border-pink-500/30 bg-pink-500/5 p-4">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-pink-400" />
              <h3 className="font-display text-base text-pink-300">Framework</h3>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              The shipped payload. What end users receive after installation. Version-controlled and
              checksummed.
            </p>
            <p className="mt-3 font-mono text-[10px] text-pink-400/60">
              dist/.github/ · dist/.vscode/ · dist/cli/
            </p>
          </div>
          <div className="rounded-xl border border-purple-500/30 bg-purple-500/5 p-4">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-purple-400" />
              <h3 className="font-display text-base text-purple-300">Generated</h3>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              The output of DevCycles. Application code, summaries, and state managed by the
              orchestrator.
            </p>
            <p className="mt-3 font-mono text-[10px] text-purple-400/60">
              src/ · .loaded-vibes/ · *.summary.json
            </p>
          </div>
        </div>
      </section>

      {/* Faux console */}
      <section className="rounded-2xl border border-white/10 bg-black/50 p-6">
        <div className="mb-4 flex items-center justify-between text-[10px] text-muted-foreground">
          <span className="font-mono">loaded-vibes@docs ▸ intro</span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-emerald-400/80 animate-pulse" />
            <span className="text-emerald-300">LIVE</span>
          </span>
        </div>
        <div className="space-y-1 font-mono text-xs">
          <p className="text-sky-300">❯ echo &quot;Welcome to the docs&quot;</p>
          <p className="text-emerald-300/90">✔ You made it. The hard part is over.</p>
          <p className="text-amber-200/90">
            ! warning: reading documentation may cause sudden clarity and reduced chaos
          </p>
          <p className="text-fuchsia-200/90">
            → suggestion: start with the{' '}
            <Link href="/docs/getting-started/quickstart" className="underline hover:text-white">
              Quick Start
            </Link>{' '}
            or browse{' '}
            <Link href="/docs/concepts/devcycles" className="underline hover:text-white">
              DevCycles
            </Link>
          </p>
        </div>
      </section>

      {/* Footer nav */}
      <nav className="flex items-center justify-between border-t border-white/10 pt-6">
        <div />
        <Link
          href="/docs/getting-started/installation"
          className="group flex items-center gap-2 text-sm text-muted-foreground transition hover:text-white"
        >
          <span>Installation</span>
          <svg
            className="size-4 transition group-hover:translate-x-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </nav>
    </div>
  );
}
