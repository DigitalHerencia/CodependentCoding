import Image from 'next/image';

export default function Page() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-grid">
      {/* Glow blobs */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -left-32 top-0 size-80 rounded-full bg-pink-500/30 blur-3xl animate-in fade-in zoom-in-75 duration-1000" />
        <div className="absolute -right-24 bottom-0 size-96 rounded-full bg-cyan-500/25 blur-3xl animate-in fade-in zoom-in-75 duration-1000 delay-150" />
      </div>

      {/* Noise overlay */}
      <div className="pointer-events-none fixed inset-0 -z-10 bg-[url('/noise.png')] opacity-[0.07] mix-blend-soft-light" />

      <div className="relative mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-6 sm:px-6 lg:px-8">
        <Header />

        <section className="mt-10 grid flex-1 items-center gap-12 md:mt-16 md:grid-cols-[1.1fr,0.9fr]">
          <HeroCopy />
          <HeroVisual />
        </section>

        <section
          id="features"
          className="mt-16 space-y-8 md:mt-24 animate-in fade-in-50 slide-in-from-bottom-8 duration-700"
        >
          <SectionLabel>Why Loaded Vibes?</SectionLabel>
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            Everything you need to build production-ready apps.
          </h2>
          <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
            Loaded Vibes orchestrates your entire development lifecycle with AI-powered DevCycles,
            requirement traceability, and enterprise-grade security—all in one framework.
          </p>

          <FeatureGrid />
        </section>

        <section
          id="copy"
          className="mt-16 md:mt-24 animate-in fade-in-50 slide-in-from-bottom-12 duration-700"
        >
          <div className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur lg:p-10">
            <article className="prose prose-invert prose-sm max-w-none md:prose-base">
              <h2>Built for the way you actually work.</h2>
              <p>
                Loaded Vibes assumes your backlog is ambitious, your timeline is tight, and your
                team needs guardrails that don't slow them down. We built a framework that keeps AI
                agents aligned with your requirements.
              </p>
              <p>
                Under the hood: 18 orchestrated DevCycles, dual JSON/Markdown execution summaries,
                Bad Vibes Firewall for destructive operations, and full requirement traceability
                from PRD to production.
              </p>
              <ul>
                <li>Spec-driven workflows with EARS notation requirements.</li>
                <li>Typed, versioned artifacts with automatic CHANGELOG updates.</li>
                <li>Retro-styled dashboard for real-time DevCycle monitoring.</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="cta" className="mt-20 flex flex-col items-center gap-8 md:mt-28">
          <div className="text-center space-y-3">
            <h2 className="font-display text-2xl text-white sm:text-3xl">
              Ready to ship with intention?
            </h2>
            <p className="text-sm text-muted-foreground max-w-md">
              Get started in seconds. One command, zero config drama.
            </p>
          </div>

          {/* CLI install command */}
          <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/60 px-5 py-3 font-mono text-sm backdrop-blur">
            <span className="text-muted-foreground">$</span>
            <code className="text-emerald-300">npx create-loaded-vibes my-app</code>
            <button
              type="button"
              className="ml-2 rounded-md p-1.5 text-muted-foreground transition hover:bg-white/10 hover:text-white"
              aria-label="Copy to clipboard"
            >
              <svg className="size-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/DigitalHerencia/LoadedVibes"
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-2.5 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              <svg className="size-5" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
              <span>View on GitHub</span>
            </a>
            <a
              href="/docs/getting-started/quickstart"
              className="group inline-flex items-center gap-2 rounded-lg border border-pink-500/50 bg-pink-500/10 px-6 py-3 text-sm font-semibold text-pink-300 transition hover:-translate-y-0.5 hover:border-pink-400 hover:bg-pink-500/20 hover:text-pink-200"
            >
              <span>Read the Docs</span>
              <svg
                className="size-4 transition group-hover:translate-x-0.5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                />
              </svg>
            </a>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}

function Header() {
  return (
    <header className="flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <span className="relative flex size-9 items-center justify-center rounded-xl bg-black/60 ring-1 ring-pink-500/60">
          <span className="absolute inset-0 rounded-xl bg-linear-to-tr from-pink-500/70 via-purple-500/40 to-cyan-400/70 opacity-60 blur-md" />
          <span className="relative text-xs font-black tracking-[0.18em] text-white">LV</span>
        </span>
        <div className="leading-tight">
          <p className="font-display text-sm font-semibold tracking-[0.18em] text-white">
            LOADED VIBES
          </p>
          <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
            bad vibes · clean code
          </p>
        </div>
      </div>

      <nav className="hidden items-center gap-6 text-xs font-medium text-muted-foreground sm:flex">
        <a href="#features" className="hover:text-white">
          Features
        </a>
        <a href="#copy" className="hover:text-white">
          Philosophy
        </a>
        <a href="/docs" className="hover:text-white">
          Docs
        </a>
        <a href="#cta" className="hover:text-white">
          Get started
        </a>
      </nav>
    </header>
  );
}

function HeroCopy() {
  return (
    <div className="space-y-6 animate-in fade-in-50 slide-in-from-left-4 duration-700">
      <p className="text-xs uppercase tracking-[0.28em] text-muted-foreground">
        AGENTIC FRAMEWORK • SPEC-DRIVEN • AI-POWERED
      </p>
      <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
        Loaded Vibes
        <span className="block bg-linear-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          Ship with intention.
        </span>
      </h1>
      <p className="max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        An enterprise-grade TypeScript framework that wires AI agents, specs, and infrastructure
        into one repeatable DevCycle.
        <span className="block mt-2 font-medium text-white/90">
          Less chaos. More shipped features.
        </span>
      </p>

      <ul className="mt-6 flex flex-wrap gap-3 text-[11px] font-medium">
        {['Next.js 15 + React 19', 'GitHub Copilot Agent Mode', '18 DevCycles', 'MCP Servers'].map(
          (item) => (
            <li
              key={item}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-muted-foreground"
            >
              <span className="size-1.5 rounded-full bg-linear-to-r from-pink-500 to-cyan-400" />
              <span>{item}</span>
            </li>
          )
        )}
      </ul>
    </div>
  );
}

function HeroVisual() {
  return (
    <div className="relative flex items-center justify-center animate-in fade-in-50 slide-in-from-right-4 duration-700">
      <div className="relative w-full max-w-md rounded-3xl border border-white/10 bg-black/50 p-4 shadow-[0_0_40px_rgba(14,165,233,0.55)] backdrop-blur">
        <div className="relative aspect-16/10 overflow-hidden rounded-2xl border border-white/10">
          <Image
            src="/banner.png"
            alt="Loaded Vibes neon banner"
            fill
            priority
            sizes="(min-width: 1024px) 420px, 100vw"
            className="object-cover"
          />
          <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-4">
            <p className="text-[11px] uppercase tracking-[0.24em] text-fuchsia-200/90">
              BAD VIBES · CLEAN CODE · SOLID INFRA · SHARTED LOADS
            </p>
          </div>
        </div>

        {/* Faux console */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-linear-to-br from-slate-950 to-slate-900 p-4 font-mono text-[11px] text-emerald-200">
          <div className="mb-2 flex items-center justify-between text-[10px] text-slate-400">
            <span>loaded-vibes@cli ▸ devcycle</span>
            <span className="flex gap-1">
              <span className="size-2 rounded-full bg-emerald-400/80 animate-pulse" />
              LIVE
            </span>
          </div>
          <ul className="space-y-1">
            <li className="text-sky-300">
              ❯ devcycle init <span className="text-slate-500">--vibes bad</span>
            </li>
            <li className="text-emerald-300/90">
              ✔ specs reconciled · artifacts synced · CI gate armed
            </li>
            <li className="text-amber-200/90">
              ! warning: uncommitted chaos detected in /experiments
            </li>
            <li className="text-fuchsia-200/90">
              → suggestion: ship the thing, then spiral responsibly
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.26em] text-muted-foreground">
      <span className="inline-flex size-1.5 rounded-full bg-linear-to-r from-pink-500 to-cyan-400" />
      {children}
    </p>
  );
}

const features = [
  {
    title: 'Spec-driven engine',
    body: 'PRDs, tech specs, and ADRs feed a single engine that spits out artifacts, not vibes. No more orphaned Notion docs.',
    tag: 'Ritualized sanity',
  },
  {
    title: 'Dual-mode summaries',
    body: 'JSON for CI, Markdown for humans. One run, two artifacts, zero excuses when prod is on fire.',
    tag: 'Readable diffs',
  },
  {
    title: 'Retro console dashboard',
    body: 'Ink-powered CLI dashboard that feels like an RGB terminal shrine to your worst decisions.',
    tag: 'Synthwave UI',
  },
  {
    title: 'Upgrade firewall',
    body: 'Mirror, Merge, or Sandbox every upgrade. Your custom prompts don’t get silently nuked on patch day.',
    tag: 'Bad vibes filter',
  },
];

function FeatureGrid() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 md:gap-6">
      {features.map((feature, idx) => (
        <article
          key={feature.title}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-linear-to-br from-slate-950/80 via-slate-950/60 to-slate-900/80 p-4 transition hover:-translate-y-1 hover:border-pink-500/70 hover:shadow-[0_0_40px_rgba(236,72,153,0.45)]"
        >
          <div className="pointer-events-none absolute inset-0 bg-linear-to-tr from-pink-500/10 via-transparent to-cyan-400/15 opacity-0 transition group-hover:opacity-100" />
          <div className="relative space-y-2">
            <p className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-muted-foreground">
              <span className="size-1.5 rounded-full bg-linear-to-r from-pink-500 to-cyan-400" />
              {feature.tag}
              <span className="ml-auto text-[9px] text-slate-500">0{idx + 1}</span>
            </p>
            <h3 className="font-display text-base text-white sm:text-lg">{feature.title}</h3>
            <p className="text-xs text-muted-foreground sm:text-sm">{feature.body}</p>
          </div>
        </article>
      ))}
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-[11px] text-muted-foreground sm:flex-row">
      <p>© {new Date().getFullYear()} Loaded Vibes. No roadmap, only rituals.</p>
      <div className="flex items-center gap-4">
        <a
          href="https://github.com/DigitalHerencia/LoadedVibes"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-white"
        >
          GitHub
        </a>
        <a href="/docs" className="hover:text-white">
          Docs
        </a>
        <a href="/docs/reference/cli" className="hover:text-white">
          CLI reference
        </a>
      </div>
    </footer>
  );
}
