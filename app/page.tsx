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
          <SectionLabel>Why loaded?</SectionLabel>
          <h2 className="font-display text-3xl tracking-tight text-white sm:text-4xl">
            A dev workflow that hits harder than your production incident log.
          </h2>
          <p className="max-w-2xl text-sm text-muted-foreground sm:text-base">
            Loaded Vibes is a synthwave-flavored framework for wiring AI agents, specs, and infra
            into one repeatable loop. Less yak shaving, more shipped features.
          </p>

          <FeatureGrid />
        </section>

        <section
          id="copy"
          className="mt-16 md:mt-24 animate-in fade-in-50 slide-in-from-bottom-12 duration-700"
        >
          <div className="rounded-3xl border border-white/5 bg-black/40 p-6 backdrop-blur lg:p-10">
            <article className="prose prose-invert prose-sm max-w-none md:prose-base">
              <h2>Bad vibes, clean code.</h2>
              <p>
                Loaded Vibes doesn’t pretend everything is fine. It assumes your backlog is cursed,
                your infra is haunted, and your product manager is already promising features you
                haven’t spec’d.
              </p>
              <p>
                Under the neon paint: execution summaries, dual JSON/Markdown artifacts, CI-gated
                dev cycles, and a CLI that talks in the same language you yell at your terminal in.
              </p>
              <ul>
                <li>Spec-driven workflows, not vibes-driven chaos.</li>
                <li>Typed, versioned artifacts that don’t rot on day three.</li>
                <li>A dashboard that looks like a retro console, not an Excel sheet.</li>
              </ul>
            </article>
          </div>
        </section>

        <section id="cta" className="mt-16 flex flex-col items-center gap-6 md:mt-24">
          <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
            Ready to weaponize your insomnia?
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="https://github.com/your-org/loaded-vibes"
              className="group inline-flex items-center gap-2 rounded-full border border-pink-500/60 bg-linear-to-r from-pink-500 to-cyan-400 px-6 py-3 text-sm font-medium text-black shadow-[0_0_30px_rgba(236,72,153,0.45)] transition hover:-translate-y-0.5 hover:shadow-[0_0_40px_rgba(34,211,238,0.7)]"
            >
              <span className="relative">
                Get the CLI
                <span className="pointer-events-none absolute inset-x-0 -bottom-px h-px bg-linear-to-r from-pink-500 via-white/60 to-cyan-400 opacity-0 transition group-hover:opacity-100" />
              </span>
            </a>
            <a
              href="#copy"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm text-muted-foreground transition hover:border-white/40 hover:text-white"
            >
              <span className="size-2 rounded-full bg-emerald-400/80 shadow-[0_0_18px_rgba(74,222,128,0.9)] animate-pulse" />
              <span>Read the execution lore</span>
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
        FRAMEWORK • AGENTIC • CI GATED
      </p>
      <h1 className="font-display text-4xl leading-tight text-white sm:text-5xl md:text-6xl">
        Loaded Vibes
        <span className="block bg-linear-to-r from-pink-500 via-purple-400 to-cyan-400 bg-clip-text text-transparent">
          for unruly developers.
        </span>
      </h1>
      <p className="max-w-xl text-sm text-muted-foreground sm:text-base">
        A synthwave-flavored dev framework that wires specs, AI, and infra into a single repeatable
        loop. Forget “move fast and break things” – this is{' '}
        <span className="font-semibold text-pink-300">
          move precisely and clown production less.
        </span>
      </p>

      <ul className="mt-4 flex flex-wrap gap-3 text-[11px] font-medium">
        {[
          'Bad vibes, clean code',
          'Solid infra, sharted loads',
          'JSON + Markdown execution summaries',
        ].map((item) => (
          <li
            key={item}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-4 py-2 text-muted-foreground"
          >
            <span className="size-1.5 rounded-full bg-linear-to-r from-pink-500 to-cyan-400" />
            <span>{item}</span>
          </li>
        ))}
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
        <a href="https://github.com/your-org/loaded-vibes" className="hover:text-white">
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
